from slowapi.errors import RateLimitExceeded
from starlette.requests import Request
from starlette.responses import Response, JSONResponse


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> Response:
    response = JSONResponse(
        {"error": f"Error try later"}, status_code=429
    )
    response = request.app.state.limiter._inject_headers(
        response, request.state.view_rate_limit
    )
    return response