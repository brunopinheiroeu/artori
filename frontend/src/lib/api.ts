const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://127.0.0.1:8000/api/v1" : "/api/v1");

// Types matching backend models
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  selected_exam_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  total_questions?: number;
  duration?: string;
  icon?: string;
  gradient?: string;
  bgColor?: string;
}

export interface Exam {
  id: string;
  name: string;
  country: string;
  description: string;
  subjects?: Subject[];
  total_questions?: number;
  gradient?: string;
  borderColor?: string;
  bgColor?: string;
  flag?: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface Explanation {
  reasoning: string[];
  concept: string;
  sources: string[];
  bias_check: string;
  reflection: string;
}

export interface Question {
  id: string;
  subject_id: string;
  question: string;
  options: Option[];
}

export interface QuestionWithAnswer extends Question {
  correct_answer: string;
  explanation: Explanation;
}

export interface AnswerResponse {
  correct: boolean;
  correct_answer: string;
  explanation: Explanation;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface SubjectProgress {
  subject_id: string;
  progress: number;
  questions_solved: number;
  correct_answers: number;
  accuracy_rate: number;
}

export interface UserProgress {
  user_id: string;
  exam_id: string;
  overall_progress: number;
  questions_solved: number;
  accuracy_rate: number;
  study_time_hours: number;
  current_streak_days: number;
  last_studied_date?: string;
  subject_progress: SubjectProgress[];
}

export interface DashboardResponse {
  selected_exam: Exam;
  user_progress?: UserProgress;
}

// Admin-specific types
export interface DashboardStats {
  total_users: number;
  active_users: number;
  new_users_today: number;
  total_exams: number;
  total_questions: number;
  total_subjects: number;
  completion_rate: number;
  average_accuracy: number;
}

export interface ActivityLog {
  id: string;
  admin_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details: Record<string, unknown>;
  timestamp: string;
  ip_address?: string;
}

export interface SystemHealth {
  status: string;
  uptime: string;
  response_time: number;
  error_rate: number;
  active_connections: number;
}

export interface AdminUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  selected_exam_id?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  login_count: number;
}

export interface AdminUsersListResponse {
  users: AdminUserResponse[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AdminUserCreate {
  name: string;
  email: string;
  password: string;
  role?: string;
  status?: string;
}

export interface AdminUserUpdate {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
}

export interface UserProgressDetail {
  user_id: string;
  exam_id: string;
  exam_name: string;
  overall_progress: number;
  questions_solved: number;
  accuracy_rate: number;
  study_time_hours: number;
  current_streak_days: number;
  last_studied_date?: string;
  subject_progress: SubjectProgress[];
}

export interface AdminExamCreate {
  name: string;
  country: string;
  description: string;
  status?: string;
  gradient?: string;
  borderColor?: string;
  bgColor?: string;
  flag?: string;
}

export interface AdminExamUpdate {
  name?: string;
  country?: string;
  description?: string;
  status?: string;
  gradient?: string;
  borderColor?: string;
  bgColor?: string;
  flag?: string;
}

export interface AdminQuestionResponse {
  id: string;
  subject_id: string;
  question: string;
  question_type: string;
  difficulty: string;
  options: Option[];
  correct_answer: string;
  explanation: Explanation;
  tags: string[];
  status: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface AdminQuestionsListResponse {
  questions: AdminQuestionResponse[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AdminQuestionCreate {
  question: string;
  question_type?: string;
  difficulty?: string;
  options: Option[];
  correct_answer: string;
  explanation: Explanation;
  tags?: string[];
  status?: string;
}

export interface AdminQuestionUpdate {
  question?: string;
  question_type?: string;
  difficulty?: string;
  options?: Option[];
  correct_answer?: string;
  explanation?: Explanation;
  tags?: string[];
  status?: string;
}

export interface UserAnalytics {
  total_users: number;
  active_users: number;
  new_registrations: number;
  user_retention_rate: number;
  geographic_distribution: Record<string, number>;
  engagement_metrics: Record<string, number>;
}

export interface SystemSettings {
  category: string;
  settings: Record<string, unknown>;
  updated_by: string;
  updated_at: string;
}

export interface AdminProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface AdminProfileUpdate {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  location?: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}

// New types for the additional endpoints
export interface AdminPreferences {
  system_alerts: boolean;
  user_activity: boolean;
  weekly_reports: boolean;
  emergency_alerts: boolean;
  maintenance_updates: boolean;
  feature_updates: boolean;
  two_factor: boolean;
  login_alerts: boolean;
}

export interface AnalyticsPerformance {
  response_time: number;
  throughput: number;
  error_rate: number;
  uptime: number;
  active_connections: number;
  memory_usage: number;
  cpu_usage: number;
  database_connections: number;
}

export interface AnalyticsTrends {
  metric: string;
  timeRange: string;
  data: Array<{
    timestamp: string;
    value: number;
  }>;
  trend: "up" | "down" | "stable";
  change_percentage: number;
}

// API Client class
class ApiClient {
  private baseUrl: string;
  public token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Load token from localStorage if available
    this.token = localStorage.getItem("access_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Add authorization header if token exists
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Store token
    this.token = response.access_token;
    localStorage.setItem("access_token", response.access_token);

    return response;
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    // Store token
    this.token = response.access_token;
    localStorage.setItem("access_token", response.access_token);

    return response;
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/auth/me");
  }

  logout() {
    this.token = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("userExam");
  }

  // Exam methods
  async getExams(): Promise<Exam[]> {
    return this.request<Exam[]>("/exams");
  }

  async getExam(examId: string): Promise<Exam> {
    return this.request<Exam>(`/exams/${examId}`);
  }

  async setUserExam(examId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>("/users/me/exam", {
      method: "POST",
      body: JSON.stringify({ exam_id: examId }),
    });
  }

  async getDashboard(): Promise<DashboardResponse> {
    return this.request<DashboardResponse>("/users/me/dashboard");
  }

  // Question methods
  async getQuestions(examId: string, subjectId: string): Promise<Question[]> {
    return this.request<Question[]>(
      `/exams/${examId}/subjects/${subjectId}/questions`
    );
  }

  async submitAnswer(
    questionId: string,
    answer: string
  ): Promise<AnswerResponse> {
    return this.request<AnswerResponse>(`/questions/${questionId}/answer`, {
      method: "POST",
      body: JSON.stringify({ answer }),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; database: string }> {
    return this.request<{ status: string; database: string }>("/healthz");
  }

  // Admin Dashboard methods
  async getAdminDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>("/admin/dashboard/stats");
  }

  async getAdminActivityLogs(limit = 50, skip = 0): Promise<ActivityLog[]> {
    return this.request<ActivityLog[]>(
      `/admin/dashboard/activity?limit=${limit}&skip=${skip}`
    );
  }

  async getSystemHealth(): Promise<SystemHealth> {
    return this.request<SystemHealth>("/admin/dashboard/performance");
  }

  // Admin User Management methods
  async getAdminUsers(params?: {
    limit?: number;
    skip?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<AdminUsersListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.skip) searchParams.append("skip", params.skip.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.role) searchParams.append("role", params.role);
    if (params?.status) searchParams.append("status", params.status);

    const queryString = searchParams.toString();
    return this.request<AdminUsersListResponse>(
      `/admin/users${queryString ? `?${queryString}` : ""}`
    );
  }

  async createAdminUser(userData: AdminUserCreate): Promise<AdminUserResponse> {
    return this.request<AdminUserResponse>("/admin/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getAdminUser(userId: string): Promise<AdminUserResponse> {
    return this.request<AdminUserResponse>(`/admin/users/${userId}`);
  }

  async updateAdminUser(
    userId: string,
    userData: AdminUserUpdate
  ): Promise<AdminUserResponse> {
    return this.request<AdminUserResponse>(`/admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteAdminUser(userId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/users/${userId}`, {
      method: "DELETE",
    });
  }

  async getUserProgressDetail(userId: string): Promise<UserProgressDetail[]> {
    return this.request<UserProgressDetail[]>(
      `/admin/users/${userId}/progress`
    );
  }

  // Admin Exam Management methods
  async getAdminExams(params?: {
    limit?: number;
    skip?: number;
    status?: string;
  }): Promise<Exam[]> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.skip) searchParams.append("skip", params.skip.toString());
    if (params?.status) searchParams.append("status", params.status);

    const queryString = searchParams.toString();
    return this.request<Exam[]>(
      `/admin/exams${queryString ? `?${queryString}` : ""}`
    );
  }

  async createAdminExam(examData: AdminExamCreate): Promise<Exam> {
    return this.request<Exam>("/admin/exams", {
      method: "POST",
      body: JSON.stringify(examData),
    });
  }

  async updateAdminExam(
    examId: string,
    examData: AdminExamUpdate
  ): Promise<Exam> {
    return this.request<Exam>(`/admin/exams/${examId}`, {
      method: "PUT",
      body: JSON.stringify(examData),
    });
  }

  async deleteAdminExam(examId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/exams/${examId}`, {
      method: "DELETE",
    });
  }

  // Admin Question Management methods
  async getAdminQuestions(
    subjectId: string,
    params?: {
      limit?: number;
      skip?: number;
      difficulty?: string;
      status?: string;
    }
  ): Promise<AdminQuestionsListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.skip) searchParams.append("skip", params.skip.toString());
    if (params?.difficulty)
      searchParams.append("difficulty", params.difficulty);
    if (params?.status) searchParams.append("status", params.status);

    const queryString = searchParams.toString();
    return this.request<AdminQuestionsListResponse>(
      `/admin/subjects/${subjectId}/questions${
        queryString ? `?${queryString}` : ""
      }`
    );
  }

  async createAdminQuestion(
    subjectId: string,
    questionData: AdminQuestionCreate
  ): Promise<AdminQuestionResponse> {
    return this.request<AdminQuestionResponse>(
      `/admin/subjects/${subjectId}/questions`,
      {
        method: "POST",
        body: JSON.stringify(questionData),
      }
    );
  }

  async updateAdminQuestion(
    questionId: string,
    questionData: AdminQuestionUpdate
  ): Promise<AdminQuestionResponse> {
    return this.request<AdminQuestionResponse>(
      `/admin/questions/${questionId}`,
      {
        method: "PUT",
        body: JSON.stringify(questionData),
      }
    );
  }

  async deleteAdminQuestion(questionId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/questions/${questionId}`, {
      method: "DELETE",
    });
  }

  // Admin Analytics methods
  async getUserAnalytics(): Promise<UserAnalytics> {
    return this.request<UserAnalytics>("/admin/analytics/users");
  }

  // Admin System Settings methods
  async getSystemSettings(): Promise<SystemSettings[]> {
    return this.request<SystemSettings[]>("/admin/system/settings");
  }

  async updateSystemSettings(
    category: string,
    settings: Record<string, unknown>
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      `/admin/system/settings/${category}`,
      {
        method: "PUT",
        body: JSON.stringify(settings),
      }
    );
  }

  // Admin Profile Management methods
  async getAdminProfile(): Promise<AdminProfile> {
    return this.request<AdminProfile>("/admin/profile");
  }

  async updateAdminProfile(
    profileData: AdminProfileUpdate
  ): Promise<AdminProfile> {
    return this.request<AdminProfile>("/admin/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  async changeAdminPassword(
    passwordData: PasswordChangeRequest
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>("/admin/profile/password", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    });
  }

  // Admin Preferences methods
  async getAdminPreferences(): Promise<AdminPreferences> {
    return this.request<AdminPreferences>("/admin/preferences");
  }

  async updateAdminPreferences(
    preferences: AdminPreferences
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>("/admin/preferences", {
      method: "PUT",
      body: JSON.stringify(preferences),
    });
  }

  // Admin Settings methods (by category)
  async getAdminSettings(category: string): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>(`/admin/settings/${category}`);
  }

  async updateAdminSettings(
    category: string,
    settings: Record<string, unknown>
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/settings/${category}`, {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  }

  // Admin Analytics methods
  async getAnalyticsPerformance(
    timeRange: string
  ): Promise<AnalyticsPerformance> {
    return this.request<AnalyticsPerformance>(
      `/admin/analytics/performance?timeRange=${timeRange}`
    );
  }

  async getAnalyticsTrends(
    metric: string,
    timeRange: string
  ): Promise<AnalyticsTrends> {
    return this.request<AnalyticsTrends>(
      `/admin/analytics/trends?metric=${metric}&timeRange=${timeRange}`
    );
  }

  // Helper method to check if user has admin role
  async checkAdminRole(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return (
        user &&
        ["admin", "super_admin"].includes(
          (user as User & { role?: string }).role || "student"
        )
      );
    } catch {
      return false;
    }
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("access_token");
};

// Helper function to get stored token
export const getStoredToken = (): string | null => {
  return localStorage.getItem("access_token");
};
