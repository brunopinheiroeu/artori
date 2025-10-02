# Proposed Schema and API Plan

This document outlines the proposed database schema changes and API endpoints required to make the frontend practice page fully dynamic.

## 1. Database Schema Changes

### `exams` Collection

The `exams` collection will be updated to include more metadata for rendering exam cards and dashboards.

```json
{
  "_id": "ObjectId",
  "name": "String",
  "country": "String",
  "description": "String",
  "subjects": [
    {
      "_id": "ObjectId",
      "name": "String",
      "description": "String",
      "total_questions": "Int",
      "duration": "String", // e.g., "65 minutes"
      "icon": "String" // e.g., "📖"
    }
  ],
  "total_questions": "Int",
  "gradient": "String", // e.g., "from-blue-500 to-red-500"
  "borderColor": "String", // e.g., "border-blue-500"
  "bgColor": "String", // e.g., "bg-blue-50"
  "flag": "String" // e.g., "🇺🇸"
}
```

### `user_progress` Collection

This collection will be redesigned to store more detailed user statistics for each exam and subject.

```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId", // ref: users
  "exam_id": "ObjectId", // ref: exams
  "overall_progress": "Float", // Percentage
  "questions_solved": "Int",
  "accuracy_rate": "Float", // Percentage
  "study_time_hours": "Float",
  "current_streak_days": "Int",
  "last_studied_date": "Date",
  "subject_progress": [
    {
      "subject_id": "ObjectId", // ref: exams.subjects
      "progress": "Float", // Percentage
      "questions_solved": "Int",
      "correct_answers": "Int",
      "accuracy_rate": "Float" // Percentage
    }
  ]
}
```

### `user_answers` Collection (New)

A new collection to track each answer submitted by the user. This allows for detailed analytics and features like "Smart Review."

```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId", // ref: users
  "question_id": "ObjectId", // ref: questions
  "selected_option_id": "String",
  "is_correct": "Boolean",
  "answered_at": "Date"
}
```

## 2. API Endpoints

### GET `/api/v1/exams`

- **Description:** Fetches a list of all available exams with their full metadata.
- **Response Body:** A list of exam objects matching the updated `exams` schema.

### GET `/api/v1/users/me/dashboard`

- **Description:** Fetches all the necessary data for the user's dashboard, based on their selected exam.
- **Response Body:**

```json
{
  "selected_exam": { ... }, // Full exam object
  "user_progress": { ... } // User progress object for the selected exam
}
```

### POST `/api/v1/questions/{question_id}/answer`

- **Description:** Submits a user's answer for a question. The backend will update the `user_answers` and `user_progress` collections.
- **Request Body:**

```json
{
  "answer": "String" // The selected option ID
}
```

- **Response Body:**

```json
{
  "correct": "Boolean",
  "correct_answer": "String",
  "explanation": { ... }
```
