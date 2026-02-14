using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")] // URL: /api/metadata
public class MetadataController(MetadataService metadataService) : ControllerBase
{
    // private readonly string _task1Data;
    // private readonly string _task2Data;
    // private readonly string _pythonDir;
    // public MetadataController(IConfiguration configuration)
    // {
    //     _pythonDir = configuration["KnowledgeBase:PythonDir"]
    //                 ?? throw new ArgumentNullException("KnowledgeBase:PythonDir not found in configuration");
    //     _task1Data = configuration["KnowledgeBase:KbTask1Dataset"]
    //                 ?? throw new ArgumentNullException("KnowledgeBase:KbTask1Dataset not found in configuration");
    //     _task2Data = configuration["KnowledgeBase:KbTask2Dataset"]
    //                 ?? throw new ArgumentNullException("KnowledgeBase:KbTask2Dataset not found in configuration");
    // }
    // [HttpGet("kb-solver")]
    // public async Task<IActionResult> GetMetadata()
    // {
    //     // Đường dẫn đến file solver_kb.json
    //     var filePath = Path.Combine(_pythonDir, _task2Data);

    //     if (!System.IO.File.Exists(filePath))
    //         return NotFound("Knowledge base file not found.");

    //     var jsonContent = await System.IO.File.ReadAllTextAsync(filePath);

    //     // Trả về nội dung JSON nguyên bản
    //     return Content(jsonContent, "application/json");
    // }

    [HttpGet("kb-solver")]
    public async Task<IActionResult> GetMetadata()
    {
        var result = await metadataService.GetSolverMetadataAsync();
        if (result == null) return NotFound();
        return Ok(result);
    }
}