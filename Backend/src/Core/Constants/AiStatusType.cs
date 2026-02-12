using System;

namespace Core.Constants;

public class AiStatusType
{
    public const string SUCCESS = "success"; // Mọi thứ OK
    public const string ERROR = "error"; // Lỗi do input hoặc logic (VD: sai bước)
    public const string SYSTEM_FAILED = "system_failed"; // Lỗi crash server, timeout, exception không lường trước được
}
