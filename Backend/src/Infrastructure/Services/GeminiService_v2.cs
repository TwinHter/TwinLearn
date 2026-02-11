using System.Net.Http.Json;
using Application.DTOs;
using Application.Interfaces;
using Core.Enums;
using Core.Models;
using Microsoft.Extensions.Configuration;
using Infrastructure.Services.Models;

namespace Infrastructure.Services;

public class GeminiService_v2(HttpClient httpClient, IConfiguration configuration) : IGeminiService
{
    private readonly string _baseUrl = configuration["ExternalServices:AiUrl"]
                                      ?? throw new ArgumentNullException("ExternalServices:AiUrl is missing");
    public async Task<GeminiServiceResult> CheckSyntaxAsync(string prompt, string? context = null)
    {
        var payload = new
        {
            content = prompt,
            context = context,
            task_type = AiTaskType.SYNTAX_CHECK_LLM
        };
        var response = await httpClient.PostAsJsonAsync($"{_baseUrl}/llm", payload);
        if (!response.IsSuccessStatusCode)
        {
            return new GeminiServiceResult
            {
                IsSuccess = false,
                ErrorMessage = $"Error: {response.StatusCode}",
                ProcessingTimeMs = 0
            };
        }
        var aiResponse = await response.Content.ReadFromJsonAsync<Models.GeminiResponseDto>();
        if (aiResponse == null)
        {
            return new GeminiServiceResult
            {
                IsSuccess = false,
                ErrorMessage = "Failed to parse response from Gemini API.",
                ProcessingTimeMs = 0
            };
        }

        return new GeminiServiceResult
        {
            IsSuccess = (aiResponse.Error == null) ? true : false,
            ErrorMessage = aiResponse.Error,
            ResponseText = aiResponse.Result,
            ModelVersionUsed = aiResponse.AiModel,
            ProcessingTimeMs = aiResponse.ProcessingTimeMs
        };
    }

    public async Task<GeminiServiceResult> TaskSolverAsync(string prompt, string? context = null)
    {
        var payload = new
        {
            content = prompt,
            context = context,
            task_type = AiTaskType.TASK_SOLVER_LLM
        };
        var response = await httpClient.PostAsJsonAsync($"{_baseUrl}/llm", payload);
        if (!response.IsSuccessStatusCode)
        {
            return new GeminiServiceResult
            {
                IsSuccess = false,
                ErrorMessage = $"Error: {response.StatusCode}",
                ProcessingTimeMs = 0
            };
        }
        var aiResponse = await response.Content.ReadFromJsonAsync<Models.GeminiResponseDto>();
        if (aiResponse == null)
        {
            return new GeminiServiceResult
            {
                IsSuccess = false,
                ErrorMessage = "Failed to parse response from Gemini API.",
                ProcessingTimeMs = 0
            };
        }

        return new GeminiServiceResult
        {
            IsSuccess = (aiResponse.Error == null) ? true : false,
            ErrorMessage = aiResponse.Error,
            ResponseText = aiResponse.Result,
            ModelVersionUsed = aiResponse.AiModel,
            ProcessingTimeMs = aiResponse.ProcessingTimeMs
        };
    }
}
