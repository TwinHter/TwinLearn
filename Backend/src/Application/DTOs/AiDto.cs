using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Application.DTOs;

public class GeminiRequestDto
{
    [Required]
    public required string Prompt { get; set; }
}

public class GeminiResponseDto
{
    public string? Response { get; set; }
    public string? Status { get; set; }
    public string? ErrorMessage { get; set; }
    public string? ModelVersionUsed { get; set; }
    public DateTime Timestamp { get; set; }
}

public class KbFixBugRequestDto
{
    [Required]
    public required string SourceCode { get; set; }
}
public class KbFixBugResponseDto
{
    public string Status { get; set; } = string.Empty;
    public string AnalysisResult { get; set; } = string.Empty; // JSON string
    public DateTime CreatedAt { get; set; }
}

public class KbSolverRequestDto
{
    [JsonPropertyName("type")]
    public int Type { get; set; }

    [JsonPropertyName("initial_state")]
    public List<string> InitialState { get; set; } = new List<string>();

    [JsonPropertyName("goal")]
    public string Goal { get; set; } = string.Empty;

    [JsonPropertyName("steps")]
    public List<string>? Steps { get; set; }
}

public class KbSolverResponseDto
{
    public string Status { get; set; } = string.Empty;
    public string AnalysisResult { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}