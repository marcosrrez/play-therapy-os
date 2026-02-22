# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (eslint-config-next with core-web-vitals + typescript)
```

No test framework is currently configured.

## Environment

Requires a `.env.local` file with a `GOOGLE_GENERATIVE_AI_API_KEY` for the Gemini API (used by `@ai-sdk/google`).

## Architecture

This is a **Next.js 16 App Router** project using **React 19** and **TypeScript**. It is a single-page AI chat application for play therapy clinical education.

### Key patterns

- **Single-page app**: The entire UI lives in `app/page.tsx` as a client component (`"use client"`). There are no other routes/pages.
- **AI chat via Vercel AI SDK**: The `useChat` hook from `ai/react` handles the chat state client-side. The backend is a streaming API route at `app/api/chat/route.ts` using `streamText` with the **Gemini 2.0 Flash** model (`@ai-sdk/google`).
- **Artifact system**: The AI is prompted to embed structured artifacts (handouts, techniques) in its responses using `[ARTIFACT_START]...[ARTIFACT_END]` delimiters containing JSON with `{ title, type, content }`. The client parses these on `onFinish` and renders them in a right-side artifact panel.
- **UI components**: Built with **shadcn/ui** (new-york style, RSC-enabled) via `components/ui/`. Uses **Radix UI** primitives, **Tailwind CSS v4** with CSS variables for theming, and **framer-motion** for animations. Icons from **lucide-react**.
- **Fonts**: Inter (sans) and Goudy Bookletter 1911 (serif) loaded via `next/font/google`, exposed as CSS variables `--font-sans` and `--font-serif`.
- **Theming**: Light-only, warm paper aesthetic (`#F9F8F6` background). All color tokens are defined as CSS custom properties using OKLCH in `app/globals.css`.

### Path aliases

`@/*` maps to the project root (configured in `tsconfig.json`). Use this for all imports (e.g., `@/components/ui/button`, `@/lib/utils`).

### Adding shadcn components

```bash
npx shadcn@latest add <component-name>
```

Configuration is in `components.json` (new-york style, neutral base color, CSS variables enabled).
