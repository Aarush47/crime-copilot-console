# Hackathon Project: Crime Copilot Console (Challenge 1)

## 1. Project Overview & Hackathon Context

**Challenge Selected:** Challenge 1 (Conversational AI)
**Core Objective:** Build a bilingual (English + Kannada) voice-enabled conversational AI agent for the Police FIR database.
**Target Audience:** Police Investigators and Judges who need analytical power (cross-referencing across 1100+ stations) with a strict paper trail (Explainable AI / audit trails) rather than a simple chatbot.
**Deployment Constraint:** Must be deployed exclusively on **Zoho Catalyst**.

## 2. Team Structure (5 BTech CS Students)

Given the team's strengths in coding, databases, AI, agents, and mapping (but lacking existing Kannada/voice expertise), roles should be divided as follows:

1. **Frontend / UX Engineer:** Next.js (TanStack Start), Tailwind, shadcn/ui, Framer Motion, Zustand. Responsible for the UI, coexistent panel UX, and map/network visualizations.
2. **Backend & AI Agent Engineer (1):** AppSail, Node/Python. Orchestrates the NL-to-SQL logic, schema-aware tool calling, and prompt engineering.
3. **Backend & Integrations Engineer (2):** Handles Bhashini API (Voice/Kannada translation) integration and Zoho Catalyst Functions/Zia Text Analytics.
4. **Database & Data Engineer:** Catalyst Data Store (ZCQL). Generates the synthetic FIR dataset matching the schema and handles query optimizations.
5. **Project Manager / Presentation Lead:** Manages the 16-slide template, documentation, architecture diagrams, cost estimates, and pitch narrative.

## 3. Technical Architecture (Zoho Catalyst Stack)

- **Data Store (ZCQL):** Relational store containing the synthetic FIR schema (based on the 9-page ER diagram: `CaseMaster`, `Victim`, `Accused`, `ComplainantDetails`, `ArrestSurrender`, `ActSectionAssociation`, plus lookup tables).
- **AppSail:** Hosts the agent backend (Node/Python) to allow for flexible, schema-aware tool-calling (circumventing the limitations of Catalyst's built-in ConvoKraft).
- **Zia QuickML / LLM Serving:** Serves models (like Qwen 2.5) or acts as a gateway for external APIs (Claude/GPT) via AppSail.
- **Zia Text Analytics:** Used for NER (Named Entity Recognition) and keyword extraction from free-text queries.
- **Functions:** Discrete backend logic (query execution, audit logging).
- **Slate:** Hosts the frontend.
- **Authentication:** Role-based secure access.

## 4. Key Differentiators & "Wow" Factors (The 10x Move)

1. **Genuine Schema-Aware Tool-Calling Agent:** Avoids hardcoding 10-15 sample Q&A pairs. The LLM decides which tables/joins to hit, executes against a read-only store, and returns results _along with the executed query_ to satisfy the "Explainable AI" and audit trail requirements.
2. **Bhashini API for Kannada & Voice:** Mitigates the team's lack of Kannada expertise. Flow: _Voice/Kannada Text -> Bhashini (Translate) -> English -> NL-to-SQL Agent -> English Answer -> Bhashini (Translate) -> Kannada Voice/Text out_. This is a strong pitch: "We used India's own language AI mission."
3. **Geospatial Map Integration:** Utilizes the `latitude`/`longitude` fields native to `CaseMaster` to render queries like "show me robbery cases in Whitefield last month" directly on a map.
4. **Criminal Network Visualization:** Graph traversal visualization of `Accused` <-> `ArrestSurrender` <-> `CaseMaster` <-> `ComplainantDetails`.
5. **Coexistent Panel UX:** High-end Next.js UI allowing the chat interface and the map/data visualizations to exist side-by-side without modal overlapping.

## 5. Development Roadmap & Next Steps

### Phase 1: Foundation (Week 1)

- Generate a realistic synthetic dataset mimicking the Police FIR schema.
- Seed Catalyst Data Store with the synthetic dataset.
- Initialize the Frontend (already done via Lovable: TanStack Start, Tailwind, shadcn, Framer Motion, Zustand).

### Phase 2: Core Agent & Integrations (Week 2)

- Build the Node/Python backend on AppSail.
- Implement the LLM tool-calling logic (NL-to-SQL).
- Integrate Bhashini API for translation and voice support.
- Develop Catalyst Functions for execution and audit logging.

### Phase 3: UI & Visualizations (Week 3)

- Connect frontend to backend APIs.
- Build the Geospatial Map component.
- Build the Criminal Network Graph component.
- Polish the Coexistent Panel UX.

### Phase 4: Finalization & Pitch (Week 4)

- Complete the 16-slide submission template:
  - Team details, solution brief, USP, features, process flow.
  - Wireframes, architecture diagram, tech stack, Catalyst services used.
  - Cost estimate, prototype snapshots, benchmarking.
  - Repo/demo/deploy links, future scope.
- Final testing on Zoho Catalyst Slate and AppSail.

---

_Note: This document is a consolidation of the strategic analysis provided prior to hitting the message limit, ensuring the team has a single source of truth moving forward._
