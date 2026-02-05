using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Enums;

namespace Core.Models;

public class Checklist
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public int UserId { get; set; }
    public int? ProblemId { get; set; }
    public string? Description { get; set; }

    public ChecklistStatus Status { get; set; }
    public DateTime LastUpdated { get; set; }

    // Navigation properties
    public User? User { get; set; }
    public Problem? Problem { get; set; }
}