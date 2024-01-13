from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
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

@router.delete("/all_lists/{movie_list_id}")
async def delete_all_lists(movie_list_id: int, user: user_dependency, db: Session = Depends(get_db)):
    if not user["is_superuser"]:
        raise HTTPException(status_code=403, detail="You are not allowed to delete this resource")

    db_movie_list = db.query(DBMovieList).filter(DBMovieList.id == movie_list_id).first()
    if db_movie_list is None:
        raise HTTPException(status_code=404, detail="Movie list not found")
    db.delete(db_movie_list)
    db.commit()
    return {"message": "Movie list deleted successfully"}