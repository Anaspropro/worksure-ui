---
name: frontend-ui
description: "Generate or refactor WorkSure frontend UI code in React (Next.js) with a focus on hooks, components, and API integration."
scope: workspace
---

## Purpose

This prompt helps the assistant deliver complete, context-aware frontend UI code changes for the WorkSure React/Next.js app (`worksure-ui`).

## When to use

- You are working on `src/hooks`, `src/components`, `src/app` routes, or UI flows.
- You want a task-specific request that includes file-path context, desired behavior, and expected output format.

## Inputs (arguments)

- `task`: short description of what to implement (e.g., "implement useContracts hook", "add contract status cards in dashboard").
- `targetFile`: relative path in `worksure-ui` (e.g., `src/hooks/useContracts.ts`).
- `context`: optional background text (existing code, API endpoints, UX rules).
- `constraints`: optional list of requirements (e.g., "use React Query", "handle pagination", "include unit tests").
- `output`: optional format (e.g., "code only", "code + explanation").

## Instructions

1. Read initial user request and any provided `context` carefully.
2. Use WorkSure UI style: React 18 + Next.js App Router + TypeScript (Zod/react-hook-form if applicable).
3. Prefer strong typing, error handling, and accessibility.
4. Keep API contracts aligned with backend routes in `worksure-server` (e.g., `/api/contracts`, `/api/proposals`).
5. Generate or update code with file paths and diff-like structure.
6. Return final message with:
   - `Implementation` section (code changes)
   - `Testing` section (how to validate)
   - `Notes` section (edge cases and follow-ups)

## Example invocation

- `task`: "Refactor contracts hook to support filter by status and auto-refresh"
- `targetFile`: "src/hooks/useContracts.ts"
- `context`: "The backend endpoint is GET /contracts?status=..."
- `constraints`: ["useSWR", "include loading and error states"]
- `output`: "code only"

## Output style

- Provide code samples in fenced TypeScript blocks.
- Avoid extra prose unless asked.
- Keep result concise (max 2 sections for implementation/testing).
