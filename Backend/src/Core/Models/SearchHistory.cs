using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Enums;

namespace Core.Models;

public class SearchHistory
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int UserId { get; set; }
    public string? Query { get; set; }
    public string? Response { get; set; }
    public EngineType EngineUsed { get; set; }
    public required DateTime SearchDate { get; set; }

    // Navigation property
    public User? User { get; set; }
}