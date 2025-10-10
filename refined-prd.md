# **Product Requirements Document: Artori v1.0**

---

# **📄 Comprehensive EdTech Platform: AI Exam Prep, Tutor Marketplace, and Institutional Management**

---

## **1. Product Vision & Strategy**

### **1.1. Vision**

To become the leading comprehensive EdTech platform that empowers students, tutors, and educational institutions with a synergistic ecosystem of AI-driven tools, a thriving tutor marketplace, and powerful administrative controls. We aim to provide a responsible, effective, and personalized learning experience for all users.

### **1.2. Problem Statement**

Students worldwide face high-stakes exams with inadequate and impersonal tools. Tutors lack a dedicated platform to connect with students and manage their business. Educational institutions struggle to integrate effective EdTech solutions that provide meaningful oversight and analytics. The current market is fragmented, with separate solutions for AI tutoring, tutor marketplaces, and learning management, creating a disjointed experience for all stakeholders.

### **1.3. Goal**

Our goal is to build a unified platform that addresses the needs of all key users:

- **For Students:** An AI-powered exam coach that provides personalized learning paths, detailed analytics, and access to a marketplace of qualified tutors.
- **For Tutors:** A full-featured marketplace to build their brand, connect with students, manage scheduling and payments, and grow their business.
- **For Institutions & Admins:** A powerful administrative panel to manage users, oversee academic progress, and gain insights into the learning process.

---

## **2. Target Users & Roles**

- **Students:** Preparing for major exams (e.g., ENEM, SAT, BAC, A-levels) and seeking both AI-driven practice and human-led tutoring.
- **Tutors:** Professional educators seeking to offer their services, manage their schedules, and connect with a global student base.
- **Teachers/Schools (B2B):** K-12 and higher education institutions looking for a white-label solution to supplement their curriculum with AI tools and tutor support.
- **Administrators:** System managers responsible for user management, content oversight, platform analytics, and system health.
- **Super Admins:** Top-level administrators with full system control and access to all platform functionalities.

---

## **3. Market Landscape & Differentiation**

### **3.1. Market Analysis**

The global EdTech market is rapidly expanding, with significant growth in AI-powered learning and online tutoring. However, few platforms successfully integrate these components with robust administrative tools for institutional clients.

### **3.2. Competitive Advantage**

Our key differentiators are:

- **Integrated Ecosystem:** A seamless experience combining AI practice, a tutor marketplace, and administrative oversight in a single platform.
- **Multi-Role Architecture:** A sophisticated role-based access control system that caters to the specific needs of students, tutors, and various administrative levels.
- **Responsible AI Implementation:** Concrete features that promote transparency, fairness, and critical thinking, embedded directly into our data models.
- **Comprehensive Admin Panel:** Advanced tools for user management, content moderation, and data analytics that surpass competitor offerings.

---

## **4. Product Features**

### **4.1. Core Platform Features**

- **Multi-Role Authentication System:** Secure, JWT-based authentication with distinct roles: Student, Tutor, Teacher, Admin, and Super Admin.
- **Multi-Dashboard Architecture:** Separate, tailored dashboard experiences for each user role, providing relevant data and tools.

### **4.2. Student-Facing Features**

- **AI-Powered Exam Preparation:**
  - Full CRUD for exams, subjects, and questions with localized exam packs.
  - AI-generated questions with detailed explanations, including reasoning, concepts, and sources.
- **Tutor Marketplace:**
  - Advanced search and filtering to discover tutors by subject, price, availability, and more.
  - Detailed tutor profiles with bios, qualifications, ratings, and scheduling information.
  - Direct booking and communication functionalities.
- **Advanced Progress Tracking:**
  - Comprehensive analytics on exam and subject performance, including accuracy rates and study time.
  - Personalized study recommendations based on performance data.

### **4.3. Tutor-Facing Features**

- **Tutor Marketplace Profile:**
  - Full control over profile details, including subjects, qualifications, bio, availability, and hourly rates.
- **Session and Student Management:**
  - Tools to manage schedule, accept bookings, and communicate with students.

### **4.4. Admin-Facing Features**

- **Comprehensive Admin Panel:**
  - **Dashboard:** High-level statistics on user activity, exam performance, and platform health.
  - **User Management:** Full CRUD capabilities for all user roles.
  - **Content Management:** Full CRUD for exams, subjects, and questions.
  - **System Analytics:** Detailed reporting on platform usage and user engagement.

### **4.5. Responsible AI Implementation**

Our commitment to responsible AI is reflected in our data models:

- **Explainability:** The `questions` schema includes fields for `reasoning`, `concept`, and `sources` to ensure every AI-generated answer is transparent.
- **Bias and Fairness:** A `bias_check` field in the `questions` schema allows for auditing and flagging potentially biased content.
- **Human-in-the-Loop:** A `reflection` field encourages students to think critically about the AI's answer, promoting deeper learning.

---

## **5. Monetization Strategy**

- **Student Subscriptions (Freemium Model):**
  - **Free Tier:** Limited access to AI questions and features.
  - **Premium Tier:** Unlimited access to all exam packs, advanced analytics, and personalized study plans.
- **Tutor Marketplace Fees:**
  - **Commission-Based Model:** A percentage fee (e.g., 15-20%) is charged on all successful tutoring sessions booked through the platform.
  - **Listing Fees:** Optional premium listings for tutors who want increased visibility.
- **Institutional Licensing (B2B):**
  - Per-student, per-year licensing fees for schools and other institutions.
  - Tiered pricing based on the level of administrative control and analytics required.

---

## **6. Roadmap & Current Status**

- **v1.0 (Current Implementation):**
  - **Core Platform:** Multi-role authentication, multi-dashboard architecture.
  - **AI Exam Coach:** Full exam and question management, AI-powered explanations, and progress tracking.
  - **Tutor Marketplace:** Fully functional student-facing discovery and booking, with foundational tutor profiles.
  - **Admin Panel:** Comprehensive user and content management, dashboard analytics.
- **v1.5 (Next Steps):**
  - Full B2B plug-in for schools with teacher dashboards and collaboration tools.
  - Enhanced tutor-side management tools (e.g., earnings reports, student management).
  - Payment integration for tutor marketplace.
- **v2.0 (Future):**
  - Expansion into new exam types (e.g., professional certifications, language tests).
  - Advanced institutional analytics and cross-school benchmarking.

---

## **7. Success Metrics**

### **7.1. Student Success**

- **Engagement:** Daily Active Users (DAU), average study session length.
- **Performance:** Baseline score improvement after one month of use.
- **Satisfaction:** Net Promoter Score (NPS) > 50.

### **7.2. Tutor Marketplace Success**

- **Tutor Acquisition:** Number of active tutors on the platform.
- **Marketplace Liquidity:** Percentage of tutors with at least one booked session per month.
- **Gross Marketplace Volume (GMV):** Total value of all transactions processed through the platform.

### **7.3. Institutional Success**

- **Adoption:** Number of partner schools and active institutional users.
- **Engagement:** Teacher and admin dashboard usage rates.
