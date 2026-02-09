from time import time
from fastapi import APIRouter, HTTPException
from schemas import AiRequest, AiResponse, AiTaskType
from services.kb_client import kb_check_syntax, kb_task_solver
from services.llm_client import llm_check_syntax, llm_task_solver

router = APIRouter(prefix="/ai")

@router.post("/process", response_model=AiResponse)
def process_ai(req: AiRequest):
    start_time = time.perf_counter()

    try:
        if req.task_type == AiTaskType.SYNTAX_CHECK:
            kb_result = kb_check_syntax(req.content)
            llm_result = llm_check_syntax(req.content, req.context)
            result = f"{kb_result}\n{llm_result}"

        elif req.task_type == AiTaskType.SOLVE_EXERCISE:
            kb_result = kb_task_solver(req.content)
            llm_result = llm_task_solver(req.content, req.context)
            result = f"{kb_result}\n{llm_result}"

        elif req.task_type == AiTaskType.CHAT:
            result = llm_task_solver(req.content, req.context)

        else:
            raise HTTPException(status_code=400, detail="Invalid task type")

        return AiResponse(
            result=result,
            processing_time_ms=(time.perf_counter() - start_time) * 1000,
            ai_model="gemini-1.5"  # Example model name
        )

    except ValueError as e:
        return AiResponse(
            error=str(e),
            processing_time_ms=(time.perf_counter() - start_time) * 1000
        )

    except Exception:
        return AiResponse(
            error="AI service temporarily unavailable",
            processing_time_ms=(time.perf_counter() - start_time) * 1000
        )
