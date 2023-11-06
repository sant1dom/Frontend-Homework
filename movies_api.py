import concurrent
from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, sessionmaker, Session
from starlette.requests import Request
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles

import requests
from bs4 import BeautifulSoup
from starlette.templating import Jinja2Templates


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


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    database = SessionLocal()
    try:
        yield database
    finally:
        database.close()


def fill_movies():
    db = SessionLocal()
    db_movie = DBMovie(
        title="Le Ali della Libertà",
        release_year=1994,
        movie_length=142,
        genre="Drama",
        language="Italiano",
        imdb_url="https://www.imdb.com/title/tt0111161/",
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    db_movie = DBMovie(
        title="Il Padrino",
        release_year=1972,
        movie_length=175,
        genre="Crime",
        language="Italiano",
        imdb_url="https://www.imdb.com/title/tt0068646/",
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    db_movie = DBMovie(
        title="Il Cavaliere Oscuro",
        release_year=2008,
        movie_length=152,
        genre="Action",
        language="Italiano",
        imdb_url="https://www.imdb.com/title/tt0468569/",
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    db_movie = DBMovie(
        title="Il Padrino - Parte II",
        release_year=1974,
        movie_length=202,
        genre="Crime",
        language="Italiano",
        imdb_url="https://www.imdb.com/title/tt0071562/",
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    db_movie = DBMovie(
        title="Il Signore degli Anelli - Il Ritorno del Re",
        release_year=2003,
        movie_length=201,
        genre="Adventure",
        language="Italiano",
        imdb_url="https://www.imdb.com/title/tt0167260/",
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    db_movie = DBMovie(
        title="Pulp Fiction",
        release_year=1994,
        movie_length=154,
        genre="Crime",
        language="Italiano",
        imdb_url="https://www.imdb.com/title/tt0110912/",
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    db_movie = DBMovie(
        title="Schindler's List",
        release_year=1993,
        movie_length=195,
        genre="Biography",
        language="Italiano",
        imdb_url="https://www.imdb.com/title/tt0108052/",
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    db_movie = DBMovie(
        title="Il Signore degli Anelli - La Compagnia dell'Anello",
        release_year=2001,
        movie_length=178,
        genre="Adventure",
        language="Italiano",
        imdb_url="https://www.imdb.com/title/tt0120737/",
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    db_movie = DBMovie(
        title="Fight Club",
        release_year=1999,
        movie_length=139,
        genre="Drama",
        language="Italiano",
        imdb_url="https://www.imdb.com/title/tt0137523/",
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    db_movie = DBMovie(
        title="Il Signore degli Anelli - Le Due Torri",
        release_year=2002,
        movie_length=179,
        genre="Adventure",
        language="Italiano",
        imdb_url="https://www.imdb.com/title/tt0167261/",
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    db_movie = DBMovie(
        title="Forrest Gump",
        release_year=1994,
        movie_length=142,
        genre="Drama",
        language="Italiano",
        imdb_url="https://www.imdb.com/title/tt0109830/",
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    db_movie = DBMovie(
        title="Il Gladiatore",
        release_year=2000,
        movie_length=155,
        genre="Action",
        language="Italiano",
        imdb_url="https://www.imdb.com/title/tt0172495/",
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    db_movie = DBMovie(
        title="Inception",
        release_year=2010,
        movie_length=148,
        genre="Action",
        language="Italiano",
        imdb_url="https://www.imdb.com/title/tt1375666/",
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    db_movie = DBMovie(
        title="Lo Hobbit - Un Viaggio Inaspettato",
        release_year=2012,
        movie_length=169,
        genre="Adventure",
        language="Italiano",
        imdb_url="https://www.imdb.com/title/tt0903624/",
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    db_movie = DBMovie(
        title="Il Buono, il Brutto, il Cattivo",
        release_year=1966,
        movie_length=178,
        genre="Western",
        language="Italiano",
        imdb_url="https://www.imdb.com/title/tt0060196/",
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    # Fill the database with some movies
    fill_movies()
    yield
    Base.metadata.drop_all(bind=engine)


def get_imdb_image(movie: Movie):
    headers = {
        "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
    }
    src = BeautifulSoup(requests.get(movie.imdb_url, headers=headers).content, "html.parser").find("img",
                                                                                                   class_="ipc-image").get(
        "src")
    movie.imdb_image = src


app = FastAPI(lifespan=lifespan)

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="static/aroma-master")

@app.get("/")
def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/favourites")
def read_root(request: Request):
    return templates.TemplateResponse("favourites.html", {"request": request})


@app.get("/movies", response_model=list[Movie])
async def get_movies(db: Session = Depends(get_db)) -> list[Movie]:
    movies = db.query(DBMovie).all()
    movies = [Movie(**movie.__dict__) for movie in movies]
    with ThreadPoolExecutor(max_workers=len(movies)) as executor:
        executor.map(get_imdb_image, movies)
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
async def search_movies(title: str | None = None, release_year: int | None = None, db: Session = Depends(get_db), withimages: bool | None = None) -> \
        list[Movie]:
    movies = db.query(DBMovie)
    if title is not None:
        movies = movies.filter(DBMovie.title.like(f"%{title}%"))
    if release_year is not None:
        movies = movies.filter(DBMovie.release_year == release_year)
    movies = movies.all()
    movies = [Movie(**movie.__dict__) for movie in movies]
    # Get the image from IMDB for each movie in parallel
    if withimages:
        with ThreadPoolExecutor(max_workers=len(movies)) as executor:
            executor.map(get_imdb_image, movies)
    return movies


@app.get("/movies/{movie_id}", response_model=Movie)
async def get_movie(movie_id: int, db: Session = Depends(get_db)) -> Movie:
    db_movie = db.query(DBMovie).filter(DBMovie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    movie = Movie(**db_movie.__dict__)
    get_imdb_image(movie)
    return movie


@app.get("/create")
async def create():
    return FileResponse(path="static/templates/index.html")


@app.get("/update")
async def update():
    return FileResponse(path="static/templates/index.html")


@app.get("/read")
async def read():
    return FileResponse(path="static/templates/index.html")


@app.get("/delete")
async def delete():
    return FileResponse(path="static/templates/index.html")


@app.get("/search")
async def search():
    return FileResponse(path="static/templates/index.html")
