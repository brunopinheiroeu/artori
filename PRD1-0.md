# **AI PRD**

---

# **📄 AI Exam Coach (Standalone + School Plug-in, Responsible AI Upgrade)**

---

## **1. Problem Statement & Goals**

**Problem**

Students worldwide face high-stakes exams (ENEM, SAT/ACT, BAC, A-levels) but current tools:

- Don’t adapt to individual learning gaps.
- Risk misinformation or shallow learning.
- Don’t integrate with teacher guidance, raising skepticism.

Educators worry that AI tutoring may undermine **deep learning, academic integrity, and critical thinking**.

**Goal**

Build an **AI-powered exam coach** that is:

- **Standalone (B2C)** → global student platform with localized exam packs.
- **Plug-in (B2B)** → white-label integration for schools, combining AI + teacher dashboards.

👉 _We know students are already using AI to study — our mission is to give them an incredible tool to do it right._

And critically: designed to meet **skeptics’ concerns** with **responsible AI features** that promote **reflection, explainability, and teacher collaboration**.

---

## **2. Target Users**

- **Students (Standalone)** → Anyone prepping for ENEM, SAT, BAC, A-levels.
- **Schools/Teachers (Plug-in)** → K-12 and prep institutions.
- **Parents (Secondary Stakeholders)** → Gain transparency into study progress and AI reliability.

---

## **3. Market Research & Positioning**

- The **global EdTech market** is projected to reach **$404B by 2025** (HolonIQ, _Global Education Outlook 2025_).
- AI tutoring is one of the fastest-growing subsegments, driven by accessibility and personalization.
- Skepticism remains high among educators who fear **bias, misinformation, and loss of critical thinking**.

**Competitor Analysis**

| **Competitor**   | **Offering**                  | **Strengths**                | **Weaknesses**                        |
| ---------------- | ----------------------------- | ---------------------------- | ------------------------------------- |
| **Quizlet**      | Flashcards & practice         | Popular, global reach        | Limited personalization, no grounding |
| **Century Tech** | Adaptive learning for schools | Strong UK school presence    | Narrow regional focus                 |
| **Studley**      | AI mock exams                 | Adaptive testing             | Weak educator integration             |
| **ExamAI**       | General AI prep               | Broad subject coverage       | No localized exam packs               |
| **Mindgrasp**    | AI reading/explainer          | Summarization, comprehension | Limited exam prep focus               |

**Differentiation**

- **Exam packs** for localized needs (Brazil: ENEM, US: SAT/ACT, France: BAC, UK: A-levels).
- **Bias-aware, explainable AI** (not a black box).
- **Human-in-the-loop design** → dashboards for teachers, transparency for parents.
- **Interactive journeys** that emphasize process (not just answers).

---

## **4. Product Features**

### **Student (Standalone Platform)**

- **Adaptive Exam Packs** → localized (ENEM, SAT, BAC, A-levels).
- **Explainable AI Answers** → shows reasoning steps + sources.
- **Bias Detection Layer** → highlights possible bias in reasoning/data.
- **Reflection Activities** → open-ended prompts, not only multiple-choice.
- **Study Journeys** → tracks the _process_ (problem-solving steps) as much as the outcome.

### **Educator (School Plug-in)**

- **Teacher Dashboards** → class heatmaps, alerts, AI-generated intervention suggestions.
- **Collaboration Mode** → teachers can annotate AI explanations, add cultural/ethical context.
- **Ethical Tracing** → citations + attribution for AI answers to minimize plagiarism.
- **Parent Reports** → progress + explanation transparency for accountability.

### **Integration & Access**

- **Standalone Global Platform** → direct to students, subscription model.
- **Plug-in Module** → LMS integration via API/SDK, white-label option.

---

## **5. Responsible AI Principles (from PRO vs CON debate)**

1. **Bias Transparency** → Explanations highlight where bias could exist.
2. **Promoting Independent Thinking** → Reflection tasks, open-ended exploration.
3. **Ethical Tracing** → Sources, attribution, plagiarism safeguards.
4. **Teacher Collaboration** → Dashboards + annotation features.
5. **Interactive Journeys** → Process-driven learning, not rote shortcuts.
6. **Explainable AI** → Every answer comes with reasoning + links to principles.

---

## **6. AI/Tech Stack**

- **Core Tutor Engine** → Fine-tuned LLM with retrieval-augmented generation (RAG) on past exams + textbooks.
- **Adaptive Module** → Multi-armed bandits for practice optimization.
- **Bias Detection Layer** → Pattern analysis + flagged explanations.
- **Explainability Engine** → Chain-of-thought → simplified reasoning trace.
- **Educator Dashboard** → Analytics via clustering & visualization.
- **Infrastructure** → Python/FastAPI backend, Next.js frontend, AWS/GCP hosting, GDPR/FERPA compliance.

---

## **7. Monetization**

- **Standalone (Students)** → Freemium (daily free Qs) + Premium (exam packs, analytics).
- Standalone (tutor) → Tutor can receive money booking coaching classes and we get a part of it
- **Plug-in (Schools)** → Per-student annual license, optional parent-facing add-ons.

---

## **8. Roadmap**

- **v1** → Standalone (ENEM, SAT, BAC, A-levels) + Responsible AI features (explainability, bias detection).
- **v1.5** → Plug-in for schools with teacher dashboards & collaboration tools.
- v2 → tutor platform: tutor can sell coaching services and charge by hour.
- **v3** → Expansion into residency, public service, driving, language exams.
- **v4** → Cross-school benchmarking, institutional analytics.

---

## **9. Risks & Mitigations**

- **Hallucinations** → Mitigation: RAG + verified exam databases.
- **Educator skepticism** → Mitigation: Responsible AI design, teacher dashboards.
- **Over-reliance on AI** → Mitigation: Reflection activities, open-ended questions.
- **Adoption friction** → Mitigation: Freemium entry for students, white-label plug-in for schools.

---

## **10. Success Metrics**

- ↑ Student performance (+15% baseline improvement).
- ↑ School adoption (X partner schools, Y plug-in integrations).
- ↑ Teacher engagement (dashboard use rates).
- ↑ Parent satisfaction (survey > 80% trust).
- ↓ Drop-off rates.
- NPS > 50 (students + schools).
