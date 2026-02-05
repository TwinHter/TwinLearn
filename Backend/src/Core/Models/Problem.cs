using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Enums;

namespace Core.Models;

public class Problem
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public int Difficulty { get; set; }
    public string? SolutionCode { get; set; }
    public string? Link { get; set; }

    public ProblemSource Source { get; set; }

    // Navigation property for many-to-many relationship with Topic
    public ICollection<ProblemTopic> ProblemTopics { get; set; } = new List<ProblemTopic>();
}