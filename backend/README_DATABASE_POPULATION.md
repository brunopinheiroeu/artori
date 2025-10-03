# Database Population Script

This comprehensive database population script generates realistic test data for the Artori admin panel, creating a complete testing environment with 4 exams, 400 questions, 8 student accounts, and realistic usage data.

## Overview

The script creates:

- **4 Exams**: SAT, ENEM, Leaving Certificate, and Selectividad
- **400 Questions**: 100 questions per exam, distributed across subjects
- **8 Student Accounts**: 2 per exam (1 excellent performer, 1 average performer)
- **Realistic Progress Data**: User answers and progress tracking
- **Analytics Data**: Supporting metrics for admin dashboard

## Generated Data Structure

### Exams and Subjects

1. **SAT (USA)** 🇺🇸

   - Math (33 questions)
   - Reading (34 questions)
   - Writing (33 questions)

2. **ENEM (Brazil)** 🇧🇷

   - Mathematics (25 questions)
   - Portuguese (25 questions)
   - Sciences (25 questions)
   - Social Studies (25 questions)

3. **Leaving Certificate (Ireland)** 🇮🇪

   - Mathematics (33 questions)
   - English (34 questions)
   - Sciences (33 questions)

4. **Selectividad (Spain)** 🇪🇸
   - Mathematics (25 questions)
   - Spanish (25 questions)
   - Sciences (25 questions)
   - History (25 questions)

### Student Test Accounts

Each exam has 2 test student accounts:

| Exam                | Excellent Student                 | Average Student                 |
| ------------------- | --------------------------------- | ------------------------------- |
| SAT                 | `sat_student_excellent@test.com`  | `sat_student_average@test.com`  |
| ENEM                | `enem_student_excellent@test.com` | `enem_student_average@test.com` |
| Leaving Certificate | `lc_student_excellent@test.com`   | `lc_student_average@test.com`   |
| Selectividad        | `sel_student_excellent@test.com`  | `sel_student_average@test.com`  |

**Password for all test accounts**: `TestPass123!`

### Performance Profiles

- **Excellent Students**: 90-93% accuracy rate, answer 60-80% of questions
- **Average Students**: 68-71% accuracy rate, answer 50-80% of questions

## Usage

### Prerequisites

1. Ensure MongoDB connection is configured in `.env`
2. Virtual environment is activated
3. Required dependencies are installed

### Running the Script

```bash
cd backend
source venv/bin/activate
python populate_database.py
```

### What the Script Does

1. **Clears existing test data** - Removes previous test users, questions, and related data
2. **Creates exam structures** - Sets up 4 exams with their subjects
3. **Generates 400 questions** - Creates realistic, exam-appropriate questions
4. **Creates student accounts** - 8 test users with realistic profiles
5. **Generates usage data** - Simulates realistic study patterns over weeks
6. **Creates analytics data** - Populates metrics for admin dashboard

### Sample Output

```
🚀 Starting comprehensive database population...
🧹 Clearing existing test data...
✅ Test data cleared successfully
📚 Creating exam structures...
✅ Created 4 exam structures
❓ Generating 400 realistic questions...
✅ Generated and inserted 400 questions
👥 Creating 8 student test accounts...
✅ Created 8 student accounts
📊 Generating realistic user progress and answer data...
✅ Generated 513 user answers
✅ Generated 28 progress records
📈 Creating supporting analytics data...
✅ Created 60 analytics metrics
✅ Created 60 time series data points

==================================================
📋 DATABASE POPULATION SUMMARY
==================================================
📚 Exams created: 4
❓ Questions created: 400
👥 Student accounts: 8
✅ User answers: 523
📊 Progress records: 29
📈 Analytics metrics: 68

📊 Questions per exam:
  SAT: 100 questions
  ENEM: 100 questions
  Leaving Certificate: 100 questions
  Selectividad: 100 questions

👥 Student accounts per exam:
  SAT: 2 students
  ENEM: 2 students
  Leaving Certificate: 2 students
  Selectividad: 2 students
==================================================
🎉 Database population completed successfully!
```

## Question Quality

Each question includes:

- **Realistic content** appropriate for the exam type
- **4 multiple choice options** (A, B, C, D)
- **Correct answer** specified
- **Detailed explanations** with reasoning, concepts, and sources
- **Difficulty levels** (easy, medium, hard) evenly distributed
- **Relevant tags** for categorization
- **Appropriate duration** for each question type

## Realistic Usage Patterns

The script generates:

- **Varied timestamps** spread over several weeks
- **Realistic accuracy rates** based on student performance level
- **Progressive learning** patterns showing improvement over time
- **Subject-specific progress** tracking
- **Activity logs** for admin analytics

## Database Collections Populated

- `exams` - Exam structures with subjects
- `questions` - 400 realistic questions
- `users` - 8 student test accounts
- `user_answers` - Realistic answer history
- `user_progress` - Progress tracking per subject
- `analytics_metrics` - System performance data
- `time_series_data` - Trending analytics data

## Testing the Admin Panel

After running the script, you can:

1. **Login as test students** using the provided credentials
2. **View realistic data** in the admin dashboard
3. **Test user management** features with populated users
4. **Analyze exam performance** with real usage data
5. **Explore analytics** with generated metrics

## Safety Features

- **Preserves admin users** - Only removes test student accounts
- **Clears previous test data** - Prevents data duplication
- **Validates connections** - Ensures database connectivity
- **Error handling** - Graceful failure with detailed logging
- **Transaction safety** - Maintains data integrity

## Customization

To modify the script:

1. **Adjust question counts** - Change the range in generation loops
2. **Add new exams** - Extend the exam structures
3. **Modify student profiles** - Update the student account data
4. **Change accuracy rates** - Adjust performance levels
5. **Add more subjects** - Extend subject definitions per exam

## Troubleshooting

### Common Issues

1. **MongoDB connection failed**

   - Check `.env` file has correct `MONGODB_URI`
   - Verify network connectivity to MongoDB

2. **Permission errors**

   - Ensure virtual environment is activated
   - Check file permissions in backend directory

3. **Import errors**
   - Install required dependencies: `pip install -r requirements.txt`
   - Verify Python version compatibility

### Logs and Debugging

The script provides detailed logging:

- Connection status
- Progress updates
- Error messages
- Final summary statistics

## Integration with Admin Panel

The populated data integrates seamlessly with:

- **User management** - View and manage test students
- **Exam administration** - Analyze question performance
- **Analytics dashboard** - Real metrics and trends
- **Progress tracking** - Student learning patterns
- **System monitoring** - Performance metrics

This script provides a complete testing environment for the admin panel, enabling comprehensive testing of all features with realistic, diverse data.
