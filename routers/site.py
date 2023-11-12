from fastapi import APIRouter
from starlette.requests import Request
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

router = APIRouter()

templates = Jinja2Templates(directory="static")


@router.get("/", tags=["site"])
def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@router.get("/favourites", tags=["site"])
def read_root(request: Request):
    return templates.TemplateResponse("favourites.html", {"request": request})


@router.get("/watchlist", tags=["site"])
def read_root(request: Request):
    return templates.TemplateResponse("watchlist.html", {"request": request})


@router.get("/films/{id}", tags=["site"])
def get_movie_by_id(request: Request, id: int):
    return templates.TemplateResponse("movie-detail.html", {"request": request, "id": id})


@router.get("/admin", tags=["site"])
def read_root(request: Request):
    return templates.TemplateResponse("admin.html", {"request": request})


@router.get("/admin/create", tags=["site"])
def read_root(request: Request):
    return templates.TemplateResponse("admin-operation.html", {"request": request})


@router.get("/admin/update/{id}", tags=["site"])
def read_root(request: Request):
    return templates.TemplateResponse("admin-operation.html", {"request": request})


@router.get("/search", tags=["site"])
async def search(request: Request, title: str | None = None):
    return templates.TemplateResponse("search.html", {"request": request, "search": title})


@router.get("/create", tags=["site"])
async def create():
    return FileResponse(path="static/templates/index.html")


@router.get("/update", tags=["site"])
async def update():
    return FileResponse(path="static/templates/index.html")


@router.get("/read", tags=["site"])
async def read():
    return FileResponse(path="static/templates/index.html")


@router.get("/delete", tags=["site"])
async def delete():
    return FileResponse(path="static/templates/index.html")
