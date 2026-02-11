from schemas import LlmResponse

async def llm_check_syntax(prompt: str, context: str | None) -> LlmResponse:
    # Logic gọi API thực tế sẽ ở đây (thường là async)
    return LlmResponse(
        result="hehehe syntax check",
        processing_time_ms=0.123,
        ai_model="still a mystery"
    )

async def llm_task_solver(prompt: str, context: str | None) -> LlmResponse:
    return LlmResponse(
        result="hehehe task solver",
        processing_time_ms=0.789,
        ai_model="still a mystery"
    )