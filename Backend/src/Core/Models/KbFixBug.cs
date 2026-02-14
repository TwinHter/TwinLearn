using System.ComponentModel.DataAnnotations.Schema;
using Core.Constants;

namespace Core.Models;

public class KbFixBug
{
    [Column(TypeName = "ntext")]
    public required string SourceCode { get; set; }

    [Column(TypeName = "ntext")]
    public string? AnalysisResult { get; set; }

    public string? Error { get; set; }

    // Trạng thái tóm tắt (Clean, HasError, Failed)
    public string Status { get; set; } = AiStatusType.SUCCESS;

    public double? ProcessingTimeMs { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}