from pydantic import BaseModel
from enum import Enum
from typing import Optional

class AiTaskType(str, Enum):
    SYNTAX_CHECK_KB = "syntax_check_kb"
    SOLVE_EXERCISE_KB = "task_solver_kb"
    SYNTAX_CHECK_LLM = "syntax_check_llm"
    SOLVE_EXERCISE_LLM = "task_solver_llm"


class AiRequest(BaseModel):
    task_type: AiTaskType
    content: str
    context: Optional[str] = None

class LlmResponse(BaseModel):
    result: str
    processing_time_ms: float
    error: Optional[str] = None
    ai_model: Optional[str] = None
    
class KbTaskSolverResponse(BaseModel):
    type: int
    status: str
    result: str
    processing_time_ms: float
    error: Optional[str] = None
    
class KbSyntaxCheckResponse(BaseModel):
    result: str
    status: str
    processing_time_ms: float
    error: Optional[str] = None