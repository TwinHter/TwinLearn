using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Models;

public class KbFixBug
{
    [Column(TypeName = "ntext")]
    public required string SourceCode { get; set; }

    [Column(TypeName = "ntext")]
    public string AnalysisResult { get; set; } = string.Empty;

    // Trạng thái tóm tắt (Clean, HasError, Failed)
    public string Status { get; set; } = string.Empty;

    public double? ProcessingTimeMs { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}