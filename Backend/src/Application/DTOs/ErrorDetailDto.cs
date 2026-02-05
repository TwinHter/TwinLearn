using System.Text.Json.Serialization;

namespace Core.DTOs;

// Class đại diện cho một lỗi cụ thể (khớp với item trong list "errors" của Python)
public class ErrorItemDto
{
    [JsonPropertyName("line")]
    public int Line { get; set; }

    [JsonPropertyName("level")]
    public string Level { get; set; } = string.Empty;

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    [JsonPropertyName("fix")]
    public string Fix { get; set; } = string.Empty;

    [JsonPropertyName("raw")]
    public string? RawLog { get; set; }
}

// Class đại diện cho toàn bộ kết quả trả về từ Python
public class ErrorResultDto
{
    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty; // "clean", "has_errors", "parse_error"...

    [JsonPropertyName("errors")]
    public List<ErrorItemDto> Errors { get; set; } = new List<ErrorItemDto>();

    // Field phụ để hứng raw log nếu script python trả về khi lỗi parsing
    [JsonPropertyName("raw_log")]
    public string? RawLog { get; set; }
}