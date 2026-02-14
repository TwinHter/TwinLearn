import logging
from typing import List
from sqlmodel import select
from sqlalchemy.orm import Session 
from db.models import SyntaxKb, SolverState, SolverStep, SolverProblem 

logger = logging.getLogger(__name__)

class KbCache:
    _syntax_rules: List[SyntaxKb] = []
    _solver_states: List[SolverState] = []
    _solver_steps: List[SolverStep] = []
    _solver_problems: List[SolverProblem] = []
    _initialized: bool = False

    @classmethod
    def initialize(cls, db: Session):
        try:
            logger.info("Initializing KB Cache...")

            import re

            # 1. SyntaxKb
            result = db.execute(select(SyntaxKb))
            cls._syntax_rules = result.scalars().all()

            for rule in cls._syntax_rules:
                try:
                    rule.compiled_pattern = re.compile(rule.pattern, re.IGNORECASE)
                except Exception as e:
                    logger.error(f"Invalid regex pattern in rule {rule.id}: {e}")
                    rule.compiled_pattern = None

            # 2. SolverState
            result = db.execute(select(SolverState))
            cls._solver_states = result.scalars().all()

            # 3. SolverStep
            result = db.execute(select(SolverStep))
            cls._solver_steps = result.scalars().all()

            # 4. SolverProblem
            result = db.execute(select(SolverProblem))
            cls._solver_problems = result.scalars().all()

            cls._initialized = True
            logger.info("KB Cache initialized successfully")

        except Exception as e:
            logger.exception(f"Failed to initialize KB Cache: {e}")
            raise e

    @classmethod
    def get_syntax_rules(cls) -> List[SyntaxKb]:
        if not cls._initialized:
            raise RuntimeError("KbCache not initialized")
        return tuple(cls._syntax_rules)

    @classmethod
    def get_solver_states(cls) -> List[SolverState]:
        if not cls._initialized:
            raise RuntimeError("KbCache not initialized")
        return tuple(cls._solver_states)

    @classmethod
    def get_solver_steps(cls) -> List[SolverStep]:
        if not cls._initialized:
            raise RuntimeError("KbCache not initialized")
        return tuple(cls._solver_steps)

    @classmethod
    def get_solver_problems(cls) -> List[SolverProblem]:
        if not cls._initialized:
            raise RuntimeError("KbCache not initialized")
        return tuple(cls._solver_problems)