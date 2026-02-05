using System.Text.Json.Serialization;

namespace Core.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum EngineType
{
    Gemini = 1,
    KnowledgeBase = 2,
}