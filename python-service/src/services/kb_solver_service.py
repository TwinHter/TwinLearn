import json
from typing import Dict, List, Set, Any
from schemas import SolverRequest, KbTaskSolverResponse
from cache import KbCache
from enums import TaskStatus


def backward_chain(goal: str, achieved: Set[str], plan: List[Dict], available_steps: List[Any])-> bool:
    if goal in achieved:
        return True

    for step in available_steps:
        step_effects = step.effects if isinstance(step.effects, list) else []
        if goal in step_effects:
            ok = True
            for pre in step.preconditions:
                if pre not in achieved:
                    if not backward_chain(pre, achieved, plan, available_steps):
                        ok = False
                        break
            if ok:
                if step not in plan:
                    plan.append(step)
                    achieved.update(step_effects)
                return True
    return False

def solve(request: SolverRequest) -> KbTaskSolverResponse:
    # Lấy dữ liệu từ Cache RAM (Nhanh, không gọi DB)
    try:
        available_steps = KbCache.get_solver_steps()
        step_map = {s.id: s for s in available_steps}
    except RuntimeError:
        return KbTaskSolverResponse(type=request.type, status=TaskStatus.ERROR, error="Knowledge Base not initialized", processing_time_ms=0.0)


    if request.type == 1:
        achieved = set(request.initial_state)
        plan = []
        
        # Goal có thể là string hoặc list string
        target_goals = [request.goal] if isinstance(request.goal, str) else request.goal
        
        success = True
        for g in target_goals:
            if not backward_chain(g, achieved, plan, available_steps):
                success = False
                break
        
        if not success:
            return KbTaskSolverResponse(
                type=-1, 
                status=TaskStatus.ERROR,
                error="Cannot find solution path", 
                processing_time_ms=0.0
            )
        
        # Map object Step sang model StepDetail để trả về
        result_steps = [
            {"id": step.id, "description": step.description} for step in plan
        ]
        steps_json_string = json.dumps(result_steps, ensure_ascii=False)
        # print(f"Generated Plan: {result_steps}")
        return KbTaskSolverResponse(type=1, status=TaskStatus.SUCCESS, steps=steps_json_string, processing_time_ms=0.0)
    
    elif request.type == 2:
        current_state = set(request.initial_state)
        user_steps_ids = request.steps or []
        target_goals = [request.goal] if isinstance(request.goal, str) else request.goal

        # Duyệt qua từng bước user gửi lên
        for idx, step_id in enumerate(user_steps_ids):
            if step_id not in step_map:
                return KbTaskSolverResponse(
                    type=-1, status=TaskStatus.ERROR,
                    error=f"Step '{step_id}' not found in KB", 
                    processing_time_ms=0.0
                )

            step = step_map[step_id]
            preconditions = step.preconditions if isinstance(step.preconditions, list) else []
            effects = step.effects if isinstance(step.effects, list) else []

            missing = [p for p in preconditions if p not in current_state]
            if missing:
                return KbTaskSolverResponse(
                    type=2, status=TaskStatus.ERROR,
                    error=f"At step '{step.description}': Missing preconditions {missing}",
                    processing_time_ms=0.0
                )
            current_state.update(effects)

        missing_goals = [g for g in target_goals if g not in current_state]
        if missing_goals:
            return KbTaskSolverResponse(
                type=2, status=TaskStatus.ERROR, 
                error=f"Final state does not meet goals: {missing_goals}",
                processing_time_ms=0.0
            )

        return KbTaskSolverResponse(type=2, status=TaskStatus.SUCCESS, error="", steps="", processing_time_ms=0.0)

    else:
        return KbTaskSolverResponse(type=-1, status=TaskStatus.SYSTEM_FAILED, error="Invalid request type", processing_time_ms=0.0)