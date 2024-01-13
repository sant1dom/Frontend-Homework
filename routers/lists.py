from fastapi import FastAPI, Depends, HTTPException, APIRouter
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, sessionmaker, Session
from database import Base, engine, fill_db, get_db, DBMovie, DBMovieList, DBLike, DBComment
from models import MovieList
from routers.auth import user_dependency

router = APIRouter()

@router.get("/all_lists", response_model=list[MovieList])
async def get_all_lists(user: user_dependency, db: Session = Depends(get_db)) -> list[MovieList]:
    if not user["is_superuser"]:
        raise HTTPException(status_code=403, detail="You are not allowed to view this resource")

    lists =  db.query(DBMovieList).all()
    lists = [MovieList(**list.__dict__) for list in lists]
    return lists

