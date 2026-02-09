import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from db.db import create_db_and_tables, seed_data
from routes import router as ai_router

logging.basicConfig(
    level=logging.INFO, 
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Server is starting up...")
    try:
        create_db_and_tables()
        seed_data()
        logger.info("✅ Database initialized successfully.")
    except Exception as e:
        logger.error(f"❌ Database init failed: {e}")
    
    yield
    
    logger.info("🛑 Server is shutting down...")

app = FastAPI(
    title="CSTT Solver API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router, prefix="/api/v1", tags=["Solver"])

# Health Check
@app.get("/")
async def root():
    return {
        "status": "online", 
        "service": "CSTT Solver API",
        "env": settings.environment
    }