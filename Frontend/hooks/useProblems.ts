"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "../lib/axios-client"
import type { CreateProblemDto, UpdateProblemDto } from "../lib/types"

export function useProblems(filters?: {
  topicId?: string
  minDiff?: number
  maxDiff?: number
  title?: string
  source?: string
}) {
  return useQuery({
    queryKey: ["problems", filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters?.topicId) params.append("topicId", filters.topicId)
      if (filters?.minDiff !== undefined) params.append("minDiff", filters.minDiff.toString())
      if (filters?.maxDiff !== undefined) params.append("maxDiff", filters.maxDiff.toString())
      if (filters?.title) params.append("title", filters.title)
      if (filters?.source) params.append("source", filters.source)

      const { data } = await apiClient.get(`/problem?${params.toString()}`)
      return data
    },
  })
}

export function useProblem(id: number) {
  return useQuery({
    queryKey: ["problem", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/problem/${id}`)
      return data
    },
  })
}

export function useCreateProblem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (problem: CreateProblemDto) => {
      const { data } = await apiClient.post("/problem", problem)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] })
    },
  })
}

export function useUpdateProblem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, problem }: { id: number; problem: UpdateProblemDto }) => {
      const { data } = await apiClient.put(`/problem/${id}`, problem)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] })
    },
  })
}

export function useDeleteProblem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/problem/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] })
    },
  })
}
