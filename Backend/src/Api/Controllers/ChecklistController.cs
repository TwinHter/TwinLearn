using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ChecklistController(ChecklistService checklistService) : ControllerBase
{

    // GET /api/checklist
    [HttpGet]
    public async Task<IActionResult> GetMyChecklist()
    {
        var checklist = await checklistService.GetChecklistAsync();
        return Ok(checklist);
    }

    // POST /api/checklist
    [HttpPost]
    public async Task<IActionResult> AddToChecklist([FromBody] CreateChecklistDto createDto)
    {
        var newChecklistItem = await checklistService.CreateChecklistAsync(createDto);
        // Trả về 201 Created
        return CreatedAtAction(nameof(GetChecklistById), new { id = newChecklistItem.Id }, newChecklistItem);
    }

    // GET /api/checklist/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetChecklistById(int id)
    {
        var item = await checklistService.GetChecklistByIdAsync(id);
        if (item == null)
            return NotFound();
        return Ok(item);
    }

    // PUT /api/checklist/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateChecklistStatus(int id, [FromBody] UpdateChecklistDto updateDto)
    {
        var updatedItem = await checklistService.UpdateChecklistAsync(id, updateDto);
        if (updatedItem == null)
            return NotFound("Không tìm thấy checklist item.");

        return Ok(updatedItem);
    }

    // DELETE /api/checklist/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveFromChecklist(int id)
    {
        var result = await checklistService.DeleteChecklistAsync(id);
        if (!result) return NotFound("Không tìm thấy checklist item.");

        return NoContent();
    }
}