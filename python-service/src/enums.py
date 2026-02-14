# src/enums.py
from enum import Enum

class TaskStatus(str, Enum):
    SUCCESS = "Success"             # Mọi thứ OK
    ERROR = "Error"                 # Lỗi do input hoặc logic (VD: sai bước)
    SYSTEM_FAILED = "SystemFailed" # Lỗi crash server
    
class AiTaskType(str, Enum):
    SYNTAX_CHECK_KB = "syntax_check_kb"
    SOLVE_EXERCISE_KB = "task_solver_kb"
    SYNTAX_CHECK_LLM = "syntax_check_llm"
    SOLVE_EXERCISE_LLM = "task_solver_llm"