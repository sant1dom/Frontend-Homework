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
from database import Base, engine, fill_db, get_db, DBMovie, DBMovieList, DBLike, DBComment
from exceptions_handlers import rate_limit_exceeded_handler
from models import Movie, MovieUpdate, MovieCreate, MovieList
from routers import site, auth, lists
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
    # Fill the database with some hide
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

#app.include_router(site.router)
app.include_router(auth.router)
app.include_router(lists.router)

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
        raise HTTPException(status_code=404, detail="No hide found with the given criteria")

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


@app.get("/mylists")
async def get_my_lists(user: user_dependency, db: Session = Depends(get_db)):
    movie_lists = db.query(DBMovieList).filter(DBMovieList.user_id == user["id"]).all()
    return movie_lists


@app.post("/mylists")
async def create_list(movie_list: MovieList, user: user_dependency, db: Session = Depends(get_db)):
    db_movie_list = DBMovieList(**movie_list.model_dump(), user_id=user["id"])
    db.add(db_movie_list)
    db.commit()
    db.refresh(db_movie_list)
    return MovieList(**db_movie_list.__dict__)


@app.delete("/mylists/{movie_list_id}")
async def delete_list(movie_list_id: int, user: user_dependency, db: Session = Depends(get_db)):
    db_movie_list = db.query(DBMovieList).filter(
        and_(DBMovieList.id == movie_list_id, DBMovieList.user_id == user["id"])).first()
    if db_movie_list is None:
        raise HTTPException(status_code=404, detail="Movie list not found")
    db.delete(db_movie_list)
    db.commit()
    return {"message": "Movie list deleted successfully"}


@app.get("/mylists/{movie_list_id}")
async def get_list_by_id(movie_list_id: int, user: user_dependency, db: Session = Depends(get_db)):
    db_movie_list = db.query(DBMovieList).filter(
        and_(DBMovieList.id == movie_list_id, DBMovieList.user_id == user["id"])).first()
    if db_movie_list is None:
        raise HTTPException(status_code=404, detail="Movie list not found")
    movie_list = MovieList(**db_movie_list.__dict__)
    return movie_list


@app.put("/mylists/{movie_list_id}")
async def update_list(movie_list_id: int, movie_list: MovieList, user: user_dependency, db: Session = Depends(get_db)):
    db_movie_list = db.query(DBMovieList).filter(
        and_(DBMovieList.id == movie_list_id, DBMovieList.user_id == user["id"])).first()
    if db_movie_list is None:
        raise HTTPException(status_code=404, detail="Movie list not found")
    for key, value in movie_list.model_dump().items():
        setattr(db_movie_list, key, value)
    db.commit()
    db.refresh(db_movie_list)
    return MovieList(**db_movie_list.__dict__)


@app.post("/mylists/{movie_list_id}")
async def add_movie_to_list(movie_list_id: int, movie_id: int, user: user_dependency, db: Session = Depends(get_db)):
    db_movie_list = db.query(DBMovieList).filter(
        and_(DBMovieList.id == movie_list_id, DBMovieList.user_id == user["id"])).first()
    if db_movie_list is None:
        raise HTTPException(status_code=404, detail="Movie list not found")
    db_movie_list.movies.append(db.query(DBMovie).filter(DBMovie.id == movie_id).first())
    db.commit()
    db.refresh(db_movie_list)
    return MovieList(**db_movie_list.__dict__)


@app.delete("/mylists/{movie_list_id}/{movie_id}")
async def delete_movie_from_list(movie_list_id: int, movie_id: int, user: user_dependency,
                                 db: Session = Depends(get_db)):
    db_movie_list = db.query(DBMovieList).filter(
        and_(DBMovieList.id == movie_list_id, DBMovieList.user_id == user["id"])).first()
    if db_movie_list is None:
        raise HTTPException(status_code=404, detail="Movie list not found")
    db_movie_list.movies.remove(db.query(DBMovie).filter(DBMovie.id == movie_id).first())
    db.commit()
    db.refresh(db_movie_list)
    return MovieList(**db_movie_list.__dict__)


@app.get("/most_liked_lists")
async def get_most_liked_lists(db: Session = Depends(get_db)):
    most_liked_lists = db.query(DBLike.movie_list_id, func.count(DBLike.movie_list_id)).group_by( DBLike.movie_list_id).order_by(func.count(DBLike.movie_list_id).desc()).all()
    most_liked_lists = [movie_list[0] for movie_list in most_liked_lists]
    most_liked_lists = db.query(DBMovieList).filter(DBMovieList.id.in_(most_liked_lists)).all()
    most_liked_lists = [MovieList(**movie_list.__dict__) for movie_list in most_liked_lists]
    return most_liked_lists

@app.post("/like/{movie_list_id}")
async def like_movie_list(movie_list_id: int, user: user_dependency, db: Session = Depends(get_db)):
    db_like = DBLike(movie_list_id=movie_list_id, user_id=user["id"])
    db.add(db_like)
    db.commit()
    db.refresh(db_like)
    return {"message": "Movie list liked successfully"}

@app.delete("/like/{movie_list_id}")
async def unlike_movie_list(movie_list_id: int, user: user_dependency, db: Session = Depends(get_db)):
    db_like = db.query(DBLike).filter(and_(DBLike.movie_list_id == movie_list_id, DBLike.user_id == user["id"])).first()
    if db_like is None:
        raise HTTPException(status_code=404, detail="Movie list not found")
    db.delete(db_like)
    db.commit()
    return {"message": "Movie list unliked successfully"}

@app.post("/comment/{movie_list_id}")
async def comment_movie_list(movie_list_id: int, comment: str, user: user_dependency, db: Session = Depends(get_db)):
    db_comment = DBComment(movie_list_id=movie_list_id, user_id=user["id"], comment=comment)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return {"message": "Movie list commented successfully"}

@app.get("/comments/{movie_list_id}")
async def get_comments(movie_list_id: int, db: Session = Depends(get_db)):
    comments = db.query(DBComment).filter(DBComment.movie_list_id == movie_list_id).all()
    return comments

@app.delete("/comment/{comment_id}")
async def delete_comment(comment_id: int, user: user_dependency, db: Session = Depends(get_db)):
    db_comment = db.query(DBComment).filter(and_(DBComment.id == comment_id, DBComment.user_id == user["id"])).first()
    if db_comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    db.delete(db_comment)
    db.commit()
    return {"message": "Comment deleted successfully"}

@app.get("/most_commented_lists")
async def get_most_commented_lists(db: Session = Depends(get_db)):
    most_commented_lists = db.query(DBComment.movie_list_id, func.count(DBComment.movie_list_id)).group_by( DBComment.movie_list_id).order_by(func.count(DBComment.movie_list_id).desc()).all()
    most_commented_lists = [movie_list[0] for movie_list in most_commented_lists]
    most_commented_lists = db.query(DBMovieList).filter(DBMovieList.id.in_(most_commented_lists)).all()
    most_commented_lists = [MovieList(**movie_list.__dict__) for movie_list in most_commented_lists]
    return most_commented_lists

