from pydantic import BaseModel
from enum import Enum
from typing import List, Optional
from enums import TaskStatus, AiTaskType

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

class StepDetail(BaseModel):
    id: str
    description: str
    
class KbTaskSolverResponse(BaseModel):
    type: int
    status: TaskStatus
    steps: Optional[str] = []
    error: Optional[str] = None
    processing_time_ms: float
    
class KbSyntaxCheckResponse(BaseModel):
    result: str
    status: TaskStatus
    error: Optional[str] = None
    processing_time_ms: float