from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class Movie(BaseModel):
    id: int
    title: str
    release_year: int
    movie_length: int
    genre: str
    language: str
    imdb_url: str


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


class User(BaseModel):
    id: int
    hashed_password: str
    email: str
    is_active: bool
    is_superuser: bool = False
    profile_image: str = None


class UserReturn(BaseModel):
    id: int
    email: str
    is_active: bool
    is_superuser: bool = False
    profile_image: str = None


class UserCreate(BaseModel):
    email: str
    password: str


class UserUpdate(BaseModel):
    email: str
    password: str = None
    is_active: bool = None
    is_superuser: bool = None
    profile_image: str = None


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class Comment(BaseModel):
    id: int
    user_id: int
    movie_list_id: int
    comment: str
    created_at: datetime
    updated_at: datetime


class Like(BaseModel):
    id: int
    user_id: int
    movie_list_id: int


class MovieList(BaseModel):
    id: int
    user_id: int
    name: str
    movies: List[Movie] = []
    comments: List[Comment] = []
    likes: List[Like] = []
    private: bool = False


class MovieListCreate(BaseModel):
    name: str
    movies: Optional[List[int]] = []

class MovieListUpdate(BaseModel):
    name: str
