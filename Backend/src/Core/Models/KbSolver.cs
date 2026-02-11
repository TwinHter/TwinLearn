using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Models;

[Table("KbSolvers")]
public class KbSolver
{
    [Key]
    public int Id { get; set; }

    public int Type { get; set; }

    // Lưu raw string json input
    [Column(TypeName = "ntext")]
    public string InputJson { get; set; } = string.Empty;

    // Lưu raw string json output nhận được từ Python
    [Column(TypeName = "ntext")]
    public string AnalysisResult { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public double? ProcessingTimeMs { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
