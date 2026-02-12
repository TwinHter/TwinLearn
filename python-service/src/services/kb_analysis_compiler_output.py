import re
import logging
from typing import List
from db.models import SyntaxKb
from cache import KbCache

logger = logging.getLogger(__name__)

def analyze_compiler_output(raw_output: str) -> list:
    """
    Hàm thuần túy: Input là chuỗi lỗi thô + rules -> Output là List Dict lỗi.
    kb_rules: Là list các object model SyntaxKb lấy từ DB.
    """
    results = []
    lines = raw_output.split('\n')
    kb_rules: List[SyntaxKb] = KbCache.get_syntax_rules()
    
    for line in lines:
        if not line.strip(): continue

        meta_match = re.search(r':(\d+):(\d+):\s*(error|warning|fatal error):', line, re.IGNORECASE)
        
        if meta_match:
            line_num = meta_match.group(1)
            err_type = meta_match.group(3).upper() 
            
            # Lấy nội dung lỗi gốc
            raw_detail = line.split(meta_match.group(0))[-1].strip()
            found_match = False
            
            for entry in kb_rules:
                try:
                    match = re.search(entry.pattern, line, re.IGNORECASE)
                    if match:
                        title = entry.msg
                        suggestion = entry.fix
                        level = entry.type

                        # Logic thay thế {1}, {2}...
                        if match.groups():
                            for i, group_text in enumerate(match.groups(), 1):
                                placeholder = "{" + str(i) + "}"
                                if group_text:
                                    title = title.replace(placeholder, group_text)
                                    suggestion = suggestion.replace(placeholder, group_text)
                        
                        # Nếu là lỗi chung (Generic)
                        if '.*' in entry.pattern:
                            suggestion = f"{suggestion} (Chi tiết: {raw_detail})"

                        results.append({
                            "line": int(line_num),
                            "level": level,
                            "message": title,
                            "fix": suggestion,
                            "raw": raw_detail
                        })
                        found_match = True
                        break 
                except Exception as e:
                    logger.error(f"Regex error for pattern {entry.pattern}: {e}")
                    continue
            
            if not found_match:
                results.append({
                    "line": int(line_num),
                    "level": err_type,
                    "message": f"{raw_detail}",
                    "fix": "Chưa có gợi ý trong KB.",
                    "raw": raw_detail
                })
            
    return results
