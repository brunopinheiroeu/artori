# 1) Executive Summary

- This document outlines the backend development plan for Artee, an AI-powered exam preparation platform.
- The backend will be built with FastAPI and MongoDB Atlas, following a `main`-only Git workflow.
- The plan is divided into dynamic sprints to cover all frontend features.

# 2) In-scope & Success Criteria

- **In-scope:**
  - User authentication (signup, login, logout).
  - Fetching and displaying exam packs and subjects.
  - Storing and retrieving user progress.
  - Serving questions and explanations.
- **Success criteria:**
  - All frontend features are fully functional with the backend.
  - Each sprint passes manual UI testing.
  - Code is pushed to `main` after each successful sprint.

# 3) API Design

- **Conventions:**
  - Base path: `/api/v1`
  - Errors will return a consistent JSON object: `{ "detail": "Error message" }`
- **Endpoints:**
  - **Auth:**
    - `POST /api/v1/auth/signup`: Register a new user.
    - `POST /api/v1/auth/login`: Authenticate a user and return a JWT.
    - `POST /api/v1/auth/logout`: Invalidate a user's session (optional, can be handled client-side).
    - `GET /api/v1/auth/me`: Get the current authenticated user's details.
  - **Exams:**
    - `GET /api/v1/exams`: Get a list of all available exams.
    - `GET /api/v1/exams/{exam_id}`: Get details for a specific exam, including its subjects.
  - **Users:**
    - `POST /api/v1/users/me/exam`: Set the user's selected exam.
  - **Questions:**
    - `GET /api/v1/exams/{exam_id}/subjects/{subject_id}/questions`: Get questions for a specific subject.
    - `POST /api/v1/questions/{question_id}/answer`: Submit an answer for a question and get the result.
  - **Health Check:**
    - `GET /healthz`: Health check endpoint.

# 4) Data Model (MongoDB Atlas)

- **Collections:**
  - **users:**
    - `_id`: ObjectId
    - `name`: String, required
    - `email`: String, required, unique
    - `password`: String, required
    - `selected_exam_id`: ObjectId, optional
    - `created_at`: DateTime
    - `updated_at`: DateTime
    - _Example:_
      ````json
      {
        "_id": "60c72b9f9b1d8c001f8e4d2a",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "password": "hashed_password",
        "selected_exam_id": "60c72b9f9b1d8c001f8e4d2b",
        "created_at": "2025-01-15T10:00:00Z",
        "updated_at": "2025-01-15T10:00:00Z"
      }
      ```  - **exams:**
      ````
    - `_id`: ObjectId
    - `name`: String, required
    - `country`: String, required
    - `description`: String
    - `subjects`: Array of embedded subject documents
      - `_id`: ObjectId
      - `name`: String, required
      - `description`: String
    - _Example:_
      ```json
      {
        "_id": "60c72b9f9b1d8c001f8e4d2b",
        "name": "SAT",
        "country": "USA",
        "description": "Scholastic Assessment Test",
        "subjects": [
          {
            "_id": "60c72b9f9b1d8c001f8e4d2c",
            "name": "Evidence-Based Reading",
            "description": "..."
          },
          {
            "_id": "60c72b9f9b1d8c001f8e4d2d",
            "name": "Writing and Language",
            "description": "..."
          }
        ]
      }
      ```
  - **questions:**
    - `_id`: ObjectId
    - `subject_id`: ObjectId, required
    - `question`: String, required
    - `options`: Array of embedded option documents
      - `id`: String (e.g., "a", "b")
      - `text`: String
    - `correct_answer`: String (e.g., "c")
    - `explanation`: Embedded document
      - `reasoning`: Array of strings
      - `concept`: String
      - `sources`: Array of strings
      - `bias_check`: String
      - `reflection`: String
    - _Example:_
      ````json
      {
        "_id": "60c72b9f9b1d8c001f8e4d2e",
        "subject_id": "60c72b9f9b1d8c001f8e4d2c",
        "question": "If f(x) = 2x² + 3x - 1, what is f(2)?",
        "options": [
          { "id": "a", "text": "9" },
          { "id": "b", "text": "11" }
        ],
        "correct_answer": "c",
        "explanation": { ... }
      }
      ```  - **user_progress:**
      ````
    - `_id`: ObjectId
    - `user_id`: ObjectId, required
    - `subject_id`: ObjectId, required
    - `score`: Integer
    - `completed_questions`: Array of ObjectId references to questions
    - _Example:_
      ```json
      {
        "_id": "60c72b9f9b1d8c001f8e4d2f",
        "user_id": "60c72b9f9b1d8c001f8e4d2a",
        "subject_id": "60c72b9f9b1d8c001f8e4d2c",
        "score": 85,
        "completed_questions": ["60c72b9f9b1d8c001f8e4d2e"]
      }
      ```

# 5) Frontend Audit & Feature Map

- **`/` (Index):**
  - **Purpose:** Landing page, lists available exams.
  - **Backend:** `GET /api/v1/exams`
- **`/login` (Login):**
  - **Purpose:** User signup and login.
  - **Backend:** `POST /api/v1/auth/signup`, `POST /api/v1/auth/login`
- **`/practice` (Practice):**
  - **Purpose:** User dashboard, exam and subject selection.
  - **Backend:** `GET /api/v1/auth/me`, `POST /api/v1/users/me/exam`, `GET /api/v1/exams/{exam_id}`
- **`/question/{exam_id}/{subject_id}` (Question):**
  - **Purpose:** Display and answer questions.
  - **Backend:** `GET /api/v1/exams/{exam_id}/subjects/{subject_id}/questions`, `POST /api/v1/questions/{question_id}/answer`
- **`/solutions` (Solutions):**
  - **Purpose:** Information for schools.
  - **Backend:** No backend data needed for this page.

# 6) Configuration & ENV Vars (core only)

- `APP_ENV`: `development`
- `PORT`: `8000`
- `MONGODB_URI`: (To be provided by the user)
- `JWT_SECRET`: A strong secret key
- `JWT_EXPIRES_IN`: `3600` (1 hour)
- `CORS_ORIGINS`: Frontend URL (e.g., `http://localhost:5173`)

# 9) Testing Strategy (Manual via Frontend)

- **Policy:** All testing will be performed manually through the frontend UI.
- **Process:** After each sprint, the features will be tested against the manual test checklist. If all tests pass, the code will be committed and pushed to the `main` branch.

# 10) Dynamic Sprint Plan & Backlog (S0…Sn)

- **S0 - Environment Setup & Frontend Connection**

  - **Objectives:**
    - Create FastAPI skeleton with `/api/v1` and `/healthz`.
    - Connect to MongoDB Atlas.
    - Implement `/healthz` to check DB connectivity.
    - Enable CORS for the frontend.
    - Initialize Git and push to a new GitHub repository.
  - **Definition of Done:**
    - Backend runs locally.
    - `/healthz` returns a successful response including DB status.
    - Frontend can successfully call the backend.
  - **Manual Test Checklist (Frontend):**
    - Start the backend server.
    - Open the frontend and verify that data is being fetched from the backend (e.g., the list of exams on the homepage).
  - **User Test Prompt:**
    - "Please run the backend and frontend, and confirm that the exam list on the homepage is loaded from the API."
  - **Post-sprint:**
    - Commit and push to `main`.

- **S1 - Basic Auth (signup, login, logout)**

  - **Objectives:**
    - Implement signup, login, and logout functionality.
    - Protect the `/practice` route.
  - **Definition of Done:**
    - Users can create an account, log in, and log out.
    - Unauthorized users are redirected from `/practice` to `/login`.
  - **Manual Test Checklist (Frontend):**
    - Create a new user account.
    - Log out.
    - Log back in with the new credentials.
    - Access the `/practice` page.
    - Verify that unauthorized access to `/practice` is blocked.
  - **User Test Prompt:**
    - "Please test the signup and login flows. Ensure you can create an account, log out, log back in, and access the practice dashboard. Also, verify that you cannot access the dashboard without being logged in."
  - **Post-sprint:**
    - Commit and push to `main`.

- **S2 - Exam and Question Flow**
  - **Objectives:**
    - Implement the endpoints to fetch exams, subjects, and questions.
    - Implement the logic to submit answers and track user progress.
  - **Definition of Done:**
    - Users can select an exam and see the subjects.
    - Users can answer questions and see the explanations.
    - User scores are correctly calculated and stored.
  - **Manual Test Checklist (Frontend):**
    - Log in and select an exam.
    - Choose a subject and start a practice session.
    - Answer a few questions and verify that the explanations are displayed correctly.
    - Check if the score is updated.
  - **User Test Prompt:**
    - "Please log in, select an exam, and start a practice session. Answer a few questions and confirm that the flow works as expected and your score is tracked."
  - **Post-sprint:**
    - Commit and push to `main`.
