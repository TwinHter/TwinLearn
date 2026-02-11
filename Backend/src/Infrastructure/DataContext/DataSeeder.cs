using Core.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Core.Enums; // Giả sử Enums của bạn nằm ở đây
using System;
using System.Collections.Generic;

namespace Infrastructure.Data;

public static class DataSeeder
{
    public static void Seed(AppDbContext context)
    {
        // 1. Đảm bảo database đã được tạo và áp dụng các migration
        context.Database.Migrate();

        // 2. Seed User
        if (!context.Users.Any())
        {
            var defaultUser = new User { Username = "default_user", Role = Core.Enums.UserRole.Admin, Password = "123456" };
            context.Users.Add(defaultUser);
            context.SaveChanges();
        }

        // 3. Seed Topics (Mở rộng)
        if (!context.Topics.Any())
        {
            var topics = new List<Topic>
            {
                new Topic { Name = "Mảng (Array)", Description = "Các bài tập về mảng một chiều, hai chiều." },
                new Topic { Name = "Đệ quy (Recursion)", Description = "Các bài tập sử dụng giải thuật đệ quy." },
                new Topic { Name = "Sắp xếp (Sorting)", Description = "Các thuật toán sắp xếp như Bubble Sort, Quick Sort." },
                new Topic { Name = "Chuỗi (String)", Description = "Các bài tập xử lý, tìm kiếm, biến đổi chuỗi." },
                new Topic { Name = "Cấu trúc dữ liệu (Data Structures)", Description = "Stack, Queue, Linked List, Hashtable." },
                new Topic { Name = "Quy hoạch động (Dynamic Programming)", Description = "Các bài toán tối ưu hóa." }
            };
            context.Topics.AddRange(topics);
            context.SaveChanges();
        }

        // 4. Seed Problems (Mở rộng lên 10)
        if (!context.Problems.Any())
        {
            // Lấy các topic đã seed
            var arrayTopic = context.Topics.First(t => t.Name == "Mảng (Array)");
            var recursionTopic = context.Topics.First(t => t.Name == "Đệ quy (Recursion)");
            var sortingTopic = context.Topics.First(t => t.Name == "Sắp xếp (Sorting)");
            var stringTopic = context.Topics.First(t => t.Name == "Chuỗi (String)");
            var dsTopic = context.Topics.First(t => t.Name == "Cấu trúc dữ liệu (Data Structures)");
            var dpTopic = context.Topics.First(t => t.Name == "Quy hoạch động (Dynamic Programming)");

            var problems = new List<Problem>
            {
                new Problem
                {
                    Title = "Đảo ngược mảng", Difficulty = 1000, Source = ProblemSource.Codeforces, SolutionCode = "Array.Reverse(arr);",
                    ProblemTopics = new List<ProblemTopic> { new ProblemTopic { Topic = arrayTopic } }
                },
                new Problem
                {
                    Title = "Tính Giai thừa", Difficulty = 500, Source = ProblemSource.LeetCode, SolutionCode = "if (n == 0) return 1; return n * Factorial(n-1);",
                    ProblemTopics = new List<ProblemTopic> { new ProblemTopic { Topic = recursionTopic } }
                },
                new Problem
                {
                    Title = "Tìm số lớn nhất trong mảng", Difficulty = 200, Source = ProblemSource.Other, SolutionCode = "return arr.Max();",
                    ProblemTopics = new List<ProblemTopic> { new ProblemTopic { Topic = arrayTopic } }
                },
                new Problem
                {
                    Title = "Bubble Sort", Difficulty = 1200, Source = ProblemSource.Other, SolutionCode = "for(int i=0; i<n-1; i++) for(int j=0; j<n-i-1; j++) if(arr[j]>arr[j+1]) Swap(arr[j], arr[j+1]);",
                    ProblemTopics = new List<ProblemTopic> { new ProblemTopic { Topic = sortingTopic }, new ProblemTopic { Topic = arrayTopic } }
                },
                new Problem
                {
                    Title = "Kiểm tra chuỗi Palindrome", Difficulty = 800, Source = ProblemSource.LeetCode, SolutionCode = "string reversed = new string(s.Reverse().ToArray()); return s == reversed;",
                    ProblemTopics = new List<ProblemTopic> { new ProblemTopic { Topic = stringTopic } }
                },
                new Problem
                {
                    Title = "Dãy con tăng dài nhất", Difficulty = 2000, Source = ProblemSource.Codeforces, SolutionCode = "int[] dp = new int[n]; Array.Fill(dp, 1); ...",
                    ProblemTopics = new List<ProblemTopic> { new ProblemTopic { Topic = dpTopic }, new ProblemTopic { Topic = arrayTopic } }
                },
                new Problem
                {
                    Title = "Tính Fibonacci (Đệ quy)", Difficulty = 600, Source = ProblemSource.Other, SolutionCode = "if (n <= 1) return n; return Fib(n-1) + Fib(n-2);",
                    ProblemTopics = new List<ProblemTopic> { new ProblemTopic { Topic = recursionTopic } }
                },
                new Problem
                {
                    Title = "Dùng Stack đảo ngược chuỗi", Difficulty = 1100, Source = ProblemSource.LeetCode, SolutionCode = "Stack<char> stack = new Stack<char>(); foreach(char c in s) stack.Push(c); ...",
                    ProblemTopics = new List<ProblemTopic> { new ProblemTopic { Topic = dsTopic }, new ProblemTopic { Topic = stringTopic } }
                },
                new Problem
                {
                    Title = "Tìm phần tử lặp lại (HashSet)", Difficulty = 1300, Source = ProblemSource.LeetCode, SolutionCode = "HashSet<int> seen = new HashSet<int>(); foreach(int i in arr) { if(!seen.Add(i)) return i; }",
                    ProblemTopics = new List<ProblemTopic> { new ProblemTopic { Topic = dsTopic }, new ProblemTopic { Topic = arrayTopic } }
                },
                new Problem
                {
                    Title = "Tính Fibonacci (Quy hoạch động)", Difficulty = 1500, Source = ProblemSource.Other, SolutionCode = "int[] f = new int[n+1]; f[0]=0; f[1]=1; for(int i=2; i<=n; i++) f[i]=f[i-1]+f[i-2];",
                    ProblemTopics = new List<ProblemTopic> { new ProblemTopic { Topic = dpTopic } }
                }
            };
            context.Problems.AddRange(problems);
            context.SaveChanges();
        }

        // 5. Seed Checklists (4 mẫu)
        if (!context.Checklists.Any())
        {
            // Lấy User và Problem đã seed
            var defaultUser = context.Users.First(u => u.Username == "default_user");
            var problemToLink1 = context.Problems.First(p => p.Title == "Đảo ngược mảng");
            var problemToLink2 = context.Problems.First(p => p.Title == "Kiểm tra chuỗi Palindrome");

            var checklists = new List<Checklist>
            {
                // Item 1: Liên kết với ProblemId, không có Description
                new Checklist
                {
                    UserId = defaultUser.Id,
                    ProblemId = problemToLink1.Id, // Liên kết Problem
                    Description = null, // Không có description
                    Status = ChecklistStatus.NotCompleted,
                    LastUpdated = DateTime.UtcNow
                },
                
                // Item 2: Liên kết với ProblemId, không có Description, đã hoàn thành
                new Checklist
                {
                    UserId = defaultUser.Id,
                    ProblemId = problemToLink2.Id, // Liên kết Problem
                    Description = null, // Không có description
                    Status = ChecklistStatus.Completed,
                    LastUpdated = DateTime.UtcNow.AddDays(-1) // Cập nhật hôm qua
                },

                // Item 3: Raw text, không có ProblemId (ProblemId là null)
                new Checklist
                {
                    UserId = defaultUser.Id,
                    ProblemId = null, // <-- Giả định ProblemId là 'int?' (nullable)
                    Description = "Đọc lại lý thuyết về Quy hoạch động", // Có description
                    Status = ChecklistStatus.NotCompleted,
                    LastUpdated = DateTime.UtcNow
                },

                // Item 4: Raw text, không có ProblemId, đã hoàn thành
                new Checklist
                {
                    UserId = defaultUser.Id,
                    ProblemId = null, // <-- Giả định ProblemId là 'int?' (nullable)
                    Description = "Làm 5 bài tập về Sắp xếp trên LeetCode", // Có description
                    Status = ChecklistStatus.Completed,
                    LastUpdated = DateTime.UtcNow.AddHours(-5) // Cập nhật 5h trước
                }
            };

            context.Checklists.AddRange(checklists);
            context.SaveChanges();
        }
    }
}