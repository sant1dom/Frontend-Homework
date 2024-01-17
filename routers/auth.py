import os
import random
from datetime import timedelta, datetime
from typing import Annotated

import aiofiles
from fastapi.params import File
from jose import JWTError, jwt
from fastapi import APIRouter, HTTPException, Depends, UploadFile
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from starlette.responses import Response

from database import db_dependency, DBUser, DBMovieList
from models import UserCreate, User, Token, UserReturn, MovieList

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)

SECRET_KEY = "197b0v9b3b0b4b4b9b9b9b9b0b9b0b9b0fe3443b"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/auth/login")


def authenticate_user(email: str, password: str, db: db_dependency) -> bool | DBUser:
    user = db.query(DBUser).filter(DBUser.email == email).first()
    if user is None or not user.is_active or not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user


def create_access_token(id: int, email: str, is_superuser: bool, profile_image: str, expires_delta: timedelta):
    to_encode = {"id": id, "email": email, "is_superuser": is_superuser, "profile_image": profile_image}
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        user_id: int = payload.get("id")
        if email is None or user_id is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return {"email": email, "id": user_id, "is_superuser": payload.get("is_superuser"),
                "profile_image": payload.get("profile_image")}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")


@router.post("/register", status_code=201)
async def create_user(user: UserCreate, db: db_dependency):
    db_user = DBUser(email=user.email, hashed_password=user.password, is_active=True, is_superuser=False,
                     profile_image="static/profile_images/base_avatar.jpg")
    db_user.hashed_password = bcrypt_context.hash(db_user.hashed_password)
    db_user.movie_lists = []
    db_user.movie_lists.append(DBMovieList(name="Watchlist", user=db_user, movies=[], comments=[], likes=[]))
    db_user.movie_lists.append(DBMovieList(name="Favourites", user=db_user, movies=[], comments=[], likes=[]))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    token = create_access_token(db_user.id, db_user.email, db_user.is_superuser, db_user.profile_image,
                                timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"id": db_user.id, "email": db_user.email, "is_superuser": db_user.is_superuser, "access_token": token,
            "profile_image": db_user.profile_image, "expiration": ACCESS_TOKEN_EXPIRE_MINUTES, "is_active": True}


@router.post("/login")
async def login_user(response: Response, formData: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    user: [bool | DBUser] = authenticate_user(formData.username, formData.password, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(user.id, user.email, user.is_superuser, user.profile_image,
                                timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    response.set_cookie("access_token", f"{token}", httponly=True)
    return {"id": user.id, "email": user.email, "is_superuser": user.is_superuser, "access_token": token,
            "profile_image": user.profile_image, "expiration": ACCESS_TOKEN_EXPIRE_MINUTES}


@router.get("/current_user")
async def get_user(user: Annotated[dict, Depends(get_current_user)]):
    return user


@router.post("/update_profile_image")
async def update_profile_image(user: Annotated[dict, Depends(get_current_user)], db: db_dependency,
                               file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(status_code=400, detail="File must be an image")
    if len(file.file.read()) > 5242880:
        raise HTTPException(status_code=400, detail="File size must be less than 5 MB")
    file.file.seek(0)
    content = file.file.read()
    user_id = user["id"]
    user = db.query(DBUser).filter(DBUser.id == user_id).first()
    file_name = f"static/profile_images/{user_id}_{random.randint(0, 1000)}.{file.content_type.split('/')[1]}"
    async with aiofiles.open(file_name, 'wb') as out_file:
        await out_file.write(content)
    try:
        if user.profile_image != "static/profile_images/base_avatar.jpg":
            os.remove(user.profile_image)
    except OSError:
        pass
    user.profile_image = file_name
    db.commit()
    db.refresh(user)
    return user.profile_image


@router.post("/refresh_token")
async def refresh_token(user: Annotated[dict, Depends(get_current_user)], response: Response, db: db_dependency):
    user = db.query(DBUser).filter(DBUser.id == user["id"]).first()
    token = create_access_token(user.id, user.email, user.is_superuser, user.profile_image, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    response.set_cookie(key="access_token", value=f"{token}", httponly=True)
    return {"access_token": token, "expiration": ACCESS_TOKEN_EXPIRE_MINUTES}


user_dependency = Annotated[dict, Depends(get_current_user)]
