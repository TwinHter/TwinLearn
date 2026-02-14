using System;
using System.Text.Json.Serialization;

namespace Infrastructure.Services.Models;

public class PyRawResponse
{
    [JsonPropertyName("states")]
    public List<PyState> States { get; set; } = new();

    [JsonPropertyName("steps")]
    public List<PyStep> Steps { get; set; } = new();

    [JsonPropertyName("problems")]
    public List<PyProblem> Problems { get; set; } = new();
}

public class PyState
{
    [JsonPropertyName("id")] public string Id { get; set; } = "";
    [JsonPropertyName("type")] public string Type { get; set; } = ""; // "initial" hoặc "goal"
    [JsonPropertyName("label")] public string? Label { get; set; }
    [JsonPropertyName("description")] public string Description { get; set; } = "";
}

public class PyStep
{
    [JsonPropertyName("id")] public string Id { get; set; } = "";
    [JsonPropertyName("description")] public string Description { get; set; } = "";
}

public class PyProblem
{
    [JsonPropertyName("id")] public string Id { get; set; } = "";
    [JsonPropertyName("title")] public string Title { get; set; } = "";
    [JsonPropertyName("goal")] public string Goal { get; set; } = "";
    [JsonPropertyName("initial_states")]
    public List<string> InitialStates { get; set; } = new List<string>();
}
