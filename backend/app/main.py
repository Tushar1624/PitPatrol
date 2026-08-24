from fastapi import FastAPI

from app.api.detection import router as detection_router
from app.api.routes import history, health


app = FastAPI(
    title="JESIANS — SMARTROAD AI",
    version="0.1.0",
)

app.include_router(health.router)
app.include_router(detection_router)
app.include_router(history.router)


@app.get("/health")
async def health():
    return {
        "status": "ok"
    }