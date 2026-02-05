using Core.Models;

namespace Core.Interfaces;

public interface IGeminiService
{
    Task<GeminiServiceResult> GetGeminiResponseAsync(string prompt);
}