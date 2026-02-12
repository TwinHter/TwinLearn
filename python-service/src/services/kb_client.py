import asyncio
import json
import logging
import os
import time

from schemas import KbSyntaxCheckResponse, KbTaskSolverResponse, SolverRequest
from services.kb_analysis_compiler_output import analyze_compiler_output
from services.kb_solver_service import solve
from enums import TaskStatus

logger = logging.getLogger(__name__)

async def kb_check_syntax(code: str) -> KbSyntaxCheckResponse:
    start_time = time.perf_counter()
    try:
        # 2. Chạy g++ qua PIPE
        process = await asyncio.create_subprocess_exec(
            "g++", "-fsyntax-only", "-Wall", "-Wextra", "-x", "c++", "-",
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env={**os.environ, "LC_ALL": "C"}
        )
        stdout, stderr = await process.communicate(input=code.encode())
        
        raw_output = stderr.decode().strip()
        result_data = analyze_compiler_output(raw_output)
        status = TaskStatus.ERROR if result_data else TaskStatus.SUCCESS

        processing_time = (time.perf_counter() - start_time) * 1000
        
        return KbSyntaxCheckResponse(
            result=json.dumps(result_data, ensure_ascii=False),
            status=status,
            processing_time_ms=processing_time,
            error=None
        )

    except Exception as e:
        return KbSyntaxCheckResponse(
            result="",
            status=TaskStatus.SYSTEM_FAILED,
            processing_time_ms=(time.perf_counter() - start_time) * 1000,
            error=str(e)
        )

async def kb_task_solver(problem: str) -> KbTaskSolverResponse:
    """
    Hàm wrapper nhận input string (JSON), gọi logic giải, và trả về đúng format yêu cầu.
    """
    start = time.perf_counter()
    try:
        # Parse Input String -> SolverRequest Object
        problem_dict = json.loads(problem)
        request = SolverRequest(**problem_dict)
        
        result: KbTaskSolverResponse = solve(request)

        return KbTaskSolverResponse(
            type=result.type,
            status=result.status,
            error=result.error,
            steps=result.steps,
            processing_time_ms=(time.perf_counter() - start) * 1000
        )
        
    except Exception as e:
        return KbTaskSolverResponse(
            type=-1, status=TaskStatus.SYSTEM_FAILED, steps="[]", error=str(e), processing_time_ms=(time.perf_counter() - start) * 1000
        )