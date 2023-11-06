from fastapi import APIRouter
from starlette.requests import Request
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

router = APIRouter()


templates = Jinja2Templates(directory="static/aroma-master")

@router.get("/", tags=["site"])
def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@router.get("/favourites", tags=["site"])
def read_root(request: Request):
    return templates.TemplateResponse("favourites.html", {"request": request})


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


@router.get("/search", tags=["site"])
async def search():
    return FileResponse(path="static/templates/index.html")