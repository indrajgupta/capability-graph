# CapabilityGraph --- Product Requirements Document (PRD)

**Version:** 1.0\
**Status:** MVP / Hackathon Build\
**Product:** CapabilityGraph\
**Category:** AI-powered professional identity and capability graph

## 1. Executive Summary

CapabilityGraph transforms unstructured professional
information---skills, projects, experience, education, technologies,
certifications, and evidence---into an interactive graph.

Traditional profiles are flat lists. CapabilityGraph focuses on the
relationships between what a person knows, what they built, what
technologies they used, and what evidence supports those claims.

**Core question:** What can this person actually do, and what evidence
supports it?

## 2. Problem

Professional identity is fragmented across resumes, LinkedIn profiles,
GitHub repositories, project descriptions, certificates, and portfolios.
A normal profile may say:

-   Python
-   React
-   AI/ML
-   Supabase
-   5 projects

But it does not clearly answer:

-   Where was Python actually used?
-   Which project demonstrates React?
-   Which technologies were used together?
-   Which capabilities are demonstrated by multiple projects?
-   What evidence supports a claimed skill?

## 3. Solution

CapabilityGraph uses AI to extract entities and relationships from
unstructured information and presents them as an interactive capability
graph.

Example:

``` text
Person
 ├── HAS_SKILL → Python
 ├── HAS_SKILL → React
 └── BUILT → FarmSeva

FarmSeva
 ├── USES_TECHNOLOGY → React
 ├── USES_TECHNOLOGY → Supabase
 ├── USES_TECHNOLOGY → Lyzr
 └── DEMONSTRATES → AI Integration
```

The product is **not simply a portfolio with a graph**. The
relationships are the core value.

## 4. Vision

Make professional capability understandable as a connected system
instead of a flat resume.

## 5. Target Users

### Primary

-   Students
-   Developers and technical professionals
-   Job seekers
-   Recruiters

### Future

-   Teams
-   Organizations
-   Hiring departments

## 6. Product Goals

1.  Convert unstructured career information into structured entities and
    relationships.
2.  Generate an interactive capability graph automatically.
3.  Connect skills to projects and evidence.
4.  Let users review and correct AI-generated structure.
5.  Make projects first-class graph objects.
6.  Store and retrieve graph data securely.
7.  Provide a shareable professional capability profile.

### Non-goals for MVP

-   Replace LinkedIn.
-   Perfectly measure human competence.
-   Assign fake skill percentages.
-   Build a full recruitment platform.
-   Require Neo4j.
-   Build enterprise-scale graph infrastructure.

## 7. Evidence Model

CapabilityGraph should distinguish a claim from evidence.

### Evidence states

-   **Claimed:** user says they know/use it.
-   **Used:** it appears in real work.
-   **Demonstrated:** project, repository, demo, or document supports
    it.
-   **Verified:** a trusted source supports it.

Do not display arbitrary values such as `Python = 87%`.

## 8. Graph Data Model

### Node types

-   Person
-   Skill
-   Technology
-   Project
-   Capability
-   Experience
-   Education
-   Certification
-   Evidence

### Relationship types

``` text
HAS_SKILL
USES_TECHNOLOGY
BUILT
DEMONSTRATES
SUPPORTED_BY
HAS_EXPERIENCE
HAS_EDUCATION
HAS_CERTIFICATION
WORKED_ON
RELATED_TO
```

## 9. Example Capability Graph

``` text
                    React
                      ↑
                   USES
                      │
Python ── USED_IN ── FarmSeva ── USES ── Supabase
                      │
                 DEMONSTRATES
                      ↓
               AI Integration
                      ↑
                    Lyzr
```

## 10. Core User Journey

### 10.1 Sign up and Email Authorization

Use **Supabase Auth** for user authentication and email authorization.

At the start of the website, the authentication flow should work as follows:

```text
User opens website
        ↓
Check Supabase session
        ↓
Authenticated?
   ┌────┴────┐
  Yes        No
   ↓          ↓
Dashboard   Login / Sign up
              ↓
        Enter email + password
              ↓
        Supabase sends email
              ↓
        Verify email address
              ↓
        Account activated
              ↓
          Dashboard
```

Requirements:

- Supabase Auth handles authentication.
- Email/password signup is supported for the MVP.
- Email verification must be enabled.
- Users who have not verified their email should not access the private dashboard.
- On every website visit, the application checks the existing Supabase authentication session.
- Logged-in users are redirected to the dashboard.
- Logged-out users are redirected to the landing/login page.
- Password reset should use Supabase's email-based password recovery flow.
- Authentication state should be managed centrally in the React application.

### 10.2 Add information

MVP inputs: - Project description - Skills - Experience - Resume upload

Future inputs: - GitHub - LinkedIn - Portfolio - Certificates

### 10.3 AI processing

``` text
Unstructured information
        ↓
Lyzr Agent
        ↓
Claude Sonnet 4.6
        ↓
Entity extraction
        ↓
Relationship extraction
        ↓
Structured JSON
        ↓
Validation
        ↓
Supabase
        ↓
React Flow
```

### 10.4 Human review

Before saving AI-generated graph data, show:

-   Approve
-   Edit
-   Reject

## 11. AI Responsibilities

The AI identifies:

-   Skills
-   Technologies
-   Projects
-   Capabilities
-   Experience
-   Education
-   Certifications
-   Evidence
-   Relationships

The AI must not invent unsupported facts. Uncertain information should
be marked for review.

## 12. AI Output Contract

Example:

``` json
{
  "nodes": [
    {
      "id": "project_farmseva",
      "type": "project",
      "name": "FarmSeva"
    },
    {
      "id": "technology_react",
      "type": "technology",
      "name": "React"
    }
  ],
  "edges": [
    {
      "source": "project_farmseva",
      "target": "technology_react",
      "type": "USES_TECHNOLOGY"
    }
  ]
}
```

Validation must ensure unique node IDs, valid edge references, approved
node types, approved relationship types, and sensible duplicate merging.

## 13. Graph Experience

The graph is the hero feature and should use React Flow.

Required interactions:

-   Zoom
-   Pan
-   Drag nodes
-   Select nodes
-   Highlight connected nodes
-   Highlight relationships
-   Search
-   Filter
-   Fit graph
-   Reset view

### Selecting a project

Clicking `FarmSeva` should highlight its technologies and capabilities.

### Selecting a technology

Clicking `React` should show the projects and capabilities connected to
React.

## 14. Node Details

Example:

``` text
FarmSeva
Type: Project

Description:
Agricultural machine rental platform

Technologies:
React
Supabase
Lyzr

Capabilities:
Full-Stack Development
AI Integration

Evidence:
GitHub
Live Demo
```

## 15. Dashboard Requirements

The dashboard should be graph-first, not a normal analytics dashboard.

### Header

-   Global search
-   Analyze with AI
-   Notifications
-   Profile

### Sidebar

``` text
Dashboard
My Graph
AI Analysis
Add Information
Projects
Skills
Experience
Education
Certifications
Settings
```

### Overview cards

Show counts only:

-   Projects
-   Skills
-   Technologies
-   Experience
-   Certifications
-   Connections

### Main content

Large interactive graph.

### Right panel

Selected node details and connected nodes.

### Lower content

-   Recent activity
-   Recent projects
-   Technologies
-   AI insights

## 16. AI Analysis

Users can ask questions about their own graph, for example:

``` text
What technologies have I actually used?
Which projects demonstrate AI integration?
Which skills have no project evidence?
How are my projects connected?
What capabilities are demonstrated by FarmSeva?
```

Answers must be grounded in stored graph data.

## 17. Add Information

MVP actions:

``` text
Add Project
Add Skill
Add Experience
Upload Resume
```

Project form:

``` text
Project Name
Description
Technologies
Role
Project URL
GitHub URL
Demo URL
Start Date
End Date
```

## 18. Public Profile

Future shareable profile:

``` text
capabilitygraph.app/u/username
```

It contains the user's profile, graph, projects, skills, experience,
evidence, and links.

## 19. Search and Filters

Search across:

-   Skills
-   Projects
-   Technologies
-   Capabilities
-   Experience
-   Education
-   Certifications
-   Evidence

Graph filters:

``` text
All | Projects | Skills | Technologies | Capabilities | Experience | Education | Certifications | Evidence
```

## 20. Technical Architecture

### Frontend

``` text
React
Vite
React Flow
Tailwind CSS
```

### Backend

``` text
Supabase Auth          → Authentication + email verification
Supabase PostgreSQL    → Graph, profile and application data
Supabase Storage       → Resumes and uploaded evidence
```

### AI

``` text
Lyzr Agent
Claude Sonnet 4.6
```

### Deployment

``` text
Vercel
```

## 21. Why Neo4j Is Not Required for MVP

Neo4j is useful for advanced graph storage and complex graph traversal,
but it is not required for the first version.

The MVP can store nodes and edges in Supabase and use React Flow for
visualization.

``` text
Lyzr + Claude
      ↓
Graph JSON
      ↓
Supabase
      ↓
React Flow
```

Neo4j can be introduced later if graph scale or advanced graph queries
require it.

## 22. Supabase Schema

### profiles

``` text
id
user_id
name
bio
avatar_url
created_at
updated_at
```

### nodes

``` text
id
user_id
type
name
description
metadata
status
created_at
updated_at
```

### edges

``` text
id
user_id
source_node_id
target_node_id
relationship_type
metadata
created_at
```

### evidence

``` text
id
user_id
node_id
type
title
url
description
verification_status
created_at
```

### projects

``` text
id
user_id
node_id
name
description
github_url
demo_url
role
start_date
end_date
created_at
updated_at
```

## 23. Security

### Authentication

- Supabase Auth manages user authentication.
- Email verification is required before private dashboard access.
- Authentication sessions are checked when the website opens.
- Unauthenticated users are redirected to login/signup.
- Authenticated users are redirected to the dashboard.
- Password recovery uses Supabase's secure email flow.

### Data Security

- Row Level Security for user data.
-   Row Level Security for user data.
-   Users can only access their own private graph.
-   Keep Lyzr and Claude secrets server-side.
-   Validate all AI output before persistence.
-   Never fabricate evidence.

## 24. UI/UX Direction

The product should feel modern, technical, professional, AI-native,
premium, and data-driven.

Recommended visual direction:

-   Dark background
-   Subtle graph/dot texture
-   Category-based accents
-   Rounded panels
-   Clean typography
-   Restrained glass effects
-   Smooth graph animation

The graph must remain the visual centerpiece.

## 25. Empty and Processing States

### Empty state

``` text
Build your Capability Graph

Turn your skills, projects and experience
into an interactive professional identity.

[ Add your first project ]
[ Upload Resume ]
```

### Processing state

``` text
✓ Reading information
✓ Identifying entities
✓ Finding relationships
● Building capability graph
○ Preparing evidence
```

## 26. Error Handling

If AI processing fails:

``` text
We couldn't structure this information.

[ Try Again ]
[ Edit Information ]
[ Add Manually ]
```

If relationships are uncertain:

``` text
Some relationships need review before they can be added to your graph.
```

## 27. MVP Scope

### Must have

-   Authentication
-   User profile
-   Add project
-   Add skills
-   Lyzr Agent integration
-   Claude integration
-   Structured JSON output
-   AI review screen
-   Supabase graph storage
-   React Flow graph
-   Node selection
-   Connected-node highlighting
-   Node details
-   Add/edit/delete nodes
-   Add/delete relationships

### Nice to have

-   Resume parsing
-   GitHub import
-   Public profile
-   Graph search
-   Graph filters
-   AI graph chat
-   Evidence verification

### Future

-   Job/capability matching
-   Organization capability graphs
-   Team capability mapping
-   Skill-gap analysis

## 28. Future Job Matching

A job can also be represented as a graph:

``` text
Job
 ├── REQUIRES → React
 ├── REQUIRES → Python
 ├── REQUIRES → AI
 └── REQUIRES → Supabase
```

Instead of an arbitrary match percentage, the system explains matching
evidence:

``` text
React
✓ Demonstrated in FarmSeva

Python
✓ Demonstrated in Project X

AI Integration
✓ Demonstrated in FarmSeva
```

## 29. Demo Scenario

Use FarmSeva as the initial demonstration project.

### Input

``` text
FarmSeva is an agricultural machine rental platform.
I built the frontend using React and Vite.
Supabase is used for authentication and database services.
I integrated an AI assistant using Lyzr.
The application is deployed on Vercel.
```

### Expected structure

``` text
Project: FarmSeva

Technologies:
React
Vite
Supabase
Lyzr
Vercel

Capabilities:
Frontend Development
Database Integration
Authentication
AI Integration
Deployment
```

## 30. Product Differentiation

Traditional profile:

``` text
Skills
Projects
Experience
Certificates
```

CapabilityGraph:

``` text
Skill
  ↓
Project
  ↓
Technology
  ↓
Capability
  ↓
Evidence
```

The connections provide context that a flat profile cannot.

## 31. Build Order

### Phase 1 --- Foundation

-   React/Vite
-   Tailwind
-   Supabase
-   Authentication
-   Dashboard shell

### Phase 2 --- Graph Prototype

-   Install React Flow
-   Define node types
-   Define edge types
-   Build hardcoded graph
-   Zoom/pan/drag
-   Node selection
-   Details panel

### Phase 3 --- Database

-   Supabase schema
-   Save nodes
-   Save edges
-   Load graph
-   Edit/delete graph data

### Phase 4 --- AI

-   Lyzr Agent
-   Claude Sonnet 4.6
-   Structured output
-   Project processing
-   Validation

### Phase 5 --- AI to Graph

``` text
Input → Lyzr → Structured JSON → Validation → Supabase → React Flow
```

### Phase 6 --- Polish

-   Search
-   Filters
-   Animations
-   AI analysis
-   Responsive UI
-   Empty states
-   Error handling

### Phase 7 --- Demo

-   Prepare profile
-   Prepare 2--3 projects
-   Test AI extraction
-   Test graph interactions
-   Deploy to Vercel

## 32. Success Criteria

The MVP is successful when a new user can:

1.  Create an account.
2.  Add a project description.
3.  Ask AI to analyze it.
4.  Review extracted entities and relationships.
5.  Approve them.
6.  See the resulting interactive graph.
7.  Click a node and understand its relationships.
8.  Correct AI-generated information.
9.  Refresh and retain the graph.
10. Eventually share the capability profile.

## 33. Final Product Definition

> **CapabilityGraph is an AI-powered professional identity platform that
> transforms unstructured career information into an interactive,
> evidence-linked graph of skills, technologies, projects, experiences,
> and capabilities.**

The core workflow is:

``` text
Unstructured professional information
              ↓
         AI understands it
              ↓
       Structured entities
              ↓
        Relationships
              ↓
       Capability Graph
              ↓
      Explore + understand
```

**The graph is not decoration. The relationships are the product.**
