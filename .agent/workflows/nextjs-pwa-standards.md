---
description: Next.js PWA & full-stack development standards for building progressive web apps
---

# Next.js PWA & Full-Stack Development Standards

## Core Architecture

- **Framework**: Next.js (App Router) using `src/` directory.
- **Language**: TypeScript (Strict mode).
- **Styling**: Tailwind CSS (Mobile-first responsive design).
- **Environment**: Use `.env.local` for secrets; prefix only public client vars with `NEXT_PUBLIC_`.

## Full-Stack Separation

- **Server Components (Default)**: Use for data fetching (Direct DB access via Prisma/Drizzle) and SEO.
- **Client Components**: Use `"use client"` only for interactive UI (hooks, browser events).
- **Server Actions**: Define in `app/actions.ts` with `"use server"`. Use for form submissions and mutations to avoid manual API route boilerplate. Use `revalidatePath` for instant UI updates.
- **Logic Isolation**: Keep heavy backend logic/DB clients in `@/lib/` or `@/server/`. Use `import 'server-only'` to prevent leaking secrets to the client.

## PWA Implementation (App Store-Free)

- **Plugin**: Use `@ducanh2912/next-pwa`.
- **Configuration**: Set `display: 'standalone'` in `app/manifest.ts` to remove browser UI.
- **Static Assets**: Required icons: `icon-192.png` and `icon-512.png` in `/public`.
- **Platform Handling**:
  - **Android**: Use `beforeinstallprompt` event for custom install buttons.
  - **iOS**: Provide manual UI instructions ("Share" -> "Add to Home Screen") as Safari doesn't support auto-prompts.
- **Detection**: Use `window.matchMedia('(display-mode: standalone)').matches` to hide web-only elements (like "Install" banners) when the app is already installed.

## Cross-Platform UI

- **Responsive**: Use Tailwind's `sm:`, `md:`, `lg:` prefixes.
- **Touch-Optimized**: Minimum tap targets 44x44px. Disable hover-only states for mobile.
- **Navigation**: Use a bottom navigation bar for PWA/Mobile users and a top navbar for desktop/web users.
