import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiClient,
  type Exam,
  type Question,
  type User,
  type AnswerResponse,
  type ChatMessage,
  type ChatResponse,
} from "@/lib/api";

// Auth hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: () => apiClient.getCurrentUser(),
    enabled: !!localStorage.getItem("access_token"),
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      apiClient.login(credentials),
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // Invalidate admin users data to refresh last login times
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: { name: string; email: string; password: string }) =>
      apiClient.signup(userData),
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      apiClient.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
  });
};

// Exam hooks
export const useExams = () => {
  return useQuery({
    queryKey: ["exams"],
    queryFn: () => apiClient.getExams(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useExam = (examId: string | undefined) => {
  return useQuery({
    queryKey: ["exams", examId],
    queryFn: () => apiClient.getExam(examId!),
    enabled: !!examId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSetUserExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examId: string) => apiClient.setUserExam(examId),
    onSuccess: () => {
      // Invalidate user data to refetch with updated exam selection
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

// Question hooks
export const useQuestions = (
  examId: string | undefined,
  subjectId: string | undefined
) => {
  return useQuery({
    queryKey: ["questions", examId, subjectId],
    queryFn: () => apiClient.getQuestions(examId!, subjectId!),
    enabled: !!examId && !!subjectId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSubmitAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      answer,
    }: {
      questionId: string;
      answer: string;
    }) => apiClient.submitAnswer(questionId, answer),
    onSuccess: () => {
      // Invalidate user progress data if we had it
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useAIExplanation = () => {
  return useMutation({
    mutationFn: ({
      questionId,
      selectedAnswer,
    }: {
      questionId: string;
      selectedAnswer?: string;
    }) => apiClient.getAIExplanation(questionId, selectedAnswer),
  });
};

export const useChatMessage = () => {
  return useMutation({
    mutationFn: ({
      questionId,
      messages,
    }: {
      questionId: string;
      messages: ChatMessage[];
    }) => apiClient.sendChatMessage(questionId, messages),
  });
};

// Health check hook
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ["health"],
    queryFn: () => apiClient.healthCheck(),
    refetchInterval: 30000, // Check every 30 seconds
    retry: 3,
  });
};

// Helper hook to check authentication status
export const useAuth = () => {
  const { data: user, isLoading, error } = useCurrentUser();

  return {
    user,
    isAuthenticated: !!user && !error,
    isLoading,
    error,
  };
};
