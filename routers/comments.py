from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from database import get_db, DBComment
from models import Comment
from routers.auth import user_dependency

router = APIRouter(
    prefix="/comments",
    tags=["comments"],
    responses={404: {"description": "Not found"}},
)

@router.get("/all_comments", response_model=list[Comment])
async def get_all_comments(user: user_dependency, db: Session = Depends(get_db)) -> list[Comment]:
    if not user["is_superuser"]:
        raise HTTPException(status_code=403, detail="You are not allowed to view this resource")

    comments =  db.query(DBComment).all()
    comments = [Comment(**comment.__dict__) for comment in comments]
    return comments

@router.delete("/all_comments/{comment_id}")
async def delete_all_comments(comment_id: int, user: user_dependency, db: Session = Depends(get_db)):
    if not user["is_superuser"]:
        raise HTTPException(status_code=403, detail="You are not allowed to delete this resource")

    db_comment = db.query(DBComment).filter(DBComment.id == comment_id).first()
    if db_comment is None:
        raise HTTPException(status_code=404, detail="Movie list not found")
    db.delete(db_comment)
    db.commit()
    return {"message": "Movie list deleted successfully"}