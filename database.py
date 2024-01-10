from __future__ import annotations
from datetime import datetime
from typing import Annotated, List
from fastapi import Depends
from sqlalchemy import create_engine, ForeignKey, String, DateTime, Table, Column, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase, sessionmaker, Session, relationship

import json

DATABASE_URL = "sqlite:///./movies.db"


class Base(DeclarativeBase):
    pass


class DBComment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    movie_list_id: Mapped[int] = mapped_column(ForeignKey("movie_lists.id"), nullable=False)
    movie_list: Mapped[DBMovieList] = relationship(back_populates="comments")
    comment: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[str] = mapped_column(String, nullable=False)
    updated_at: Mapped[str] = mapped_column(String, nullable=False)

class DBUser(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, nullable=False)
    profile_image: Mapped[str] = mapped_column(String, nullable=True)
    movie_lists: Mapped[List[DBMovieList]] = relationship(back_populates="user")

class DBLike(Base):
    __tablename__ = "likes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    movie_list_id: Mapped[int] = mapped_column(ForeignKey("movie_lists.id"), nullable=False)
    movie_list: Mapped[DBMovieList] = relationship(back_populates="likes")


class DBMovieList(Base):
    __tablename__ = "movie_lists"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    user: Mapped[DBUser] = relationship(back_populates="movie_lists")
    movies: Mapped[List[DBMovie]] = relationship(secondary="movie_movie_list", back_populates="movie_lists")
    comments: Mapped[List[DBComment]] = relationship(back_populates="movie_list")
    likes: Mapped[List[DBLike]] = relationship(back_populates="movie_list")


class DBMovie(Base):
    __tablename__ = "movies"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    release_year: Mapped[int] = mapped_column(Integer, nullable=False)
    movie_length: Mapped[int] = mapped_column(Integer, nullable=False)
    genre: Mapped[str] = mapped_column(String, nullable=False)
    language: Mapped[str] = mapped_column(String, nullable=False)
    imdb_url: Mapped[str] = mapped_column(String, nullable=False)
    movie_lists: Mapped[List[DBMovieList]] = relationship(secondary="movie_movie_list", back_populates="movies")


# Create association table for many-to-many relationship between movies and movie lists
movie_movie_list = Table('movie_movie_list', Base.metadata,
                         Column('movie_id', Integer, ForeignKey('movies.id')),
                         Column('movie_list_id', Integer, ForeignKey('movie_lists.id'))
                         )




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
    # Load movies and users from json file
    with open("db.json", "r") as f:
        data = json.load(f)
        movies = data["movies"]
        users = data["users"]
        movies_lists = data["movies_lists"]
        comments = data["comments"]
        likes = data["likes"]
        movies_movie_lists = data["movies_movies_lists"]
    # Add movies to database
    for movie in movies:
        db_movie = DBMovie(**movie)
        db.add(db_movie)

    # Add users to database
    for user in users:
        db_user = DBUser(**user)
        db.add(db_user)

    # Add movie lists to database
    for movie_list in movies_lists:
        db_movie_list = DBMovieList(**movie_list)
        db.add(db_movie_list)

    # Add comments to database
    for comment in comments:
        db_comment = DBComment(**comment)
        db.add(db_comment)

    # Add likes to database
    for like in likes:
        db_like = DBLike(**like)
        db.add(db_like)

    try:
        db.commit()
    except Exception as e:
        print(e)
        db.rollback()
    db.close()


db_dependency = Annotated[Session, Depends(get_db)]
