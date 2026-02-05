import json
import os
import sys

# =========================================================
# CẤU HÌNH ĐƯỜNG DẪN (QUAN TRỌNG CHO BACKEND C#)
# =========================================================
# Lấy thư mục chứa file script hiện tại
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

INPUT_FILE = os.path.join(CURRENT_DIR, 'task2_input.json')
OUTPUT_FILE = os.path.join(CURRENT_DIR, 'solver_result.json')
KNOWLEDGE_FILE = os.path.join(CURRENT_DIR, 'solver_kb.json')

# =========================================================
# HÀM HỖ TRỢ GHI KẾT QUẢ
# =========================================================
def write_result(data):
    """Ghi dữ liệu JSON vào file output"""
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
    except Exception as e:
        print(f"CRITICAL ERROR: Cannot write to file. {e}")

# =========================================================
# LOAD KNOWLEDGE (Được bọc trong hàm để an toàn hơn)
# =========================================================
KB = {}
STATES = []
STEPS = []
PROBLEM_RULES = []
STEP_MAP = {}

def load_knowledge():
    global KB, STATES, STEPS, PROBLEM_RULES, STEP_MAP
    if not os.path.exists(KNOWLEDGE_FILE):
        raise FileNotFoundError(f"Không tìm thấy file tri thức tại: {KNOWLEDGE_FILE}")
    
    with open(KNOWLEDGE_FILE, encoding="utf-8") as f:
        KB = json.load(f)

    STATES = KB.get("initial_state", [])
    STEPS = KB.get("steps", [])
    # PROBLEM_RULES = KB.get("problem_rules", [])
    
    # Tạo map để tra cứu nhanh
    STEP_MAP = {s["id"]: s for s in STEPS}

# =========================================================
# BACKWARD CHAINING ENGINE
# =========================================================

def backward_chain(goal, achieved, plan):
    if goal in achieved:
        return True

    for step in STEPS:
        if goal in step["effects"]:
            ok = True
            # Kiểm tra preconditions
            for pre in step["preconditions"]:
                if pre not in achieved:
                    # Đệ quy tìm cách đạt được precondition
                    if not backward_chain(pre, achieved, plan):
                        ok = False
                        break
            if ok:
                # Nếu step chưa có trong plan thì thêm vào
                # Lưu ý: Logic này đơn giản, có thể cần cải tiến để tránh lặp vô hạn nếu data phức tạp
                if step not in plan:
                    plan.append(step)
                    achieved.update(step["effects"])
                return True
    return False

# =========================================================
# REQUEST HANDLER
# =========================================================

def handle_request(request):
    req_type = request.get("type")

    # --- TYPE 1: Tự động tìm steps (Solver) ---
    if req_type == 1:
        achieved = set(request.get("initial_state", []))
        goal = request.get("goal")
        
        # Goal có thể là string hoặc list, chuẩn hóa về list để xử lý (nếu cần)
        # Ở đây code cũ của bạn xử lý goal là string đơn
        
        plan = []

        if not backward_chain(goal, achieved, plan):
            return {
                "type": 1, 
                "status": "fail", 
                "detail": "Không tìm được giải pháp",
                "steps": []
            }

        return {
            "type": 1,
            "status": "success",
            "steps": [{"id": s["id"], "description": s["description"]} for s in plan]
        }

    # --- TYPE 2: Kiểm tra steps của User (Validator) ---
    elif req_type == 2:
        current = set(request.get("initial_state", []))
        target_goal = request.get("goal")
        user_steps = request.get("steps", [])

        for idx, step_id in enumerate(user_steps):
            if step_id not in STEP_MAP:
                return {
                    "type": 2, 
                    "status": "wrong", 
                    "detail": f"Step '{step_id}' không tồn tại trong hệ thống",
                    "error_step_index": idx
                }

            step = STEP_MAP[step_id]
            
            # Kiểm tra điều kiện tiên quyết
            missing = [p for p in step["preconditions"] if p not in current]

            if missing:
                return {
                    "type": 2, 
                    "status": "missing step", 
                    "detail": f"Tại bước '{step['description']}': Thiếu điều kiện {missing}",
                    "error_step_index": idx
                }

            # Cập nhật trạng thái hiện tại
            current.update(step["effects"])

        # Kiểm tra goal cuối cùng
        # Hỗ trợ goal là string hoặc list
        if isinstance(target_goal, list):
            missing_goals = [g for g in target_goal if g not in current]
            if missing_goals:
                 return {"type": 2, "status": "missing step", "detail": f"Chưa đạt goal: {missing_goals}"}
        else:
            if target_goal not in current:
                return {"type": 2, "status": "missing step", "detail": f"Chưa đạt goal: {target_goal}"}

        return {"type": 2, "status": "true", "detail": "Quy trình hợp lệ"}
    
    else:
        return {"status": "error", "detail": "Unknown request type"}

# =========================================================
# MAIN EXECUTION
# =========================================================

if __name__ == "__main__":
    try:
        # 1. Load Knowledge Base
        load_knowledge()

        # 2. Kiểm tra file Input
        if not os.path.exists(INPUT_FILE):
            write_result({"status": "error", "detail": "Input file not found"})
            sys.exit(0)

        # 3. Đọc Input
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            if not content:
                write_result({"status": "error", "detail": "Input file is empty"})
                sys.exit(0)
            request_data = json.loads(content)

        # 4. Xử lý
        result = handle_request(request_data)

        # 5. Ghi Output
        write_result(result)

    except Exception as e:
        # Bắt mọi lỗi crash (ví dụ: json lỗi, key error, logic error)
        error_response = {
            "status": "error",
            "detail": str(e)
        }
        write_result(error_response)