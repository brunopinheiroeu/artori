# Admin Panel Plan

## 1. Overview

This document outlines the plan for creating a new admin panel for the Artori application. The admin panel will be a separate frontend application hosted at `admin.artori.app`. It will provide administrative functionalities for managing exams, users, and other application content.

## 2. Features and Functionality

### 2.1. Exam Management

- **CRUD Operations for Exams:**

  - **Create:** Add new exams with details such as name, country, description, subjects, and styling information (gradient, borderColor, bgColor, flag).
  - **Read:** View a list of all exams with their metadata.
  - **Update:** Modify the details of existing exams.
  - **Delete:** Remove exams from the application.

- **CRUD Operations for Exam Subjects:**

  - **Create:** Add new subjects to an exam, including name, description, total questions, duration, and icon.
  - **Read:** View the list of subjects for a specific exam.
  - **Update:** Modify the details of existing subjects.
  - **Delete:** Remove subjects from an exam.

- **CRUD Operations for Questions:**
  - **Create:** Add new questions to a subject, including the question text, options, correct answer, and explanation.
  - **Read:** View all questions for a specific subject.
  - **Update:** Modify existing questions.
  - **Delete:** Remove questions from a subject.

### 2.2. User Management

- **CRUD Operations for Users:**

  - **Create:** Add new users (teachers, students) with their details (name, email, role).
  - **Read:** View a list of all users with their roles and other relevant information.
  - **Update:** Modify user details, including their role.
  - **Delete:** Remove users from the application.

- **View User Progress:**
  - View detailed statistics for each user, including overall progress, questions solved, accuracy rate, and study time.
  - View progress broken down by subject.

## 3. API Endpoints

### 3.1. Exam Management

- **`GET /api/v1/admin/exams`**: Fetches a list of all exams.
- **`POST /api/v1/admin/exams`**: Creates a new exam.
- **`GET /api/v1/admin/exams/{exam_id}`**: Fetches the details of a specific exam.
- **`PUT /api/v1/admin/exams/{exam_id}`**: Updates the details of a specific exam.
- **`DELETE /api/v1/admin/exams/{exam_id}`**: Deletes a specific exam.

### 3.2. Subject Management

- **`GET /api/v1/admin/exams/{exam_id}/subjects`**: Fetches all subjects for a specific exam.
- **`POST /api/v1/admin/exams/{exam_id}/subjects`**: Creates a new subject for a specific exam.
- **`GET /api/v1/admin/subjects/{subject_id}`**: Fetches the details of a specific subject.
- **`PUT /api/v1/admin/subjects/{subject_id}`**: Updates the details of a specific subject.
- **`DELETE /api/v1/admin/subjects/{subject_id}`**: Deletes a specific subject.

### 3.3. Question Management

- **`GET /api/v1/admin/subjects/{subject_id}/questions`**: Fetches all questions for a specific subject.
- **`POST /api/v1/admin/subjects/{subject_id}/questions`**: Creates a new question for a specific subject.
- **`GET /api/v1/admin/questions/{question_id}`**: Fetches the details of a specific question.
- **`PUT /api/v1/admin/questions/{question_id}`**: Updates the details of a specific question.
- **`DELETE /api/v1/admin/questions/{question_id}`**: Deletes a specific question.

### 3.4. User Management

- **`GET /api/v1/admin/users`**: Fetches a list of all users.
- **`POST /api/v1/admin/users`**: Creates a new user.
- **`GET /api/v1/admin/users/{user_id}`**: Fetches the details of a specific user.
- **`PUT /api/v1/admin/users/{user_id}`**: Updates the details of a specific user.
- **`DELETE /api/v1/admin/users/{user_id}`**: Deletes a specific user.
- **`GET /api/v1/admin/users/{user_id}/progress`**: Fetches the progress of a specific user.

## 4. Page Structure and Layout

The admin panel will have a sidebar navigation layout.

- **Dashboard:** The main landing page after login, showing key statistics and quick links.
- **Exams:**
  - A table listing all exams.
  - A page to create a new exam.
  - A page to view and edit an existing exam, with tabs for subjects and questions.
- **Users:**
  - A table listing all users.
  - A page to create a new user.
  - A page to view and edit an existing user, with a section to view their progress.

## 5. User Roles and Permissions

- **Admin:**
  - Can perform all CRUD operations on exams, subjects, questions, and users.
  - Can view user progress.
- **Teacher:**
  - Can view all exams, subjects, and questions.
  - Can view the progress of their assigned students.
  - Cannot create, update, or delete any content.

## 6. Technical Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Deployment:** Vercel, hosted at `admin.artori.app`
