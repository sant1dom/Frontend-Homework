from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from database import Base, engine, fill_db, get_db, DBMovie, DBComment, DBLike, DBComment
from models import Comment
from routers.auth import user_dependency

router = APIRouter()

@router.get("/all_lists", response_model=list[Comment])
async def get_all_lists(user: user_dependency, db: Session = Depends(get_db)) -> list[Comment]:
    if not user["is_superuser"]:
        raise HTTPException(status_code=403, detail="You are not allowed to view this resource")

    lists =  db.query(DBComment).all()
    lists = [Comment(**list.__dict__) for list in lists]
    return lists

@router.delete("/all_lists/{comment_id}")
async def delete_all_lists(comment_id: int, user: user_dependency, db: Session = Depends(get_db)):
    if not user["is_superuser"]:
        raise HTTPException(status_code=403, detail="You are not allowed to delete this resource")

    db_comment = db.query(DBComment).filter(DBComment.id == comment_id).first()
    if db_comment is None:
        raise HTTPException(status_code=404, detail="Movie list not found")
    db.delete(db_comment)
    db.commit()
    return {"message": "Movie list deleted successfully"}