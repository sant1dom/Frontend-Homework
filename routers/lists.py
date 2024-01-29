from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from database import get_db, DBMovieList
from models import MovieList, Movie, Like, Comment
from routers.auth import user_dependency

router = APIRouter()


@router.get("/all_lists", response_model=list[MovieList])
async def get_all_lists(user: user_dependency, db: Session = Depends(get_db)) -> list[MovieList]:
    if not user["is_superuser"]:
        raise HTTPException(status_code=403, detail="You are not allowed to view this resource")

    db_movie_lists = db.query(DBMovieList).all()

    for db_movie_list in db_movie_lists:
        movie_list = MovieList(**db_movie_list.__dict__)
        movie_list.movies = [Movie(**movie.__dict__) for movie in db_movie_list.movies]
        movie_list.comments = [Comment(**comment.__dict__) for comment in db_movie_list.comments]
        movie_list.likes = [Like(**like.__dict__) for like in db_movie_list.likes]

    return db_movie_lists


@router.delete("/all_lists/{movie_list_id}")
async def delete_all_lists(movie_list_id: int, user: user_dependency, db: Session = Depends(get_db)):
    if not user["is_superuser"]:
        raise HTTPException(status_code=403, detail="You are not allowed to delete this resource")

    db_movie_list = db.query(DBMovieList).filter(DBMovieList.id == movie_list_id).first()

    if db_movie_list is None:
        raise HTTPException(status_code=404, detail="Movie list not found")
    if db_movie_list.name == "Watchlist" or db_movie_list.name == "Favorites":
        raise HTTPException(status_code=403, detail="You are not allowed to delete this list")

    db.delete(db_movie_list)
    db.commit()

    return {"message": "Movie list deleted successfully"}


@router.get("/all_lists/{movie_list_id}")
async def get_list_by_id(movie_list_id: int, user: user_dependency, db: Session = Depends(get_db)):
    if not user["is_superuser"]:
        raise HTTPException(status_code=403, detail="You are not allowed to view this resource")

    db_movie_list = db.query(DBMovieList).first()

    if db_movie_list is None:
        raise HTTPException(status_code=404, detail="Movie list not found")

    movie_list = MovieList(**db_movie_list.__dict__)
    movie_list.movies = [Movie(**movie.__dict__) for movie in db_movie_list.movies]
    movie_list.comments = [Comment(**comment.__dict__) for comment in db_movie_list.comments]
    movie_list.likes = [Like(**like.__dict__) for like in db_movie_list.likes]

    return movie_list
