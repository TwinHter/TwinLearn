using Application.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")] // URL: /api/searchhistory
public class SearchHistoryController(HistoryService historyService) : ControllerBase
{

    // GET /api/searchhistory?limit=10
    [HttpGet]
    public async Task<IActionResult> GetMySearchHistory([FromQuery] int limit = 10)
    {
        var history = await historyService.GetSearchHistoriesAsync();
        return Ok(history.Take(limit));
    }

    // DELETE /api/searchhistory/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHistoryItem(int id)
    {
        // (Giả sử bạn sửa hàm DeleteSearchHistoryAsync trả về bool)
        var result = await historyService.DeleteSearchHistoryAsync(id);
        if (!result)
            return NotFound("Không tìm thấy lịch sử này.");

        return NoContent();
    }
}