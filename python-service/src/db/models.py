from typing import Any, List, Optional
from pydantic import PrivateAttr
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import ARRAY

class SyntaxKb(SQLModel, table=True):
    __tablename__ = "syntax_kb"

    id: str = Field(primary_key=True)
    pattern: str
    type: Optional[str] = None
    msg: Optional[str] = None
    fix: str
    
    _compiled_pattern: Any = PrivateAttr(default=None)
    @property
    def compiled_pattern(self):
        return self._compiled_pattern

    @compiled_pattern.setter
    def compiled_pattern(self, value):
        self._compiled_pattern = value

class SolverState(SQLModel, table=True):
    __tablename__ = "solver_state"

    id: str = Field(primary_key=True)
    type: str
    label: str
    description: Optional[str] = None


class SolverStep(SQLModel, table=True):
    __tablename__ = "solver_step"

    id: str = Field(primary_key=True)
    description: str
    preconditions: List[str] = Field(
        default_factory=list,
        sa_column=Column(ARRAY(String))
    )
    effects: List[str] = Field(
        default_factory=list,
        sa_column=Column(ARRAY(String))
    )


class SolverProblem(SQLModel, table=True):
    __tablename__ = "solver_problem"

    id: str = Field(primary_key=True)
    title: str
    initial_states: List[str] = Field(
        default_factory=list,
        sa_column=Column(ARRAY(String))
    )
    goal: str
