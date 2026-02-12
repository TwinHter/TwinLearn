import time
from schemas import LlmResponse
from config import settings

from openai import AsyncOpenAI

client = AsyncOpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=settings.llm_api_key
)

async def call_llm(system_prompt: str, user_prompt: str, context: str | None = None) -> str:
    messages = []
    full_system_content = system_prompt
    if context:
        full_system_content += f"\n\nContext:\n{context}"
        
    messages.append({"role": "system", "content": full_system_content})
    messages.append({"role": "user", "content": user_prompt})
    response = await client.chat.completions.create(
        model=settings.llm_model,
        messages=messages
    )
    
    return response.choices[0].message.content or ""

async def llm_check_syntax(prompt: str, context: str | None) -> LlmResponse:
    # Logic gọi API thực tế sẽ ở đây (thường là async)
    try: 
        start_time = time.perf_counter()
        
        system_prompt = settings.syntax_check_prompt
        result = await call_llm(system_prompt, prompt, context)
        processing_time = (time.perf_counter() - start_time) * 1000
        
        if result.strip() == "":
            return LlmResponse(
                error="No response from LLM",
                processing_time_ms=processing_time,
                ai_model=settings.llm_model
            )

        return LlmResponse(
            result=result,
            processing_time_ms=processing_time,
            ai_model=settings.llm_model
        )
    except Exception as e:
        return LlmResponse(
            error=f"Error: {str(e)}",
            processing_time_ms=processing_time,
            ai_model=settings.llm_model
        )

async def llm_task_solver(prompt: str, context: str | None) -> LlmResponse:
    try:
        start_time = time.perf_counter()
        system_prompt = settings.task_solver_prompt
        result = await call_llm(system_prompt, prompt, context)
        processing_time = (time.perf_counter() - start_time) * 1000
        
        if result.strip() == "":
            return LlmResponse(
                error="No response from LLM",
                processing_time_ms=processing_time,
                ai_model=settings.llm_model 
            )

        return LlmResponse(
            result=result,
            processing_time_ms=processing_time,
            ai_model=settings.llm_model
        )
    except Exception as e:
        return LlmResponse(
            error=f"Error: {str(e)}",
            processing_time_ms=processing_time,
            ai_model=settings.llm_model
        )