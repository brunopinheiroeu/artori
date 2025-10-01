const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

// Types matching backend models
export interface User {
  id: string;
  name: string;
  email: string;
  selected_exam_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
}

export interface Exam {
  id: string;
  name: string;
  country: string;
  description: string;
  subjects?: Subject[];
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

// API Client class
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

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
