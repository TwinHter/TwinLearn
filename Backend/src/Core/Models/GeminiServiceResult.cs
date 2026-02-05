namespace Core.Models;

public class GeminiServiceResult
{
    public bool IsSuccess { get; set; }
    public string? ErrorMessage { get; set; }

    // Dữ liệu bạn muốn
    public string ResponseText { get; set; } = string.Empty;
    public string? ModelVersionUsed { get; set; }
}