# Project Blueprint: Artori AI-Powered Exam Prep & Tutor Marketplace

## 1. High-Level Architectural Decisions

### 1.1. Architecture Pattern Selection

- **Decision:** Modular Monolith
- **Rationale:** For a solo developer or a small team, a modular monolith offers the best balance of development speed and operational simplicity. It avoids the complexities of a microservices architecture (e.g., network latency, distributed transactions, complex deployments) while still allowing for a clean separation of concerns through well-defined module boundaries. This structure will enable rapid, iterative development.

### 1.2. Technology Stack Selection

- **Frontend Framework:** Next.js (~15.4)
  - **Rationale:** Next.js provides a powerful React framework with server-side rendering, static site generation, and an intuitive App Router for improved data fetching and layouts. Its performance and developer experience are ideal for this project.
- **UI Components:** shadcn/ui (~0.9.5)
  - **Rationale:** shadcn/ui offers unstyled, accessible components that are highly customizable, allowing for rapid UI development that aligns with the project's visual identity without being locked into a specific design system.
- **Backend Runtime:** Python (~3.12)
  - **Rationale:** Python's readability, extensive libraries (especially for AI/ML), and strong community support make it a solid foundation for the backend.
- **Backend Framework:** FastAPI (~0.116.1)
  - **Rationale:** FastAPI is a high-performance Python framework that simplifies the creation of robust APIs. Its automatic interactive documentation (Swagger UI) and Pydantic-based data validation will significantly accelerate backend development.
- **Primary Database:** MongoDB Atlas (Free Tier)
  - **Rationale:** A NoSQL document database like MongoDB provides the flexibility needed for an agile project with evolving data models. It maps naturally to Python and JavaScript objects, simplifying data access. The free tier is sufficient for development and early-stage production.

### 1.3. Core Infrastructure & Services (Local Development)

- **Local Development:** The project will be run using simple command-line instructions (`npm run dev` for frontend, `uvicorn main:app --reload` for backend). No containerization is needed for local setup.
- **File Storage:** A local file system storage will be used for file uploads (e.g., profile pictures). A git-ignored `./uploads` directory will be created at the root of the backend project.
- **Authentication:** A library-based approach with JWTs (JSON Web Tokens) will be used for securing APIs. This is a lightweight and standard method for a monolithic application.
- **External Services:** OpenAI/Claude/Gemini (for AI features).

### 1.4. Integration and API Strategy

- **API Style:** REST. All APIs will be versioned from the start (e.g., `/api/v1/...`).
- **Standard Formats:** A standard JSON structure will be used for success and error responses.

## 2. Detailed Module Architecture

### 2.1. Module Identification

- **UserModule:** Manages user data, profiles, and roles (Student, Tutor, Admin, Super Admin).
- **AuthModule:** Handles user registration, login, password management, and JWT generation/validation.
- **ExamModule:** Manages AI-powered exam generation, practice sessions, question bank, and progress tracking.
- **TutorModule:** Manages tutor profiles, availability, subjects, and marketplace listings.
- **AdminModule:** Provides functionality for admins to manage users, content, and view analytics.
- **SharedModule:** Contains shared utilities, UI components, and type definitions.

### 2.2. Module Responsibilities and Contracts

- **UserModule:**
  - **Responsibilities:** CRUD operations for users, managing user profiles.
  - **Interface:** `userService.getUserById()`, `userService.updateUserProfile()`.
- **AuthModule:**
  - **Responsibilities:** User registration, login, logout, token management.
  - **Interface:** `authService.register()`, `authService.login()`.
- **ExamModule:**
  - **Responsibilities:** Generate exams, manage test sessions, track student progress.
  - **Interface:** `examService.createExam()`, `examService.getExamResults()`.
- **TutorModule:**
  - **Responsibilities:** Manage tutor profiles, search for tutors.
  - **Interface:** `tutorService.getTutorProfile()`, `tutorService.searchTutors()`.
- **AdminModule:**
  - **Responsibilities:** Manage users, view analytics.
  - **Interface:** `adminService.getAllUsers()`, `adminService.getAnalytics()`.

### 2.3. Key Module Design

- **Folder Structure:** Each module will have a dedicated folder containing its services, controllers, and types (e.g., `backend/modules/user/`).
- **Key Patterns:** The Repository Pattern will be used for data access to abstract the database logic.

## 3. Tactical Sprint-by-Sprint Plan

### Sprint S0: Project Foundation & Setup

- **Goal:** Establish a fully configured, runnable project skeleton.
- **Tasks:**
  1.  **Developer Onboarding & Repository Setup:** Get the GitHub repository URL.
  2.  **Collect Secrets & Configuration:** Get MongoDB connection string, API keys, and UI theme colors.
  3.  **Project Scaffolding:** Create a monorepo with `frontend` and `backend` directories.
  4.  **Backend Setup (Python/FastAPI):** Set up virtual environment, install dependencies, create basic file structure, and configure `.env`.
  5.  **Frontend Setup (Next.js & shadcn/ui):** Scaffold the app, initialize shadcn/ui, and configure `tailwind.config.js`.
  6.  **Documentation:** Create a root `README.md` with setup instructions.
  7.  **"Hello World" Verification:** Create a `/api/v1/health` endpoint and a frontend page to display the status.
  8.  **Final Commit:** Push the initial project structure to the main branch.

### Sprint S1: User Authentication & Profiles

- **Goal:** Implement a complete user registration and login system with JWTs.
- **Tasks:**
  1.  **Database Model:** Define the `User` model.
  2.  **Backend: Registration Logic:** Implement the `POST /api/v1/auth/register` endpoint.
  3.  **Backend: Login Logic:** Implement the `POST /api/v1/auth/login` endpoint.
  4.  **Backend: Protected Route:** Create a protected `GET /api/v1/users/me` endpoint.
  5.  **Frontend: UI Pages:** Build login, register, and profile pages.
  6.  **Frontend: State & API Integration:** Implement client-side forms, state management, and protected routes.
  7.  **Final Commit:** Push the completed feature to the main branch.

### Sprint S2: AI-Powered Exam Generation & Practice

- **Goal:** Implement the core AI exam generation and practice session functionality.
- **Tasks:**
  1.  **Database Models:** Define `Exam`, `Question`, and `TestSession` models.
  2.  **Backend: Exam Generation:** Implement `POST /api/v1/exams` to generate an exam using an AI service.
  3.  **Backend: Practice Session:** Implement endpoints to start, manage, and submit a practice session.
  4.  **Frontend: UI:** Build the UI for selecting exam topics, taking a practice test, and viewing results.
  5.  **Final Commit:** Push the completed feature to the main branch.

### Sprint S3: Tutor Marketplace & Profiles

- **Goal:** Implement the tutor marketplace and public tutor profiles.
- **Tasks:**
  1.  **Database Model:** Extend the `User` model for tutors (e.g., subjects, bio, availability).
  2.  **Backend:** Implement endpoints to update tutor profiles and search for tutors.
  3.  **Frontend:** Build the UI for the tutor search/marketplace page and individual tutor profile pages.
  4.  **Final Commit:** Push the completed feature to the main branch.

### Sprint S4: Student-Tutor Interaction & Scheduling

- **Goal:** Enable students to connect with tutors and schedule sessions.
- **Tasks:**
  1.  **Database Models:** Define `Booking` and `Message` models.
  2.  **Backend:** Implement endpoints for booking sessions and sending messages.
  3.  **Frontend:** Build the UI for tutor availability calendars, booking forms, and a messaging interface.
  4.  **Final Commit:** Push the completed feature to the main branch.

### Sprint S5: Admin Panel - User & Content Management

- **Goal:** Create an admin panel for managing users and platform content.
- **Tasks:**
  1.  **Backend:** Implement protected admin endpoints for CRUD operations on users and other content.
  2.  **Frontend:** Build an admin dashboard with tables and forms for managing data.
  3.  **Final Commit:** Push the completed feature to the main branch.

### Sprint S6: Super Admin Panel - Platform Analytics & Settings

- **Goal:** Create a super admin panel for platform-wide analytics and settings.
- **Tasks:**
  1.  **Backend:** Implement protected super admin endpoints for fetching analytics data and managing platform settings.
  2.  **Frontend:** Build a super admin dashboard with charts and forms for analytics and settings.
  3.  **Final Commit:** Push the completed feature to the main branch.
