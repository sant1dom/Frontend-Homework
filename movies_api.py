import time
from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager

import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI, Depends, HTTPException
from fastapi_csrf_protect import CsrfProtect
from pydantic import BaseModel
from sqlalchemy import create_engine, and_, func
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, sessionmaker, Session
from starlette.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.staticfiles import StaticFiles
import re

from LogConfig import LogConfig
from database import Base, engine, fill_db, get_db, DBMovie
from exceptions_handlers import rate_limit_exceeded_handler
from models import Movie, MovieUpdate, MovieCreate
from routers import site, auth
from routers.auth import user_dependency

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

import logging
from logging.config import dictConfig

dictConfig(LogConfig().model_dump())
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    # Fill the database with some movies
    fill_db()
    yield
    Base.metadata.drop_all(bind=engine)


limiter = Limiter(key_func=get_remote_address)
app = FastAPI(lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(site.router)
app.include_router(auth.router)


@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    start_time = time.time()
    logger.info({
        "event": "request_received",
        "method": request.method,
        "url": str(request.url),
        "headers": dict(request.headers),
        "client": request.client.host,
    })
    try:
        response = await call_next(request)
        end_time = time.time()
        logger.info({
            "event": "request_processed",
            "method": request.method,
            "url": str(request.url),
            "status_code": response.status_code,
            "time_taken": end_time - start_time,
        })
        return response
    except Exception as e:
        end_time = time.time()
        logger.error({
            "event": "request_error",
            "method": request.method,
            "url": str(request.url),
            "error": str(e),
            "time_taken": end_time - start_time,
        })
        raise e


@app.get("/movies", response_model=list[Movie])
@limiter.limit("5/second")
async def get_movies(request: Request, db: Session = Depends(get_db)) -> list[Movie]:
    movies = db.query(DBMovie).all()
    movies = [Movie(**movie.__dict__) for movie in movies]
    return movies


@app.put("/movies/{movie_id}", response_model=Movie)
async def update_movie(movie_id: int, movie: MovieUpdate, db: Session = Depends(get_db)) -> Movie:
    db_movie = db.query(DBMovie).filter(DBMovie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    for key, value in movie.model_dump().items():
        setattr(db_movie, key, value)
    db.commit()
    db.refresh(db_movie)
    return Movie(**db_movie.__dict__)


@app.post("/movies", response_model=Movie)
async def create_movie(movie: MovieCreate, db: Session = Depends(get_db)) -> Movie:
    db_movie = DBMovie(**movie.model_dump())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return Movie(**db_movie.__dict__)


@app.delete("/movies/{movie_id}")
async def delete_movie(movie_id: int, db: Session = Depends(get_db)):
    db_movie = db.query(DBMovie).filter(DBMovie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    db.delete(db_movie)
    db.commit()
    return {"message": "Movie deleted successfully"}


@app.get("/movies/search", response_model=list[Movie])
async def search_movies(
        title: str | None = None,
        release_year_min: int | None = None,
        release_year_max: int | None = None,
        genre: str | None = None,
        language: str | None = None,
        duration_min: int | None = None,
        duration_max: int | None = None,
        db: Session = Depends(get_db)
) -> list[Movie]:
    # Workaround for getting the correct title
    title = f"%{title}%" if title is not None else None

    query_parameters = {
        'title': DBMovie.title.like,
        'release_year_min': DBMovie.release_year.__ge__,
        'release_year_max': DBMovie.release_year.__le__,
        'genre': DBMovie.genre.__eq__,
        'language': DBMovie.language.__eq__,
        'duration_min': DBMovie.movie_length.__ge__,
        'duration_max': DBMovie.movie_length.__le__,
    }
    filters = []
    for key, value in query_parameters.items():
        if locals()[key] is not None:
            filters.append(value(locals()[key]))

    movies = db.query(DBMovie).filter(and_(*filters)).all()

    if not movies:
        raise HTTPException(status_code=404, detail="No movies found with the given criteria")

    return [Movie(**movie.__dict__) for movie in movies]


@app.get("/movies/{movie_id}", response_model=Movie)
async def get_movie_by_id(movie_id: int, db: Session = Depends(get_db)) -> Movie:
    db_movie = db.query(DBMovie).filter(DBMovie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    movie = Movie(**db_movie.__dict__)
    return movie


@app.get("/genres", response_model=list[str])
async def get_genres(db: Session = Depends(get_db)) -> list[str]:
    genres = db.query(DBMovie.genre).distinct().all()
    genres = [genre[0] for genre in genres]
    return genres


@app.get("/languages", response_model=list[str])
async def get_languages(user: user_dependency, db: Session = Depends(get_db)):
    print(user)
    if user["is_superuser"]:
        languages = db.query(DBMovie.language).distinct().all()
        languages = [language[0] for language in languages]
        return languages
    else:
        raise HTTPException(status_code=403, detail="You are not allowed to view this resource")
