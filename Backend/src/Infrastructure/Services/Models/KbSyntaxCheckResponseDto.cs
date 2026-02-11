using System;
using System.Text.Json.Serialization;

namespace Infrastructure.Services.Models;

internal class KbSyntaxCheckResponseDto
{
    [JsonPropertyName("result")]
    public string Result { get; set; } = "";

    [JsonPropertyName("status")]
    public string Status { get; set; } = "";

    [JsonPropertyName("processing_time_ms")]
    public double ProcessingTimeMs { get; set; }

    [JsonPropertyName("error")]
    public string? Error { get; set; }
}
