using Core.Enums;

namespace Application.DTOs;

public class ChecklistDto
{
    public int Id { get; set; }
    public ChecklistStatus Status { get; set; }
    public DateTime LastUpdated { get; set; }

    public int ProblemId { get; set; }

    public ProblemDto? Problem { get; set; } = null!;

    public string? Description { get; set; }

    // public int UserId { get; set; }
}
public class CreateChecklistDto
{
    public int UserId { get; set; }
    public DateTime LastUpdated { get; set; }

    public int? ProblemId { get; set; }
    public string? Description { get; set; } // Raw text if not provided problem id, empty otherwise
}
public class UpdateChecklistDto
{
    public ChecklistStatus Status { get; set; }
    public DateTime LastUpdated { get; set; }
    public string? Description { get; set; }
}