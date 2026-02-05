using System.Text.Json.Serialization;

namespace Core.Enums;

// [JsonConverter(typeof(JsonStringEnumConverter))]
public enum ChecklistStatus
{
    NotCompleted = 1,
    InProgress = 2,
    Completed = 3
}