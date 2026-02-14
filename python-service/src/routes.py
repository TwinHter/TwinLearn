import time
from fastapi import APIRouter, HTTPException
import schemas
from services.kb_client import kb_check_syntax, kb_task_solver
from services.llm_client import llm_check_syntax, llm_task_solver
from cache import KbCache

router = APIRouter(prefix="/ai")

@router.post("/llm", response_model=schemas.LlmResponse)
async def process_llm(req: schemas.AiRequest):
    """
    Endpoint chuyên xử lý các task liên quan đến LLM (Gemini, GPT...)
    """
    
    try:
        # Validate Task Type dành riêng cho LLM
        if req.task_type == schemas.AiTaskType.SYNTAX_CHECK_LLM:
            return await llm_check_syntax(req.content, req.context)
        
        elif req.task_type == schemas.AiTaskType.SOLVE_EXERCISE_LLM:
            return await llm_task_solver(req.content, req.context)
            
        else:
            # Nếu user gửi task của KB vào endpoint LLM -> Báo lỗi
            raise HTTPException(status_code=400, detail=f"Task '{req.task_type}' not supported in /llm endpoint")

    except Exception as e:
        return schemas.LlmResponse(
            result="",
            processing_time_ms=0,
            error=str(e)
        )

@router.post("/kb", response_model=schemas.KbSyntaxCheckResponse | schemas.KbTaskSolverResponse)
async def process_kb(req: schemas.AiRequest):
    """
    Endpoint chuyên xử lý các task liên quan đến Knowledge Base (Prolog, Rule Engine...)
    Trả về Union vì KB có 2 schema output khác nhau.
    """
    try:
        if req.task_type == schemas.AiTaskType.SYNTAX_CHECK_KB:
            return await kb_check_syntax(req.content)
            
        elif req.task_type == schemas.AiTaskType.SOLVE_EXERCISE_KB:
            return await kb_task_solver(req.content)
            
        else:
            # Nếu user gửi task của LLM vào endpoint KB -> Báo lỗi
            raise HTTPException(status_code=400, detail=f"Task '{req.task_type}' not supported in /kb endpoint")
    except Exception as e:
        if req.task_type == schemas.AiTaskType.SOLVE_EXERCISE_KB:
            return schemas.KbTaskSolverResponse(
                result="", status="error", type=0, processing_time_ms=0, error=str(e)
            )
        
        return schemas.KbSyntaxCheckResponse(
            result="", status="error", processing_time_ms=0, error=str(e)
        )
        
        
@router.get("/kb/raw", response_model=schemas.KbRawDataResponse)
async def get_kb_raw():
    return schemas.KbRawDataResponse(
        states=KbCache.get_solver_states(),     # Trả về List[SolverState]
        steps=KbCache.get_solver_steps(),       # Trả về List[SolverStep]
        problems=KbCache.get_solver_problems()  # Trả về List[SolverProblem]
    )