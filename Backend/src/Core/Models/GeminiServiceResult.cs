namespace Core.Models;

public class GeminiServiceResult
{
    public bool IsSuccess { get; set; }
    public string? ErrorMessage { get; set; }

    public string ResponseText { get; set; } = string.Empty;
    public string? ModelVersionUsed { get; set; }
    public double? ProcessingTimeMs { get; set; }
}