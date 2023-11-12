from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager

import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, and_, func
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, sessionmaker, Session
from starlette.staticfiles import StaticFiles
import re
from routers import site


class Movie(BaseModel):
    id: int
    title: str
    release_year: int
    movie_length: int
    genre: str
    language: str
    imdb_url: str
    imdb_image: str = None


class MovieCreate(BaseModel):
    title: str
    release_year: int
    movie_length: int
    genre: str
    language: str
    imdb_url: str


class MovieUpdate(BaseModel):
    title: str
    release_year: int
    movie_length: int
    genre: str
    language: str
    imdb_url: str


DATABASE_URL = "sqlite:///./movies.db"


class Base(DeclarativeBase):
    pass


class DBMovie(Base):
    __tablename__ = "movies"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(nullable=False)
    release_year: Mapped[int] = mapped_column(nullable=False)
    movie_length: Mapped[int] = mapped_column(nullable=False)
    genre: Mapped[str] = mapped_column(nullable=False)
    language: Mapped[str] = mapped_column(nullable=False)
    imdb_url: Mapped[str] = mapped_column(nullable=False)
    imdb_image: Mapped[str] = mapped_column(nullable=True)


engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    database = SessionLocal()
    try:
        yield database
    finally:
        database.close()


def fill_movies():
    db = SessionLocal()
    with open("movies.json", "r", encoding="utf-8") as f:
        movies = f.read()
    movies = eval(movies)
    for movie in movies:
        db_movie = DBMovie(**movie)
        db.add(db_movie)
    db.commit()
    db.close()


def get_imdb_image(movie):
    headers = {
        "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
    }
    url_pattern = re.compile(r'https://www\.imdb\.com/title/tt\d+/')
    if url_pattern.match(movie.imdb_url):
        src = BeautifulSoup(requests.get(movie.imdb_url, headers=headers).content, "html.parser") \
            .find("img", class_="ipc-image") \
            .get("src")
        movie.imdb_image = src
    else:
        raise HTTPException(status_code=400, detail="Invalid IMDB URL")


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    # Fill the database with some movies
    fill_movies()
    yield
    Base.metadata.drop_all(bind=engine)


app = FastAPI(lifespan=lifespan)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(site.router)


@app.get("/movies", response_model=list[Movie])
async def get_movies(db: Session = Depends(get_db)) -> list[Movie]:
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
    get_imdb_image(db_movie)
    db.commit()
    db.refresh(db_movie)
    return Movie(**db_movie.__dict__)


@app.post("/movies", response_model=Movie)
async def create_movie(movie: MovieCreate, db: Session = Depends(get_db)) -> Movie:
    db_movie = DBMovie(**movie.model_dump())
    get_imdb_image(db_movie)
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
async def get_languages(db: Session = Depends(get_db)) -> list[str]:
    languages = db.query(DBMovie.language).distinct().all()
    languages = [language[0] for language in languages]
    return languages
