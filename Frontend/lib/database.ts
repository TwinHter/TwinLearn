export const mockDatabase = {
  problems: [
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
        { id: 8, name: "Lập trình động" },
      ],
      link: "https://leetcode.com/problems/maximum-subarray/",
    },
  ],
  checklist: [
    {
      id: 1,
      userId: 1,
      problemId: 1,
      description: null,
      status: "pending",
      lastUpdated: new Date(),
    },
    {
      id: 2,
      userId: 1,
      problemId: 2,
      description: null,
      status: "completed",
      lastUpdated: new Date(),
    },
    {
      id: 3,
      userId: 1,
      problemId: null,
      description: "Học về Graph Traversal",
      status: "pending",
      lastUpdated: new Date(),
    },
  ],
  searchHistory: [
    {
      id: 1,
      userInput: "Làm thế nào để tối ưu hóa thuật toán sắp xếp?",
      engineResponse:
        "Có nhiều cách để tối ưu hóa thuật toán sắp xếp:\n\n1. Chọn thuật toán phù hợp\n2. Sử dụng In-place sorting\n3. Tối ưu hóa bộ nhớ cache",
      engineUsed: "LLM",
      searchDate: new Date(Date.now() - 86400000),
    },
  ],
  topics: [
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
  ],
}
