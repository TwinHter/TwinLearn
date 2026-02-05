using Core.Models;

namespace Core.Interfaces;

public interface IKbService
{
    /// <summary>
    /// Chạy phân tích code, lưu vào DB và trả về kết quả
    /// </summary>
    Task<KbFixBug> AnalyzeCodeSyntax(string request);
    Task<KbSolver> AnalyzeCodeSolver(string request);
}