using Core.Models;

namespace Application.Interfaces;

public interface IKbService
{
    /// <summary>
    /// Chạy phân tích code, lưu vào DB và trả về kết quả
    /// </summary>
    Task<KbSolver> KbTaskSolver(string request);
    Task<KbFixBug> KbCheckSyntax(string request);
}