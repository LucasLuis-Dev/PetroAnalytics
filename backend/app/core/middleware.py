import logging
from time import perf_counter
from fastapi import Request
from fastapi.responses import Response

logger = logging.getLogger("petroanalytics.request")

async def request_logger_middleware(request: Request, call_next):
    start = perf_counter()
    response: Response = await call_next(request)
    duration_ms = (perf_counter() - start) * 1000

    logger.info(
        f"{request.method} {request.url.path} "
        f"status={response.status_code} "
        f"duration_ms={duration_ms:.2f} "
        f"client={request.client.host}"
    )
    return response
