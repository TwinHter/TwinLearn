# db.py
import json
import logging
from pathlib import Path
from sqlmodel import SQLModel, Session, create_engine, select

from config import settings
from db.models import SolverState, SolverStep, SolverProblem, SyntaxKb

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent 
DATA_DIR = BASE_DIR / "db" / "data"

DATABASE_URL = settings.database_url
engine = create_engine(DATABASE_URL, echo=False)

def load_json(filename: str):
    """Hàm hỗ trợ đọc file JSON an toàn"""
    file_path = DATA_DIR / filename
    if not file_path.exists():
        logger.warning(f"⚠️ File {filename} không tồn tại tại {file_path}")
        return []
    
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def seed_data():
    with Session(engine) as session:
        # --- SEED SYNTAX KB ---
        if not session.exec(select(SyntaxKb)).first():
            logger.info("⚡ Bảng SyntaxKb rỗng. Đang nạp dữ liệu...")
            data = load_json("syntax_kb.json")
            if data:
                for item in data:
                    session.add(SyntaxKb(**item))
                session.commit()
                logger.info(f"✅ Đã thêm {len(data)} mục vào SyntaxKb.")
        
        # --- SEED SOLVER KB ---
        solver_kb = load_json("solver_kb.json")

        # --- SEED SOLVER STATE ---
        if not session.exec(select(SolverState)).first():
            logger.info("Bảng SolverState rỗng. Đang nạp dữ liệu...")
            states = solver_kb.get("states", [])
            if states:
                for item in states:
                    session.add(SolverState(**item))
                session.commit()
                logger.info(f"✅ Đã thêm {len(states)} states.")

        # --- SEED SOLVER STEP ---
        if not session.exec(select(SolverStep)).first():
            logger.info("Bảng SolverStep rỗng. Đang nạp dữ liệu...")
            steps = solver_kb.get("steps", [])
            if steps:
                for item in steps:
                    session.add(SolverStep(**item))
                session.commit()
                logger.info(f"✅ Đã thêm {len(steps)} steps.")

        # --- SEED SOLVER PROBLEM ---
        if not session.exec(select(SolverProblem)).first():
            logger.info("Bảng SolverProblem rỗng. Đang nạp dữ liệu...")
            problems = solver_kb.get("problems", [])
            if problems:
                for item in problems:
                    session.add(SolverProblem(**item))
                session.commit()
                logger.info(f"✅ Đã thêm {len(problems)} problems.")

def create_db_and_tables():
    """Tạo bảng dựa trên Models"""
    try:
        SQLModel.metadata.create_all(engine)
        logger.info("✅ Database tables ok!")
    except Exception as e:
        logger.error(f"❌ Lỗi khi tạo bảng: {e}")

def get_session():
    """Dependency Injection cho FastAPI"""
    with Session(engine) as session:
        yield session