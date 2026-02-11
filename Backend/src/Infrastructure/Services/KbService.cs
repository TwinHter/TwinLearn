using System.Diagnostics;
using System.Text.Json;
using Application.DTOs;
using Application.Interfaces;
using Core.Models;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Repositories;

public class KbService : IKbService
{
    private readonly string _task1Script;
    private readonly string _task1InputFile;
    private readonly string _pythonDir;
    private readonly string _task2Script;
    private readonly string _task2InputFile;
    public KbService(IConfiguration configuration)
    {
        _pythonDir = configuration["KnowledgeBase:PythonDir"]
                    ?? throw new ArgumentNullException("KnowledgeBase:PythonDir not found in configuration");
        _task1Script = configuration["KnowledgeBase:KbTask1Script"]
                    ?? throw new ArgumentNullException("KnowledgeBase:KbTask1Script not found in configuration");
        _task1InputFile = configuration["KnowledgeBase:KbTask1InputFile"]
                    ?? throw new ArgumentNullException("KnowledgeBase:KbTask1InputFile not found in configuration");
        _task2Script = configuration["KnowledgeBase:KbTask2Script"] ?? throw new ArgumentNullException("KnowledgeBase:KbTask2Script not found in configuration");
        _task2InputFile = configuration["KnowledgeBase:KbTask2InputFile"] ?? throw new ArgumentNullException("KnowledgeBase:KbTask2InputFile not found in configuration");
    }

    public async Task<KbFixBug> KbCheckSyntax(string request)
    {
        // Đường dẫn file input/output nằm ngay trong folder Python
        string inputPath = Path.Combine(_pythonDir, _task1InputFile);
        string outputPath = Path.Combine(_pythonDir, "result.json"); // Tên file này do Python hardcode

        string analysisResultJson = "";
        string status = "Failed";

        try
        {
            await File.WriteAllTextAsync(inputPath, request);

            // 2. Cấu hình chạy Python ngay tại thư mục _pythonDir
            var processInfo = new ProcessStartInfo
            {
                FileName = "python3",
                Arguments = _task1Script,
                WorkingDirectory = _pythonDir,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using (var process = Process.Start(processInfo))
            {
                if (process != null)
                {
                    await process.WaitForExitAsync();
                }
            }

            if (File.Exists(outputPath))
            {
                analysisResultJson = await File.ReadAllTextAsync(outputPath);

                using (JsonDocument doc = JsonDocument.Parse(analysisResultJson))
                {
                    if (doc.RootElement.TryGetProperty("status", out JsonElement statusEl))
                    {
                        status = statusEl.GetString() ?? "Failed";
                    }
                }
            }
            else
            {
                status = "Failed";
                analysisResultJson = "{\"message\": \"Python script did not produce output\"}";
            }
        }
        catch (Exception ex)
        {
            status = "Failed";
            analysisResultJson = JsonSerializer.Serialize(new { error = ex.Message });
        }

        // 5. Trả về Object
        return new KbFixBug
        {
            SourceCode = request,
            AnalysisResult = analysisResultJson,
            Status = status,
            CreatedAt = DateTime.UtcNow
        };
    }


    public async Task<KbSolver> KbTaskSolver(string request)
    {
        string inputPath = Path.Combine(_pythonDir, _task2InputFile);
        string outputPath = Path.Combine(_pythonDir, "solver_result.json");

        string analyzedResultJson = "";
        string status = "Failed";

        try
        {
            await File.WriteAllTextAsync(inputPath, request);

            // 2. Cấu hình chạy Python ngay tại thư mục _pythonDir 
            var processInfo = new ProcessStartInfo
            {
                FileName = "python3",
                Arguments = _task2Script,
                WorkingDirectory = _pythonDir,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using (var process = Process.Start(processInfo))
            {
                if (process != null)
                {
                    await process.WaitForExitAsync();
                }
            }

            if (File.Exists(outputPath))
            {
                analyzedResultJson = await File.ReadAllTextAsync(outputPath);

                using (JsonDocument doc = JsonDocument.Parse(analyzedResultJson))
                {
                    if (doc.RootElement.TryGetProperty("status", out JsonElement statusEl))
                    {
                        status = statusEl.GetString() ?? "Failed";
                    }
                }
            }
            else
            {
                status = "Failed";
                analyzedResultJson = "{\"message\": \"Python script did not produce output\"}";
            }
        }
        catch (Exception ex)
        {
            status = "Failed";
            analyzedResultJson = JsonSerializer.Serialize(new { error = ex.Message });
        }

        // 5. Trả về Object
        return new KbSolver
        {
            InputJson = request,
            AnalysisResult = analyzedResultJson,
            Status = status,
            CreatedAt = DateTime.UtcNow
        };
    }
}