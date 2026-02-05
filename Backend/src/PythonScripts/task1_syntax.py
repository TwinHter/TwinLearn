import subprocess
import json
import re
import os

KB_FILE = "syntax_kb.json"
INPUT_FILE = "input_code.txt"
OUTPUT_FILE = "result.json"

def load_kb():
    if not os.path.exists(KB_FILE):
        return []
    with open(KB_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def run_compiler_analysis(code):
    filename = "temp_check.cpp"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(code)

    # Dùng LC_ALL=C để ép compiler báo lỗi tiếng Anh
    my_env = os.environ.copy()
    my_env["LC_ALL"] = "C"

    # Chạy g++
    cmd = ["g++", "-fsyntax-only", "-Wall", "-Wextra", filename]
    process = subprocess.run(cmd, capture_output=True, text=True, env=my_env)
    
    if os.path.exists(filename): os.remove(filename)
    return process.stderr

def analyze_output(raw_output, kb):
    results = []
    lines = raw_output.split('\n')
    
    for line in lines:
        # Regex bắt dòng lỗi chuẩn: file:line:col: type: message
        meta_match = re.search(r':(\d+):(\d+):\s*(error|warning|fatal error):', line, re.IGNORECASE)
        
        if meta_match:
            line_num = meta_match.group(1)
            err_type = meta_match.group(3).upper() 
            
            # Cắt bỏ phần header để lấy nội dung lỗi gốc
            raw_detail = line.split(meta_match.group(0))[-1].strip()

            found_match = False
            
            for entry in kb:
                match = re.search(entry['pattern'], line, re.IGNORECASE)
                if match:
                    title = entry['msg']
                    suggestion = entry['fix']
                    level = entry['type']

                    # Logic thay thế {1}, {2}...
                    if match.groups():
                        for i, group_text in enumerate(match.groups(), 1):
                            placeholder = "{" + str(i) + "}"
                            if group_text:
                                title = title.replace(placeholder, group_text)
                                suggestion = suggestion.replace(placeholder, group_text)
                    
                    # Xử lý trường hợp "Lỗi chung" (GENERIC)
                    if entry.get('id') == 'SYN_GENERIC' or '.*' in entry['pattern']:
                        suggestion = f"Chi tiết từ Compiler: {raw_detail}"

                    results.append({
                        "line": int(line_num), # Chuyển sang số nguyên cho chuẩn JSON
                        "level": level,
                        "message": title,
                        "fix": suggestion,
                        "raw": line.strip()
                    })
                    found_match = True
                    break 
            
            # Nếu không tìm thấy trong KB -> In thẳng lỗi gốc ra
            if not found_match:
                results.append({
                    "line": int(line_num),
                    "level": err_type,
                    "message": f"Lỗi chưa định nghĩa: {raw_detail}",
                    "fix": "Chưa có gợi ý trong KB. Hãy kiểm tra cú pháp dòng này.",
                    "raw": line.strip()
                })
            
    return results

# --- MAIN ---

final_output = {
    "status": "unknown",
    "errors": []
}

if not os.path.exists(INPUT_FILE):
    print(f"❌ Không tìm thấy file {INPUT_FILE}")
    final_output["status"] = "failed"
else:
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        student_code = f.read()

    print(f"--- Đang phân tích Code ({len(student_code)} chars) ---")
    
    kb_data = load_kb()
    raw_log = run_compiler_analysis(student_code)

    if not raw_log:
        print("✅ Code hoàn hảo! Không tìm thấy lỗi.")
        final_output["status"] = "Clean"
        final_output["message"] = "Code hoàn hảo!"
    else:
        analysis = analyze_output(raw_log, kb_data)
        
        if not analysis:
             print("Có lỗi biên dịch nhưng Regex không bắt được định dạng.")
             final_output["status"] = "Error"
             final_output["raw_log"] = raw_log
        else:
            print(f"-> Đã phát hiện {len(analysis)} vấn đề. Đang lưu vào {OUTPUT_FILE}...")
            final_output["status"] = "Error"
            final_output["errors"] = analysis

# --- LƯU RA FILE JSON ---
try:
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(final_output, f, ensure_ascii=False, indent=4)
    print(f"✅ Đã lưu kết quả thành công vào '{OUTPUT_FILE}'")
except Exception as e:
    print(f"❌ Lỗi khi lưu file JSON: {e}")