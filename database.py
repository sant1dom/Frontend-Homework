from typing import Annotated

from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase, sessionmaker, Session

import json

DATABASE_URL = "sqlite:///./hide.db"


class Base(DeclarativeBase):
    pass


class DBMovie(Base):
    __tablename__ = "hide"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(nullable=False)
    release_year: Mapped[int] = mapped_column(nullable=False)
    movie_length: Mapped[int] = mapped_column(nullable=False)
    genre: Mapped[str] = mapped_column(nullable=False)
    language: Mapped[str] = mapped_column(nullable=False)
    imdb_url: Mapped[str] = mapped_column(nullable=False)


class DBUser(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(nullable=False, unique=True)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(nullable=False)
    is_superuser: Mapped[bool] = mapped_column(nullable=False)
    profile_image: Mapped[str] = mapped_column(nullable=True)


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    database = SessionLocal()
    try:
        yield database
    finally:
        database.close()


def fill_db():
    db = SessionLocal()
    # Load hide and users from json file
    with open("db.json", "r") as f:
        data = json.load(f)
        movies = data["movies"]
        users = data["users"]
    # Add hide to database
    for movie in movies:
        db_movie = DBMovie(**movie)
        db.add(db_movie)
    db.commit()
    # Add users to database
    for user in users:
        db_user = DBUser(**user)
        db.add(db_user)
    try:
        db.commit()
    except:
        db.rollback()
    db.close()


db_dependency = Annotated[Session, Depends(get_db)]
