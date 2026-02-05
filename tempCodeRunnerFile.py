import subprocess
import json
import re
import os
import sys

KB_FILE = "syntax_kb.json"
INPUT_FILE = "input_code.txt"

def load_kb():
    if not os.path.exists(KB_FILE):
        return []
    with open(KB_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def run_compiler_analysis(code):
    filename = "temp_check.cpp"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(code)

    # LỆNH G++ NÂNG CAO:
    # -fsyntax-only: Chỉ check cú pháp (nhanh)
    # -Wall -Wextra: Bật tất cả cảnh báo (Logic, Memory, Uninitialized)
    # -fdiagnostics-show-option: Hiện mã lỗi
    cmd = ["g++", "-fsyntax-only", "-Wall", "-Wextra", filename]
    
    process = subprocess.run(cmd, capture_output=True, text=True)
    
    if os.path.exists(filename): os.remove(filename)
    return process.stderr

def analyze_output(raw_output, kb):
    results = []
    # Tách từng dòng lỗi
    lines = raw_output.split('\n')
    
    for line in lines:
        # Regex để bắt định dạng: file:line:col: type: message
        # Ví dụ: temp.cpp:5:10: error: expected ';'
        meta_match = re.search(r':(\d+):(\d+):\s*(error|warning|fatal error):', line)
        
        if meta_match:
            line_num = meta_match.group(1)
            err_type = meta_match.group(3).upper() # ERROR hoặc WARNING
            
            # Tìm trong KB xem có lời giải thích nào khớp không
            explanation = None
            suggestion = None
            title = None
            
            for entry in kb:
                match = re.search(entry['pattern'], line)
                if match:
                    title = entry['msg']
                    if match.groups():
                        try: title = title.format(*match.groups())
                        except: pass
                    
                    explanation = entry['type'] # Loại lỗi trong KB (VD: MEMORY WARNING)
                    suggestion = entry['fix']
                    break
            
            # Nếu không có trong KB, dùng thông báo gốc của g++
            if not title:
                # Lấy phần message sau dấu : cuối cùng
                msg_part = line.split(meta_match.group(0))[-1].strip()
                title = f"Lỗi chưa định nghĩa: {msg_part}"
                explanation = err_type
                suggestion = "Kiểm tra cú pháp theo thông báo gốc."

            results.append({
                "line": line_num,
                "level": explanation,
                "message": title,
                "fix": suggestion,
                "raw": line.strip()
            })
            
    return results

# --- MAIN ---

# 1. Đọc code
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    student_code = f.read()

print(f"--- Đang phân tích Code ({len(student_code)} chars) ---\n")

# 2. Gọi Compiler
kb_data = load_kb()
raw_log = run_compiler_analysis(student_code)

# 3. Hiển thị kết quả
if not raw_log:
    print("✅ Code hoàn hảo! Không tìm thấy lỗi.")
else:
    analysis = analyze_output(raw_log, kb_data)
    
    for item in analysis:
        print(f"[Dòng {item['line']} bị lỗi] {item['message']}")
        print(f"   Loại lỗi: {item['level']}")
        print(f"   Gợi ý: {item['fix']}")
        print(f"-" * 40)