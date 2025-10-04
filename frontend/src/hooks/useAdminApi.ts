import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  apiClient,
  type DashboardStats,
  type ActivityLog,
  type SystemHealth,
  type AdminUserResponse,
  type AdminUserCreate,
  type AdminUserUpdate,
  type UserProgressDetail,
  type Exam,
  type AdminExamCreate,
  type AdminExamUpdate,
  type AdminQuestionResponse,
  type AdminQuestionCreate,
  type AdminQuestionUpdate,
  type AdminQuestionsListResponse,
  type UserAnalytics,
  type SystemSettings,
  type AdminProfile,
  type AdminProfileUpdate,
  type PasswordChangeRequest,
  type AdminPreferences,
  type AnalyticsPerformance,
  type AnalyticsTrends,
} from "@/lib/api";

// Admin Dashboard hooks
export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: () => apiClient.getAdminDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

export const useAdminActivityLogs = (limit = 50, skip = 0) => {
  return useQuery({
    queryKey: ["admin", "activity", "logs", limit, skip],
    queryFn: () => apiClient.getAdminActivityLogs(limit, skip),
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
  });
};

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ["admin", "system", "health"],
    queryFn: () => apiClient.getSystemHealth(),
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 15 * 1000, // 15 seconds
    retry: 2,
  });
};

// Admin User Management hooks
export const useAdminUsers = (params?: {
  limit?: number;
  skip?: number;
  search?: string;
  role?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => apiClient.getAdminUsers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

export const useAdminUser = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["admin", "users", userId],
    queryFn: () => apiClient.getAdminUser(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: AdminUserCreate) =>
      apiClient.createAdminUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard", "stats"],
      });
      toast.success("User created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create user: ${error.message}`);
    },
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string;
      userData: AdminUserUpdate;
    }) => apiClient.updateAdminUser(userId, userData),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", userId] });
      toast.success("User updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => apiClient.deleteAdminUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard", "stats"],
      });
      toast.success("User deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });
};

export const useResetAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => apiClient.resetAdminUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", userId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", userId, "progress"] });
      toast.success("User reset successfully. They will need to select an exam again.");
    },
    onError: (error: Error) => {
      toast.error(`Failed to reset user: ${error.message}`);
    },
  });
};

export const useUserProgressDetail = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["admin", "users", userId, "progress"],
    queryFn: () => apiClient.getUserProgressDetail(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Admin Exam Management hooks
export const useAdminExams = (params?: {
  limit?: number;
  skip?: number;
  status?: string;
}) => {
  return useQuery({
    queryKey: ["admin", "exams", params],
    queryFn: () => apiClient.getAdminExams(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useCreateAdminExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examData: AdminExamCreate) =>
      apiClient.createAdminExam(examData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "exams"] });
      queryClient.invalidateQueries({ queryKey: ["exams"] }); // Also invalidate public exams
      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard", "stats"],
      });
      toast.success("Exam created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create exam: ${error.message}`);
    },
  });
};

export const useUpdateAdminExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      examId,
      examData,
    }: {
      examId: string;
      examData: AdminExamUpdate;
    }) => apiClient.updateAdminExam(examId, examData),
    onSuccess: (_, { examId }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "exams"] });
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exams", examId] });
      toast.success("Exam updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update exam: ${error.message}`);
    },
  });
};

export const useDeleteAdminExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examId: string) => apiClient.deleteAdminExam(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "exams"] });
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard", "stats"],
      });
      toast.success("Exam deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete exam: ${error.message}`);
    },
  });
};

// Admin Question Management hooks
export const useAdminQuestions = (
  subjectId: string | undefined,
  params?: {
    limit?: number;
    skip?: number;
    difficulty?: string;
    status?: string;
  }
) => {
  return useQuery({
    queryKey: ["admin", "questions", subjectId, params],
    queryFn: () => apiClient.getAdminQuestions(subjectId!, params),
    enabled: !!subjectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Alias for backward compatibility and clearer naming
export const useAdminSubjectQuestions = useAdminQuestions;

export const useCreateAdminQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subjectId,
      questionData,
    }: {
      subjectId: string;
      questionData: AdminQuestionCreate;
    }) => apiClient.createAdminQuestion(subjectId, questionData),
    onSuccess: (_, { subjectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "questions", subjectId],
      });
      queryClient.invalidateQueries({ queryKey: ["questions"] }); // Also invalidate public questions
      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard", "stats"],
      });
      toast.success("Question created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create question: ${error.message}`);
    },
  });
};

export const useUpdateAdminQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      questionData,
    }: {
      questionId: string;
      questionData: AdminQuestionUpdate;
    }) => apiClient.updateAdminQuestion(questionId, questionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "questions"] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Question updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update question: ${error.message}`);
    },
  });
};

export const useDeleteAdminQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: string) =>
      apiClient.deleteAdminQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "questions"] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard", "stats"],
      });
      toast.success("Question deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete question: ${error.message}`);
    },
  });
};

// Admin Analytics hooks
export const useUserAnalytics = () => {
  return useQuery({
    queryKey: ["admin", "analytics", "users"],
    queryFn: () => apiClient.getUserAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Admin System Settings hooks
export const useSystemSettings = () => {
  return useQuery({
    queryKey: ["admin", "system", "settings"],
    queryFn: () => apiClient.getSystemSettings(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

export const useUpdateSystemSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      category,
      settings,
    }: {
      category: string;
      settings: Record<string, unknown>;
    }) => apiClient.updateSystemSettings(category, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "system", "settings"],
      });
      toast.success("Settings updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update settings: ${error.message}`);
    },
  });
};

// Admin Profile Management hooks
export const useAdminProfile = () => {
  return useQuery({
    queryKey: ["admin", "profile"],
    queryFn: () => apiClient.getAdminProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: AdminProfileUpdate) =>
      apiClient.updateAdminProfile(profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (passwordData: PasswordChangeRequest) =>
      apiClient.changeAdminPassword(passwordData),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to change password: ${error.message}`);
    },
  });
};

// Admin Preferences hooks
export const useAdminPreferences = () => {
  return useQuery({
    queryKey: ["admin", "preferences"],
    queryFn: () => apiClient.getAdminPreferences(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useUpdateAdminPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: AdminPreferences) =>
      apiClient.updateAdminPreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "preferences"] });
      toast.success("Preferences updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update preferences: ${error.message}`);
    },
  });
};

// Admin Settings hooks (by category)
export const useAdminSettings = (category: string) => {
  return useQuery({
    queryKey: ["admin", "settings", category],
    queryFn: () => apiClient.getAdminSettings(category),
    enabled: !!category,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

export const useUpdateAdminSettingsCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      category,
      settings,
    }: {
      category: string;
      settings: Record<string, unknown>;
    }) => apiClient.updateAdminSettings(category, settings),
    onSuccess: (_, { category }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "settings", category],
      });
      toast.success("Settings updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update settings: ${error.message}`);
    },
  });
};

// Admin Analytics Performance hooks
export const useAdminAnalyticsPerformance = (timeRange: string) => {
  return useQuery({
    queryKey: ["admin", "analytics", "performance", timeRange],
    queryFn: () => apiClient.getAnalyticsPerformance(timeRange),
    enabled: !!timeRange,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

// Admin Analytics Trends hooks
export const useAdminAnalyticsTrends = (metric: string, timeRange: string) => {
  return useQuery({
    queryKey: ["admin", "analytics", "trends", metric, timeRange],
    queryFn: () => apiClient.getAnalyticsTrends(metric, timeRange),
    enabled: !!metric && !!timeRange,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

// Admin role check hook
export const useAdminRole = () => {
  return useQuery({
    queryKey: ["admin", "role", "check"],
    queryFn: () => apiClient.checkAdminRole(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};
