using Core.Enums;

namespace Application.DTOs;

public class SearchHistoryDto
{
    public int Id { get; set; }
    public required string UserInput { get; set; }
    public required string EngineResponse { get; set; }
    public EngineType EngineUsed { get; set; }
    public DateTime SearchDate { get; set; }


    // public int? ProblemId { get; set; }
    // public string? ProblemTitle { get; set; }
}
public class CreateSearchHistoryDto
{
    public required string UserInput { get; set; }
    public required string EngineResponse { get; set; }
    public EngineType EngineUsed { get; set; }
    public DateTime SearchDate { get; set; }
}

