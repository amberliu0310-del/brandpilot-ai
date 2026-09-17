# BrandPilot AI

**AI Marketing Workflow Prototype · Amber Liu · 2026**

[Live Demo](https://brandpilot-ai-5ixg3q.v2.appdeploy.ai/)

BrandPilot AI turns a campaign brief into a structured marketing workflow covering audience insight, strategy, content planning, measurement and experimentation.

`Brief → Insight → Strategy → Content → Measure`

## What it does

Users can enter a brand or project brief and generate:

- Audience hypothesis and core tension
- Big Idea and three message pillars
- Platform roles, formats, hooks and CTAs
- A 7-day content sprint
- KPI framework across Reach, Engagement, Growth and Action
- Visual-generation and copy-generation prompts
- A concrete A/B test for the next iteration

The public prototype also includes three preset cases for quick testing: Luxury Hospitality, HomeMuse and Culture / Performance.

## Why I built it

The project explores how AI can support multiple stages of a marketing workflow rather than a single content-generation task. The structure is adapted from my experience in brand social media, content planning and campaign communication, where I often worked from data and context toward content decisions and next-step actions.

A key design principle is transparency: unsupported market claims are framed as hypotheses, fabricated performance numbers are avoided, and the interface indicates whether the result comes from AI Mode or the fallback Demo Engine.

## Product logic

### 1. Structured Brief
Brand / category / objective / audience / USP / platform / tone / constraints

### 2. Strategy Generation
The backend converts the brief into a fixed output schema so the result can be rendered consistently in the interface.

### 3. Measurement by design
Reach, Engagement, Growth and Action are built into the plan from the beginning, rather than added after content creation.

### 4. Reliable public demo
If the AI service is unavailable, a deterministic fallback engine keeps the prototype usable for reviewers and recruiters.

## Tech

- TypeScript
- Vite
- HTML / CSS
- AppDeploy backend routes
- Structured AI generation with JSON schema
- Responsive web interface

The hosted version runs on AppDeploy, which injects its platform SDK packages at deploy time.

## Project structure

```text
brandpilot-ai/
├── backend/
│   └── index.ts          # AI generation API and schema
├── src/
│   ├── main.ts           # UI logic, fallback engine and export controls
│   └── styles.css        # Responsive interface styles
├── tests/
│   └── tests.json        # Main workflows and failure-path coverage
├── index.html
└── package.json
```

## Live prototype

**https://brandpilot-ai-5ixg3q.v2.appdeploy.ai/**

No login required.

## About

**Amber Liu**  
Brand Marketing · Content Strategy · Social Media · AI Workflow

This project was created as an AI marketing work sample for graduate recruitment.