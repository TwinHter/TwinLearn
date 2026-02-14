from pydantic import BaseModel
from enum import Enum
from typing import List, Optional
from enums import TaskStatus, AiTaskType
from db.models import SolverProblem, SolverState, SolverStep

class AiRequest(BaseModel):
    task_type: AiTaskType
    content: str
    context: Optional[str] = None
    
class SolverRequest(BaseModel):
    type: int
    initial_state: List[str]
    goal: str | List[str]
    steps: Optional[List[str]] = None # for task 2

class LlmResponse(BaseModel):
    result: Optional[str] = None
    processing_time_ms: float
    error: Optional[str] = None
    ai_model: Optional[str] = None
    
class KbTaskSolverResponse(BaseModel):
    type: int
    status: TaskStatus
    steps: Optional[str] = None
    error: Optional[str] = None
    processing_time_ms: float
    
class KbSyntaxCheckResponse(BaseModel):
    result: str
    status: TaskStatus
    error: Optional[str] = None
    processing_time_ms: float
    
class KbRawDataResponse(BaseModel):
    states: List[SolverState]    
    steps: List[SolverStep]      
    problems: List[SolverProblem]