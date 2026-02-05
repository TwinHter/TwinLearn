using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Models;

public class KbFixBug
{
    [Column(TypeName = "ntext")] // Hoặc nvarchar(max)
    public required string SourceCode { get; set; }

    // Kết quả phân tích (Lưu JSON string của SyntaxAnalysisResultDto vào đây để đỡ phải tạo bảng con)
    [Column(TypeName = "ntext")]
    public string AnalysisResult { get; set; } = string.Empty;

    // Trạng thái tóm tắt (Clean, HasError, Failed)
    public string Status { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}