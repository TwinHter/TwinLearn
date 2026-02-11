using Core.Models;

namespace Application.Interfaces;

public interface IGeminiService
{
    Task<GeminiServiceResult> CheckSyntaxAsync(string prompt, string? context = null);
    Task<GeminiServiceResult> TaskSolverAsync(string prompt, string? context = null);
}