using System;
using System.Text.Json.Serialization;

namespace Infrastructure.Services.Models;

internal class KbTaskSolverResponseDto
{
    [JsonPropertyName("type")]
    public int Type { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; } = "";

    [JsonPropertyName("result")]
    public string Result { get; set; } = "";

    [JsonPropertyName("processing_time_ms")]
    public double ProcessingTimeMs { get; set; }

    [JsonPropertyName("error")]
    public string? Error { get; set; }
}
