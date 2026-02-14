using System;

namespace Core.Constants;

public class AiStatusType
{
    public const string SUCCESS = "Success"; // Mọi thứ OK
    public const string ERROR = "Error"; // Lỗi do input hoặc logic (VD: sai bước)
    public const string SYSTEM_FAILED = "SystemFailed"; // Lỗi crash server, timeout, exception không lường trước được
}
