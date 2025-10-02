# Admin Panel Development Plan

This document outlines the development plan for the Artori admin panel, a tool for managing users, exams, and questions.

## 1. Project Setup

- **Initialize React App:** Use Vite with the React-TS template.
- **Install Dependencies:**
  - `react-router-dom` for routing.
  - `tailwindcss` for styling.
  - `shadcn/ui` for UI components.
  - `axios` for API requests.
- **Project Structure:**
  - `src/components`: Reusable UI components.
  - `src/pages`: Top-level page components.
  - `src/lib`: API client and utility functions.
  - `src/hooks`: Custom React hooks.

## 2. Core Components

- **Sidebar/Navigation:** For navigating between different sections of the admin panel.
- **Data Table:** A reusable component for displaying and managing data (users, exams, questions).
- **Forms:** For creating and editing data.
- **Authentication:** A login page and logic for handling user authentication.

## 3. Pages and Features

### 3.1. Dashboard

- **Overview:** Display key statistics (e.g., number of users, exams, questions).
- **Recent Activity:** Show a log of recent admin activities.

### 3.2. User Management

- **User List:** A table displaying all users with search and filter functionality.
- **User Details:** A page to view and edit user information.
- **Create User:** A form for adding new users.

### 3.3. Exam Management

- **Exam List:** A table of all exams with search and filter options.
- **Exam Details:** A page to view and edit exam details.
- **Create Exam:** A form for creating new exams.

### 3.4. Question Management

- **Question List:** A table of all questions with search and filter capabilities.
- **Question Details:** A page to view and edit question details.
- **Create Question:** A form for adding new questions.

## 4. API Integration

- **API Client:** Create a centralized API client using `axios` to handle all communication with the backend.
- **Endpoints:**
  - `GET /users`, `GET /users/:id`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`
  - `GET /exams`, `GET /exams/:id`, `POST /exams`, `PUT /exams/:id`, `DELETE /exams/:id`
  - `GET /questions`, `GET /questions/:id`, `POST /questions`, `PUT /questions/:id`, `DELETE /questions/:id`

## 5. Development Roadmap

1.  **Phase 1: Setup and UI Foundation (1-2 days)**

    - Initialize the project and install dependencies.
    - Set up the basic project structure.
    - Implement the main layout with a sidebar.
    - Create a reusable data table component.

2.  **Phase 2: User Management (2-3 days)**

    - Implement the user management page.
    - Integrate with the user API endpoints.
    - Create forms for adding and editing users.

3.  **Phase 3: Exam and Question Management (3-4 days)**

    - Implement the exam and question management pages.
    - Integrate with the exam and question API endpoints.
    - Create forms for adding and editing exams and questions.

4.  **Phase 4: Dashboard and Authentication (2-3 days)**

    - Implement the dashboard page with key statistics.
    - Add a login page and authentication logic.
    - Secure the admin panel with protected routes.

5.  **Phase 5: Final Touches and Deployment (1-2 days)**
    - Refine the UI and improve user experience.
    - Perform testing and bug fixing.
    - Deploy the admin panel.
