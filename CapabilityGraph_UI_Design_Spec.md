# CapabilityGraph — UI/UX Design Specification

## Design Goal

CapabilityGraph should feel like a **professional capability explorer**, not a generic admin dashboard. The graph is the primary product experience.

Research of current graph products shows useful patterns: Neo4j Bloom uses a large graph scene with search, overlays, legends and detail cards; Neo4j supports force and hierarchical layouts; Kumu treats maps as visual databases with rich element/connection profiles, filters and focus; Obsidian emphasizes hover highlighting, click-to-open, zoom/pan and local graph exploration. citeturn0search1turn0search0turn0search7turn0search4

We should take these interaction patterns, but design a distinct **AI-powered professional identity** experience.

---

## 1. Visual Direction

### Personality

- AI-native
- Technical
- Premium
- Professional
- Calm
- Data-rich
- Exploratory

### Theme

- Deep near-black/navy background
- Slightly lighter surface panels
- Thin borders
- Subtle dot/grid background
- Restrained accent colors
- Semantic colors for graph node types

### Typography

Use a modern sans-serif such as:

- Inter
- Geist
- Manrope

### Components

- 10–16px panel radius
- Rounded buttons
- Small type/status pills
- Thin borders
- Soft shadows
- Minimal glass effects

Avoid excessive neon, excessive glassmorphism, fake analytics and skill percentages.

---

# 2. Information Architecture

```text
Public Website
├── Landing
├── Login
├── Signup
├── Email Verification
└── Authenticated App
    ├── Dashboard
    ├── My Graph
    ├── AI Analysis
    ├── Add Information
    │   ├── Project
    │   ├── Skill
    │   ├── Experience
    │   └── Resume
    ├── Projects
    ├── Skills
    ├── Experience
    ├── Education
    ├── Evidence
    └── Settings
```

---

# 3. Landing Page

### Hero

**Headline:**  
> Your professional identity, connected.

**Copy:**  
> Turn your skills, projects, experience and evidence into an interactive capability graph.

Buttons:

- Build my capability graph
- Explore a demo graph

### Hero Visual

Use a living miniature graph rather than a normal dashboard screenshot:

```text
                 AI Integration
                       │
                       │
React ─────────── FarmSeva ───────── Supabase
                       │
                       │
                  Full-Stack
```

---

# 4. Authentication

## Login

```text
CapabilityGraph

Welcome back

Email
[_____________________]

Password
[_____________________]

[ Continue ]

Forgot password?

Don't have an account?
Create account
```

## Signup

```text
Create your capability profile

Name
Email
Password

[ Create account ]

Already have an account?
Sign in
```

## Email Verification

```text
Check your inbox

We sent a verification link to
user@example.com

[ Resend email ]

Change email
```

Do not expose the private dashboard until email verification is complete.

---

# 5. Onboarding

### Step 1

> Let's build your capability graph.

> Your skills are scattered across resumes, projects and profiles. We'll connect them for you.

**[ Get started ]**

### Step 2

```text
Tell us about yourself

Name
Headline
Short bio

[ Continue ]
```

### Step 3

```text
What do you want to add first?

[ Add a project ]
[ Upload resume ]
[ Add experience ]
[ Add skills manually ]
```

---

# 6. AI Processing Screen

Do not use a generic spinner.

```text
Building your capability graph

✓ Reading your information
✓ Identifying projects
✓ Finding technologies
● Connecting capabilities
○ Preparing evidence
```

A small graph should progressively form in the background.

When finished:

> Your graph is ready for review.

**[ Review graph ]**

---

# 7. AI Review Screen

This is a critical trust screen.

Show:

### AI found

```text
PROJECT
✓ FarmSeva

TECHNOLOGIES
✓ React
✓ Supabase
✓ Lyzr
✓ Vercel

CAPABILITIES
✓ AI Integration
✓ Frontend Development
✓ Database Integration
```

### Relationships

```text
FarmSeva
 ├─ USES → React
 ├─ USES → Supabase
 ├─ USES → Lyzr
 └─ DEMONSTRATES → AI Integration
```

Actions:

- Approve & Build Graph
- Edit
- Reject

Every AI-generated item must be editable.

---

# 8. Main Dashboard

**The graph occupies the majority of the screen.**

```text
┌─────────────────────────────────────────────────────────────┐
│ CapabilityGraph       Search...       AI Analysis    Avatar  │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│ Dashboard    │                                              │
│ My Graph     │             CAPABILITY GRAPH                 │
│ Projects     │                                              │
│ Skills       │                 ● Person                     │
│ Experience   │              ╱      ╲                        │
│ Education    │        ● React      ● FarmSeva              │
│ Evidence     │                    ╱    ╲                    │
│ Settings     │              ● Supabase  ● Lyzr              │
│              │                                              │
├──────────────┴──────────────────────────────────────────────┤
│ 12 Projects     18 Skills     24 Technologies     9 Evidence│
└─────────────────────────────────────────────────────────────┘
```

The graph should not be a small card inside a conventional analytics dashboard.

---

# 9. Header

Left:

**CapabilityGraph**

Center:

```text
⌕ Search skills, projects, technologies...
```

Right:

- AI Analysis
- Notifications
- Avatar/profile menu

---

# 10. Sidebar

```text
◈ CapabilityGraph

OVERVIEW
Dashboard
My Graph

BUILD
Add Information
Projects
Skills

PROFILE
Experience
Education
Evidence

SYSTEM
Settings
```

Keep it narrow and quiet. Active item gets a subtle filled background.

---

# 11. Graph Canvas

Use a subtle grid/dot background.

### Node styles

Person:

```text
●
Indraj Gupta
PERSON
```

Project:

```text
FarmSeva
PROJECT
```

Technology:

```text
React
TECHNOLOGY
```

Skill:

```text
Problem Solving
SKILL
```

Capability:

```text
AI Integration
CAPABILITY
```

Evidence:

```text
GitHub
EVIDENCE
```

Edges remain visually clean. Relationship labels appear on hover/selection:

```text
FarmSeva ── USES ── React
```

---

# 12. Graph Controls

Bottom-left:

```text
+
−
Fit
Reset
```

Bottom-right:

```text
Filter
Layout
Legend
```

Layout options:

```text
Force
Radial
Hierarchical
```

Neo4j graph visualization supports force and hierarchical layouts, making these useful references for our graph controls. citeturn0search0

---

# 13. Graph Legend

Collapsible:

```text
GRAPH LEGEND

● Person
● Project
● Skill
● Technology
● Capability
● Experience
● Education
● Evidence
```

---

# 14. Selected Node

Clicking a node opens a right-side drawer.

Example:

```text
┌──────────────────────────┐
│ FarmSeva             ×   │
│ PROJECT                  │
│                          │
│ Agricultural machine     │
│ rental platform.         │
│                          │
│ TECHNOLOGIES             │
│ React  Supabase  Lyzr    │
│                          │
│ CAPABILITIES             │
│ AI Integration           │
│ Full-Stack Development   │
│                          │
│ EVIDENCE                 │
│ GitHub                   │
│ Live Demo                │
│                          │
│ CONNECTED                │
│ 8 nodes                  │
│                          │
│ [ Edit ]                 │
└──────────────────────────┘
```

The graph simultaneously highlights the selected node and its immediate connections.

This combines Neo4j Bloom's graph scene/detail-card pattern with Kumu's rich element profiles. citeturn0search1turn0search7

---

# 15. Focus Mode

Provide a **Focus** action for a selected node.

Example:

```text
FarmSeva
   │
 ┌─┼────────┐
 ↓ ↓        ↓
React Supabase Lyzr
```

Unrelated nodes fade into the background.

This follows the useful focus/filter pattern used by graph mapping products. citeturn0search9

---

# 16. Search

Search should navigate the graph, not merely return text.

Example:

```text
Search your capability graph

⌕ React

Technology
React

Used in
• FarmSeva
• CapabilityGraph

Demonstrates
• Frontend Development
• Full-Stack Development
```

Selecting a result centers the graph on that node.

---

# 17. AI Analysis

Header:

> AI Analysis  
> Ask anything about your capability graph.

Suggested questions:

```text
What can I actually demonstrate?

Which projects use React?

What are my evidence-backed capabilities?

Which skills have no project evidence?

How are my projects connected?
```

AI responses should contain clickable entities.

Example:

> Your **AI Integration** capability is demonstrated by **FarmSeva**, where you connected **Lyzr** to the application.

Clicking an entity focuses the graph on it.

---

# 18. Add Information

```text
Add to your graph

Choose a source

┌───────────────┐
│ + Project     │
│ Add a project │
└───────────────┘

┌───────────────┐
│ ↑ Resume      │
│ Upload resume │
└───────────────┘

┌───────────────┐
│ + Experience  │
│ Add experience│
└───────────────┘

┌───────────────┐
│ + Skills      │
│ Add manually  │
└───────────────┘
```

---

# 19. Project Form

```text
Add project

Project name
[ FarmSeva ]

Description
[................................]

Technologies
[ React ] [ Supabase ] [ Lyzr ]

GitHub URL
[...............................]

Live demo
[...............................]

Your role
[...............................]

[ Analyze with AI ]
```

After analysis:

**[ Review extracted graph ]**

---

# 20. Projects Page

Use project cards rather than a generic table.

```text
YOUR PROJECTS

┌────────────────────────────┐
│ FarmSeva                   │
│ Agricultural rental app    │
│                            │
│ React  Supabase  Lyzr      │
│                            │
│ 4 capabilities             │
│ 3 evidence sources         │
│                            │
│ Explore graph →            │
└────────────────────────────┘
```

---

# 21. Skills Page

Group skills by evidence rather than percentages:

```text
SKILLS

DEMONSTRATED
React
Python
Supabase

USED
Vite
Lyzr
Git

CLAIMED
Machine Learning
Data Structures
```

---

# 22. Evidence Page

Evidence is first-class:

```text
EVIDENCE

GitHub Repository
FarmSeva

Supports:
React
Supabase
AI Integration

Status:
Demonstrated

[ Open repository ]
```

---

# 23. Public Profile

```text
Indraj Gupta
AI/ML Developer

Building software with AI,
automation and modern web technologies.

[ GitHub ] [ LinkedIn ]

CAPABILITY GRAPH
```

Then:

- Featured capabilities
- Featured projects
- Experience
- Evidence

The graph remains the primary visual element.

---

# 24. Responsive Design

## Desktop

```text
Sidebar + Graph + Details Drawer
```

## Tablet

```text
Collapsed Sidebar + Graph + Overlay Details
```

## Mobile

Do not attempt to show the entire graph at once.

Use:

```text
Graph
 ↓
Tap node
 ↓
Bottom sheet
 ↓
Connected items
```

---

# 25. Animation

Animations should communicate state.

### Graph loading

Nodes appear progressively.

### AI processing

Edges gradually connect.

### Node selection

Selected node scales slightly.

### Highlight

Connected edges brighten; unrelated nodes fade.

Use short transitions around 150–250ms.

Avoid decorative animation overload.

---

# 26. UX Rules

1. **Graph first.**
2. **Evidence over percentages.**
3. **AI suggestions are editable.**
4. **Don't hide graph context behind excessive modals.**
5. **Search navigates the graph.**
6. **Clicking an entity reveals relationships.**
7. **Use filtering/focus as graphs grow.**
8. **Keep labels readable.**
9. **The interface should explain what the graph means.**
10. **The graph is the product, not decoration.**

---

# 27. First UI Build Scope

Build in this order:

```text
Landing
   ↓
Login / Signup
   ↓
Email Verification
   ↓
Onboarding
   ↓
Dashboard
   ↓
Interactive Capability Graph
   ↓
Node Details
```

Do not build every secondary page before validating the core graph experience.

## First Prototype Goal

Prove one thing:

> **Can a user look at their professional graph and immediately understand how their skills connect to the work they have actually done?**
