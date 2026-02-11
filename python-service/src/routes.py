import time
from fastapi import APIRouter, HTTPException
from schemas import AiRequest, AiTaskType, KbSyntaxCheckResponse, KbTaskSolverResponse, LlmResponse
from services.kb_client import kb_check_syntax, kb_task_solver
from services.llm_client import llm_check_syntax, llm_task_solver

router = APIRouter(prefix="/ai")

@router.post("/llm", response_model=LlmResponse)
async def process_llm(req: AiRequest):
    """
    Endpoint chuyên xử lý các task liên quan đến LLM (Gemini, GPT...)
    """
    start_time = time.perf_counter()
    
    try:
        # Validate Task Type dành riêng cho LLM
        if req.task_type == AiTaskType.SYNTAX_CHECK_LLM:
            return await llm_check_syntax(req.content, req.context)
        
        elif req.task_type == AiTaskType.SOLVE_EXERCISE_LLM:
            return await llm_task_solver(req.content, req.context)
            
        else:
            # Nếu user gửi task của KB vào endpoint LLM -> Báo lỗi
            raise HTTPException(status_code=400, detail=f"Task '{req.task_type}' not supported in /llm endpoint")

    except Exception as e:
        return LlmResponse(
            result="",
            processing_time_ms=(time.perf_counter() - start_time) * 1000,
            error=str(e)
        )

@router.post("/kb", response_model=KbSyntaxCheckResponse | KbTaskSolverResponse)
async def process_kb(req: AiRequest):
    """
    Endpoint chuyên xử lý các task liên quan đến Knowledge Base (Prolog, Rule Engine...)
    Trả về Union vì KB có 2 schema output khác nhau.
    """
    start_time = time.perf_counter()

    try:
        # Validate Task Type dành riêng cho KB
        if req.task_type == AiTaskType.SYNTAX_CHECK_KB:
            return await kb_check_syntax(req.content)
            
        elif req.task_type == AiTaskType.SOLVE_EXERCISE_KB:
            return await kb_task_solver(req.content)
            
        else:
            # Nếu user gửi task của LLM vào endpoint KB -> Báo lỗi
            raise HTTPException(status_code=400, detail=f"Task '{req.task_type}' not supported in /kb endpoint")

    except HTTPException as he:
        raise he
    except Exception as e:
        # Xử lý lỗi chung, trả về schema tương ứng với task type (nếu xác định được)
        # Nếu lỗi quá sớm không biết task nào, trả về default SyntaxResponse lỗi
        duration = (time.perf_counter() - start_time) * 1000
        
        if req.task_type == AiTaskType.SOLVE_EXERCISE_KB:
            return KbTaskSolverResponse(
                result="", status="error", type=0, processing_time_ms=duration, error=str(e)
            )
        
        return KbSyntaxCheckResponse(
            result="", status="error", processing_time_ms=duration, error=str(e)
        )