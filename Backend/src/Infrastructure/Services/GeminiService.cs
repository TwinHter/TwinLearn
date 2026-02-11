using Application.Interfaces;
using Core.Models;
using Microsoft.Extensions.Configuration;
using Mscc.GenerativeAI;

namespace Infrastructure.Services;

public class GeminiService : IGeminiService
{
    private readonly string _apiKey;

    // Nó vẫn cần IConfiguration để đọc API Key
    public GeminiService(IConfiguration configuration)
    {
        _apiKey = configuration["Gemini:ApiKey"]
                  ?? throw new ArgumentNullException("Gemini:ApiKey not found in configuration");
    }

    public async Task<GeminiServiceResult> GetGeminiResponseAsync(string prompt, string? context = null)
    {
        try
        {
            var googleAI = new GoogleAI(apiKey: _apiKey);
            var model = googleAI.GenerativeModel(model: Model.Gemini25Flash);

            string enhancedPrompt = $@"
Bạn là một trợ lý lập trình chuyên nghiệp và kiệm lời.
Nhiệm vụ của bạn là phân tích yêu cầu của người dùng và đưa ra câu trả lời ĐÚNG TRỌNG TÂM, NGẮN GỌN.

Dưới đây là yêu cầu của người dùng:
---
{prompt}
---

Hãy thực hiện CHÍNH XÁC một trong hai tác vụ sau:

KỊCH BẢN 1: Nếu yêu cầu là một ĐOẠN CODE cần sửa lỗi:
1. Xác định lỗi (nếu có), chỉ cần đưa ra tên lỗi ở dòng nào, không cần đưa chi tiết.
2. Giải thích ngắn gọn bằng tiếng việt cho lỗi đó.
3. KHÔNG giải thích chi tiết về cách hoạt động của code nếu không được hỏi.

KỊCH BẢN 2: Nếu yêu cầu là một BÀI TẬP CODE (đưa ra ý tưởng):
1. Cung cấp kế hoạch giải quyết theo từng bước (step-by-step). Dùng gạch đầu dòng.
2. Giữ các bước ở mức ý tưởng, không cần code chi tiết.
3. **Quan trọng:** Ở cuối cùng, đề xuất 2-3 chủ đề (Topics) chính cần học để giải bài này (ví dụ: `Topics: Array, Sorting, Greedy`).

YÊU CẦU CHUNG:
- Giữ câu trả lời ngắn gọn và đi thẳng vào vấn đề.
";
            var response = await model.GenerateContent(enhancedPrompt);

            return new GeminiServiceResult
            {
                IsSuccess = true,
                ResponseText = response.Text ?? string.Empty,
                ModelVersionUsed = model.Model,
                ProcessingTimeMs = null
            };
        }
        catch (Exception ex)
        {
            return new GeminiServiceResult
            {
                IsSuccess = false,
                ErrorMessage = ex.Message,
                ResponseText = string.Empty,
                ModelVersionUsed = null,
                ProcessingTimeMs = null
            };
        }
    }

    public async Task<GeminiServiceResult> TaskSolverAsync(string prompt, string? context = null)
    {
        return await GetGeminiResponseAsync(prompt, context);
    }
    public async Task<GeminiServiceResult> CheckSyntaxAsync(string prompt, string? context = null)
    {
        return await GetGeminiResponseAsync(prompt, context);
    }
}
