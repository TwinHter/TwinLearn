using System.Text.Json.Serialization;
using Application.DTOs;
using Core.Enums;

namespace Application.DTOs;

public class ProblemDto
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public int Difficulty { get; set; }
    public string? Description { get; set; }
    public string? Link { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]

    public ProblemSource Source { get; set; }
    public string? SolutionCode { get; set; }

    public ICollection<TopicDto> Topics { get; set; } = new List<TopicDto>();
}
public class CreateProblemDto
{
    public required string Title { get; set; }
    public int Difficulty { get; set; }
    public string? Description { get; set; }
    public string? Link { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]

    public ProblemSource Source { get; set; }
    public string? SolutionCode { get; set; }

    public ICollection<int> TopicIds { get; set; } = new List<int>();
}
public class UpdateProblemDto
{
    public string? Title { get; set; }
    public int Difficulty { get; set; }
    public string? Description { get; set; }
    public string? Link { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ProblemSource Source { get; set; }
    public string? SolutionCode { get; set; }

    public ICollection<int> TopicIds { get; set; } = new List<int>();
}

public class ProblemFilterDto
{
    public int? TopicId { get; set; }
    public int? MinDiff { get; set; }
    public int? MaxDiff { get; set; }
    public string? Title { get; set; }
    public string? Source { get; set; }
    public int? SortOrder { get; set; }
}
