from schemas import KbSyntaxCheckResponse, KbTaskSolverResponse
async def kb_check_syntax(code: str) -> str:
    return KbSyntaxCheckResponse(
        result="Syntax is correct.",
        status="Success",
        processing_time_ms=0.123
        
    )

async def kb_task_solver(problem: str) -> str:
    return KbTaskSolverResponse(
        type=1,
        status="Success",
        result="KB task solver result based on the provided problem.",
        processing_time_ms=0.456
    )