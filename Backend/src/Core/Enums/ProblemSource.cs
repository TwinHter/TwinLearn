using System.Text.Json.Serialization;

namespace Core.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ProblemSource
{
    Codeforces = 1,
    LeetCode = 2,
    HackerRank = 3,
    Other = 4
}