import datetime
import logging
import time
from contextlib import asynccontextmanager
from logging.config import dictConfig

import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from sqlalchemy import and_, func, not_
from sqlalchemy.orm import Session, joinedload
from starlette.requests import Request
from starlette.staticfiles import StaticFiles

from LogConfig import LogConfig
from database import Base, engine, fill_db, get_db, DBMovie, DBMovieList, DBLike, DBComment, DBUser
from exceptions_handlers import rate_limit_exceeded_handler
from models import Movie, MovieUpdate, MovieCreate, MovieList, MovieListCreate, Comment, Like, MovieListUpdate, \
    CommentCreate
from routers import auth, lists, comments
from routers.auth import user_dependency

import argparse

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

app.include_router(auth.router)
app.include_router(lists.router)
app.include_router(comments.router)
app.mount("/static", StaticFiles(directory="static"), name="static")


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


@app.get("/movies", response_model=list[Movie], tags=["movies"])
@limiter.limit("5/second")
async def get_movies(request: Request, db: Session = Depends(get_db)) -> list[Movie]:
    movies = db.query(DBMovie).all()
    movies = [Movie(**movie.__dict__) for movie in movies]
    return movies


@app.put("/movies/{movie_id}", response_model=Movie, tags=["movies"])
async def update_movie(movie_id: int, movie: MovieUpdate, db: Session = Depends(get_db)) -> Movie:
    db_movie = db.query(DBMovie).filter(DBMovie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    for key, value in movie.model_dump().items():
        setattr(db_movie, key, value)
    db.commit()
    db.refresh(db_movie)
    return Movie(**db_movie.__dict__)


@app.post("/movies", response_model=Movie, tags=["movies"])
async def create_movie(user: user_dependency, movie: MovieCreate, db: Session = Depends(get_db)) -> Movie:
    if not user["is_superuser"]:
        raise HTTPException(status_code=403, detail="You are not allowed to view this resource")
    db_movie = DBMovie(**movie.model_dump())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return Movie(**db_movie.__dict__)


@app.delete("/movies/{movie_id}", tags=["movies"])
async def delete_movie(user: user_dependency, movie_id: int, db: Session = Depends(get_db)):
    if not user["is_superuser"]:
        raise HTTPException(status_code=403, detail="You are not allowed to view this resource")

    db_movie = db.query(DBMovie).filter(DBMovie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    db.delete(db_movie)
    db.commit()
    return {"message": "Movie deleted successfully"}


@app.get("/movies/search", response_model=list[Movie], tags=["movies"])
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


@app.get("/movies/{movie_id}", response_model=Movie, tags=["movies"])
async def get_movie_by_id(movie_id: int, db: Session = Depends(get_db)) -> Movie:
    db_movie = db.query(DBMovie).filter(DBMovie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    movie = Movie(**db_movie.__dict__)
    return movie


@app.get("/genres", response_model=list[str], tags=["genres"])
async def get_genres(db: Session = Depends(get_db)) -> list[str]:
    genres = db.query(DBMovie.genre).distinct().all()
    genres = [genre[0] for genre in genres]
    return genres


@app.get("/languages", response_model=list[str], tags=["languages"])
async def get_languages(db: Session = Depends(get_db)):
    languages = db.query(DBMovie.language).distinct().all()
    languages = [language[0] for language in languages]
    return languages


@app.get("/mylists", response_model=list[MovieList], tags=["lists"])
async def get_my_lists(user: user_dependency, db: Session = Depends(get_db)):
    db_movie_lists = db.query(DBMovieList).filter(DBMovieList.user_id == user["id"]).all()
    movie_lists = [MovieList(**movie_list.__dict__) for movie_list in db_movie_lists]
    for zip_list in zip(movie_lists, db_movie_lists):
        zip_list[0].movies = [Movie(**movie.__dict__) for movie in zip_list[1].movies]
        zip_list[0].comments = [Comment(**comment.__dict__) for comment in zip_list[1].comments]
        zip_list[0].likes = [Like(**like.__dict__) for like in zip_list[1].likes]
    return movie_lists


@app.post("/mylists", response_model=MovieList, tags=["lists"])
async def create_list(movie_list: MovieListCreate, user: user_dependency, db: Session = Depends(get_db)):
    db_movie_list = DBMovieList()
    db_movie_list.name = movie_list.name
    db_movie_list.user_id = user["id"]
    db_movie_list.movies = [db.query(DBMovie).filter(DBMovie.id == movie_id).first() for movie_id in movie_list.movies]
    db_movie_list.user = db.query(DBUser).filter(DBUser.id == user["id"]).first()
    db_movie_list.likes = []
    db_movie_list.comments = []
    db_movie_list.private = False
    db.add(db_movie_list)
    db.commit()
    db.refresh(db_movie_list)
    return_list = MovieList(id=db_movie_list.id, name=db_movie_list.name, user_id=db_movie_list.user_id)
    return_list.movies = [Movie(**movie.__dict__) for movie in db_movie_list.movies]
    return_list.comments = [Comment(**comment.__dict__) for comment in db_movie_list.comments]
    return_list.likes = [Like(**like.__dict__) for like in db_movie_list.likes]
    return return_list


@app.delete("/mylists/{movie_list_id}", tags=["lists"])
async def delete_list(movie_list_id: int, user: user_dependency, db: Session = Depends(get_db)):
    db_movie_list = db.query(DBMovieList).filter(
        and_(DBMovieList.id == movie_list_id, DBMovieList.user_id == user["id"])).first()
    if db_movie_list is None:
        raise HTTPException(status_code=404, detail="Movie list not found")
    if db_movie_list.name == "Watchlist" or db_movie_list.name == "Favourites":
        raise HTTPException(status_code=400, detail="You are not allowed to delete this list")
    db.delete(db_movie_list)
    db.commit()
    return {"message": "Movie list deleted successfully"}


@app.get("/mylists/{movie_list_id}", response_model=MovieList, tags=["lists"])
async def get_list_by_id(movie_list_id: int, user: user_dependency, db: Session = Depends(get_db)):
    db_movie_list = db.query(DBMovieList).filter(
        and_(DBMovieList.id == movie_list_id, DBMovieList.user_id == user["id"])).first()
    if db_movie_list is None:
        raise HTTPException(status_code=404, detail="Movie list not found")
    movie_list = MovieList(**db_movie_list.__dict__)
    movie_list.movies = [Movie(**movie.__dict__) for movie in db_movie_list.movies]
    movie_list.comments = [Comment(**comment.__dict__) for comment in db_movie_list.comments]
    movie_list.likes = [Like(**like.__dict__) for like in db_movie_list.likes]

    return movie_list


@app.put("/mylists/{movie_list_id}", response_model=MovieList, tags=["lists"])
async def update_list(movie_list_id: int, movie_list: MovieListUpdate, user: user_dependency,
                      db: Session = Depends(get_db)):
    db_movie_list = db.query(DBMovieList).filter(
        and_(DBMovieList.id == movie_list_id, DBMovieList.user_id == user["id"])).first()
    if db_movie_list is None:
        raise HTTPException(status_code=404, detail="Movie list not found")
    if db_movie_list.name == "Watchlist" or db_movie_list.name == "Favourites":
        raise HTTPException(status_code=400, detail="You are not allowed to change the name of this list")
    db_movie_list.name = movie_list.name

    db.commit()
    db.refresh(db_movie_list)
    return MovieList(**db_movie_list.__dict__)


@app.post("/mylists/{movie_list_id}", response_model=MovieList, tags=["lists"])
async def add_movie_to_list(movie_list_id: int, movie_id: int, user: user_dependency, db: Session = Depends(get_db)):
    db_movie_list = db.query(DBMovieList).filter(
        and_(DBMovieList.id == movie_list_id, DBMovieList.user_id == user["id"])).first()
    if db_movie_list is None:
        raise HTTPException(status_code=404, detail="Movie list not found")
    db_movie_list.movies.append(db.query(DBMovie).filter(DBMovie.id == movie_id).first())
    db.commit()
    db.refresh(db_movie_list)
    return MovieList(**db_movie_list.__dict__)


@app.delete("/mylists/{movie_list_id}/{movie_id}", tags=["lists"])
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


@app.get("/most_liked_lists", response_model=list[MovieList], tags=["lists"])
async def get_most_liked_lists(db: Session = Depends(get_db)):
    most_liked_lists = db.query(DBLike.movie_list_id, func.count(DBLike.movie_list_id)).group_by(
        DBLike.movie_list_id).order_by(func.count(DBLike.movie_list_id).desc()).all()
    most_liked_lists = [movie_list[0] for movie_list in most_liked_lists]
    most_liked_lists = db.query(DBMovieList).filter(DBMovieList.id.in_(most_liked_lists)).all()
    most_liked_movie_lists = [MovieList(**movie_list.__dict__) for movie_list in most_liked_lists]
    for lista in most_liked_movie_lists:
        lista.movies = [Movie(**movie.__dict__) for movie_list in most_liked_lists for movie in movie_list.movies]
        lista.comments = [Comment(**comment.__dict__) for comment_list in most_liked_lists for comment in
                          comment_list.comments]
        lista.likes = [Like(**like.__dict__) for like_list in most_liked_lists for like in like_list.likes]
    return most_liked_lists


@app.get("/bestlists/{movie_list_id}", response_model=MovieList, tags=["lists"])
async def get_list_by_id(movie_list_id: int, db: Session = Depends(get_db)):
    db_movie_list = db.query(DBMovieList).filter(DBMovieList.id == movie_list_id).filter(
        DBMovieList.private == False).first()
    if db_movie_list is None:
        raise HTTPException(status_code=404, detail="Movie list not found")
    movie_list = MovieList(**db_movie_list.__dict__)
    movie_list.movies = [Movie(**movie.__dict__) for movie in db_movie_list.movies]
    movie_list.comments = [Comment(**comment.__dict__) for comment in db_movie_list.comments]
    movie_list.likes = [Like(**like.__dict__) for like in db_movie_list.likes]

    return movie_list


@app.post("/like/{movie_list_id}", response_model=dict, tags=["likes"])
async def like_movie_list(movie_list_id: int, user: user_dependency, db: Session = Depends(get_db)):
    # Check if the user has already liked the movie list
    db_like = db.query(DBLike).filter(and_(DBLike.movie_list_id == movie_list_id, DBLike.user_id == user["id"])).first()
    if db_like is None:
        db_like = DBLike(movie_list_id=movie_list_id, user_id=user["id"])
        db.add(db_like)
        db.commit()
        db.refresh(db_like)
        return {"message": "Movie list liked successfully"}
    raise HTTPException(status_code=400, detail="You have already liked this movie list")


@app.delete("/like/{movie_list_id}", tags=["likes"])
async def unlike_movie_list(movie_list_id: int, user: user_dependency, db: Session = Depends(get_db)):
    db_like = db.query(DBLike).filter(and_(DBLike.movie_list_id == movie_list_id, DBLike.user_id == user["id"])).first()
    if db_like is None:
        raise HTTPException(status_code=404, detail="Like not found")
    db.delete(db_like)
    db.commit()
    return {"message": "Movie list unliked successfully"}


@app.post("/comment/{movie_list_id}", response_model=dict, tags=["comments"])
async def comment_movie_list(movie_list_id: int, comment: CommentCreate, user: user_dependency, db: Session = Depends(get_db)):
    db_comment = DBComment(movie_list_id=movie_list_id,
                           user_id=user["id"],
                           comment=comment.comment,
                           created_at=datetime.datetime.now().isoformat(),
                           updated_at=datetime.datetime.now().isoformat())
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return {"message": "Movie list commented successfully"}


@app.put("/comment/{comment_id}", response_model=dict, tags=["comments"])
async def update_comment(comment_id: int, updated_comment: dict, user: user_dependency, db: Session = Depends(get_db)):
    # Verifica se il commento esiste nel database
    db_comment = db.query(DBComment).filter(DBComment.id == comment_id).first()
    if db_comment is None:
        raise HTTPException(status_code=404, detail="Commento non trovato")

    # Verifica se l'utente autenticato è l'autore del commento
    if db_comment.user_id != user["id"]:
        raise HTTPException(status_code=403, detail="Non sei autorizzato a modificare questo commento")

    # Effettua l'aggiornamento del commento
    if "comment" in updated_comment:
        db_comment.comment = updated_comment["comment"]
    if "updated_at" in updated_comment:
        db_comment.updated_at = updated_comment["updated_at"]

    db.commit()
    db.refresh(db_comment)

    return {"message": "Commento aggiornato con successo"}


@app.get("/comments/{movie_list_id}", response_model=list[Comment], tags=["comments"])
async def get_comments(movie_list_id: int, db: Session = Depends(get_db)):
    comments = db.query(DBComment).filter(DBComment.movie_list_id == movie_list_id).all()
    return comments


@app.delete("/comment/{comment_id}", tags=["comments"])
async def delete_comment(comment_id: int, user: user_dependency, db: Session = Depends(get_db)):
    db_comment = db.query(DBComment).filter(and_(DBComment.id == comment_id, DBComment.user_id == user["id"])).first()
    if db_comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    db.delete(db_comment)
    db.commit()
    return {"message": "Comment deleted successfully"}


@app.get("/most_commented_lists", response_model=list[MovieList], tags=["lists"])
async def get_most_commented_lists(db: Session = Depends(get_db)):
    most_commented_lists = db.query(DBComment.movie_list_id, func.count(DBComment.movie_list_id)).group_by(
        DBComment.movie_list_id).order_by(func.count(DBComment.movie_list_id).desc()).all()
    most_commented_lists = [movie_list[0] for movie_list in most_commented_lists]
    most_commented_lists = db.query(DBMovieList).filter(DBMovieList.id.in_(most_commented_lists)).all()
    most_commented_lists = [MovieList(**movie_list.__dict__) for movie_list in most_commented_lists]
    return most_commented_lists


@app.get("/users/{user_id}", response_model=dict, tags=["users"])
async def get_user_details_by_id(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user_details = {
        "email": db_user.email,
        "image": db_user.profile_image
    }
    return user_details


@app.post("/get_lists_for_movie", response_model=list[MovieList], tags=["lists"])
async def get_lists_for_movie(movie_id: int, user: user_dependency, db: Session = Depends(get_db)):
    user_id = user["id"]

    movie_lists = (
        db.query(DBMovieList)
        .filter(DBMovieList.user_id == user_id)
        .filter(DBMovieList.movies.any(id=movie_id))
        .options(joinedload(DBMovieList.movies), joinedload(DBMovieList.comments), joinedload(DBMovieList.likes))
        .all()
    )

    return_list = [
        MovieList(
            id=movie_list.id,
            name=movie_list.name,
            user_id=movie_list.user_id,
            movies=[Movie(**movie.__dict__) for movie in movie_list.movies],
            comments=[Comment(**comment.__dict__) for comment in movie_list.comments],
            likes=[Like(**like.__dict__) for like in movie_list.likes],
        )
        for movie_list in movie_lists
    ]

    return return_list


@app.post("/get_not_lists_for_movie", response_model=list[MovieList], tags=["lists"])
async def get_not_lists_for_movie(movie_id: int, user: user_dependency, db: Session = Depends(get_db)):
    user_id = user["id"]

    movie_lists = (
        db.query(DBMovieList)
        .filter(DBMovieList.user_id == user_id)
        .filter(not_(DBMovieList.movies.any(id=movie_id)))
        .options(joinedload(DBMovieList.movies), joinedload(DBMovieList.comments), joinedload(DBMovieList.likes))
        .all()
    )

    return_list = [
        MovieList(
            id=movie_list.id,
            name=movie_list.name,
            user_id=movie_list.user_id,
            movies=[Movie(**movie.__dict__) for movie in movie_list.movies],
            comments=[Comment(**comment.__dict__) for comment in movie_list.comments],
            likes=[Like(**like.__dict__) for like in movie_list.likes],
        )
        for movie_list in movie_lists
    ]

    return return_list


@app.get("/lists/search", response_model=list[MovieList], tags=["lists"])
async def search_lists(
        name: str | None = None,
        db: Session = Depends(get_db)
) -> list[MovieList]:
    if name is None:
        raise HTTPException(status_code=400, detail="Name parameter is required")
    if name is not None:
        name = name.lower()
    name = f"%{name}%" if name is not None else None

    query_parameters = {
        'name': DBMovieList.name.like,
    }
    filters = []
    for key, value in query_parameters.items():
        if locals()[key] is not None:
            filters.append(value(locals()[key]))
    movie_lists = db.query(DBMovieList)\
                    .options(joinedload(DBMovieList.movies), joinedload(DBMovieList.comments), joinedload(DBMovieList.likes))\
                    .filter(and_(*filters))\
                    .filter(DBMovieList.private == False)\
                    .all()

    if not movie_lists:
        raise HTTPException(status_code=404, detail="No movie lists found with the given criteria")

    return_list = [
        MovieList(
            id=movie_list.id,
            name=movie_list.name,
            user_id=movie_list.user_id,
            movies=[Movie(**movie.__dict__) for movie in movie_list.movies],
            comments=[Comment(**comment.__dict__) for comment in movie_list.comments],
            likes=[Like(**like.__dict__) for like in movie_list.likes],
        )
        for movie_list in movie_lists
    ]

    return return_list


@app.get("/")
async def root():
    return {"message": "Hello From Movies API"}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--reload", action="store_true", help="Reload the server on code changes")
    parser.add_argument("--host", type=str, default="localhost", help="Host to run the server on")
    parser.add_argument("--port", type=int, default=8000, help="Port to run the server on")
    parser.add_argument("--workers", type=int, default=1, help="Number of workers to run")
    parser.add_argument("--log-level", type=str, default="info", help="Log level")
    arguments = parser.parse_args()

    uvicorn.run(
        "movies_api:app",
        host=arguments.host,
        port=arguments.port,
        reload=arguments.reload,
        workers=arguments.workers,
        log_level=arguments.log_level,
    )
