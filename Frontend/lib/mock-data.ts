export interface Problem {
  id: number
  title: string
  description: string
  difficulty: number // Changed from "easy" | "medium" | "hard" to integer (e.g., 1000, 1100)
  source: "Codeforces" | "Leetcode" | "Other" // New source field
  status: "solved" | "pending"
  topics: TopicDto[]
  solutionCode?: string
  link?: string
  content?: string // Additional problem content/statement
  points?: number // New points field
}

export interface TopicDto {
  id: number
  name: string
}

export interface AnalysisHistory {
  id: string
  userInput: string
  engineResponse: string
  engineUsed: string
  searchDate: Date
}

export const mockProblems: Problem[] = [
  {
    id: 1,
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.",
    difficulty: 800,
    source: "Leetcode",
    topics: [
      { id: 1, name: "Mảng" },
      { id: 2, name: "Hash Map" },
    ],
    solutionCode: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    link: "https://leetcode.com/problems/two-sum/",
  },
  {
    id: 2,
    title: "Binary Tree Level Order Traversal",
    description: "Given the root of a binary tree, return the level order traversal of its nodes values.",
    difficulty: 1200,
    source: "Leetcode",
    topics: [
      { id: 3, name: "Cây nhị phân" },
      { id: 4, name: "BFS" },
    ],
    link: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    difficulty: 1100,
    source: "Leetcode",
    topics: [
      { id: 5, name: "Chuỗi" },
      { id: 6, name: "Cửa sổ trượt" },
    ],
    link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    description: "Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays.",
    difficulty: 1600,
    source: "Leetcode",
    topics: [
      { id: 1, name: "Mảng" },
      { id: 7, name: "Tìm kiếm nhị phân" },
    ],
    link: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
  },
  {
    id: 5,
    title: "A. Watermelon",
    description: "One hot summer day Pete and his friend Billy decided to buy a watermelon.",
    difficulty: 800,
    source: "Codeforces",
    topics: [
      { id: 8, name: "Toán học" },
      { id: 9, name: "Cài đặt" },
    ],
    link: "https://codeforces.com/problemset/problem/4/A",
  },
  {
    id: 6,
    title: "Maximum Subarray",
    description: "Given an integer array nums, find the contiguous subarray with the largest sum.",
    difficulty: 1000,
    source: "Leetcode",
    topics: [
      { id: 1, name: "Mảng" },
      { id: 10, name: "Lập trình động" },
    ],
    link: "https://leetcode.com/problems/maximum-subarray/",
  },
]

export const mockAnalysisHistory: AnalysisHistory[] = [
  {
    id: "1",
    userInput: "Làm thế nào để tối ưu hóa thuật toán sắp xếp?",
    engineResponse:
      "Có nhiều cách để tối ưu hóa thuật toán sắp xếp:\n\n1. **Chọn thuật toán phù hợp**: Merge Sort cho dữ liệu lớn, Quick Sort cho trung bình\n2. **Sử dụng In-place sorting**: Tiết kiệm bộ nhớ\n3. **Tối ưu hóa bộ nhớ cache**: Sắp xếp ở cấp địa phương trước\n4. **Hybrid approaches**: Kết hợp nhiều thuật toán",
    engineUsed: "LLM",
    searchDate: new Date(Date.now() - 86400000),
  },
  {
    id: "2",
    userInput: "Dynamic Programming là gì?",
    engineResponse:
      "Dynamic Programming (Lập trình động) là một kỹ thuật giải quyết vấn đề bằng cách:\n\n1. **Chia nhỏ vấn đề**: Tách thành các bài toán con\n2. **Lưu trữ kết quả**: Tránh tính toán lặp lại\n3. **Xây dựng giải pháp**: Từ dưới lên hoặc từ trên xuống\n\nVí dụ: Dãy Fibonacci, Balo (Knapsack), Đường đi ngắn nhất",
    engineUsed: "LLM",
    searchDate: new Date(Date.now() - 172800000),
  },
]

export const mockTopics: TopicDto[] = [
  { id: 1, name: "Mảng" },
  { id: 2, name: "Hash Map" },
  { id: 3, name: "Cây nhị phân" },
  { id: 4, name: "BFS" },
  { id: 5, name: "Chuỗi" },
  { id: 6, name: "Cửa sổ trượt" },
  { id: 7, name: "Tìm kiếm nhị phân" },
  { id: 8, name: "Toán học" },
  { id: 9, name: "Cài đặt" },
  { id: 10, name: "Lập trình động" },
]
