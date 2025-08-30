# 🧭 Copilot Instructions for This Repository

> **Context:** This project uses **Next.js (TypeScript)** with **ESLint** and **Tailwind CSS**, and **Sanity** as the headless CMS. These instructions tell AI coding assistants (e.g., GitHub Copilot) exactly how to help while enforcing high code quality, security, and best practices.

---

## 0) Ground Rules

- **Obey the repo’s config:** Respect `tsconfig.json`, `eslint.config.*`/`.eslintrc.*`, `tailwind.config.*`, and `next.config.*`. Do not suggest disabling rules unless there’s a clear, documented justification.
- **Type-safe by default:** Use strict TypeScript. Prefer precise types, generics, discriminated unions, and `unknown` over `any`. Avoid `as` casts; prefer type narrowing and safe refinements.
- **Follow the existing architecture:** Prefer **App Router** (\`src/app/**\`) conventions if present. If the project uses **Pages Router** (\`src/pages/**\`), follow that style instead. Don’t mix patterns.
- **Maximum security posture:** Minimize attack surface, **never expose secrets**, and follow the security rules below. Default to server components and server-only code for data access.
- **Ergonomic & accessible UI:** Use semantic HTML, `aria-*` attributes, and Tailwind utilities with good contrast and focus states. Prefer `next/image` and `next/link`.
- **Performance-aware:** Prefer static generation and caching; avoid unnecessary client components; split bundles with `dynamic(() => import(...))` when beneficial.
- **Small, focused PRs:** Generate cohesive changes that compile, lint, and include tests when adding behavior.

---

## 1) Project Structure & Conventions

When creating files, follow these defaults (adapt to the existing layout if it differs):

```
src/
  app/                       # App Router (preferred)
    (marketing)/             # Optional route groups
    page.tsx                 # Route entries
    layout.tsx               
    api/                     # Route Handlers
  components/                # Reusable UI components
    ui/                      # Low-level, generic UI building blocks
  lib/                       # Framework-agnostic utilities (TS only)
  server/                    # Server-only helpers (db, Sanity, secrets)
  styles/                    # Global CSS (Tailwind entry)
  types/                     # Shared types & schemas
  sanity/                    # Sanity client, queries, builders
    schemas/                 # Sanity schema definitions
    queries.ts               # Centralized GROQ queries
    client.ts                # `@sanity/client` initialization (server-only)
  tests/                     # Unit/integration tests (Vitest/Jest)
public/                      # Static assets
```

**Naming & code style**
- React components: `PascalCase`. Hooks: `useSomething`. Files and folders: `kebab-case` unless component file.
- Keep components **pure**; avoid side-effects in render paths.
- Prefer **Server Components**. Only mark files with `"use client"` if they need state, effects, or browser APIs.
- Co-locate component-specific styles and tests with the component, or in `tests/` if following a global pattern.
- Export a **default component** from page/route files; export **named components** elsewhere.

---

## 2) TypeScript Standards

- Enable and keep `strict` types. Prefer `readonly` where possible.
- Narrow with `in`, `typeof`, `Array.isArray`, custom type guards.
- Never use `any` or `!` non-null assertions unless there is an inline comment explaining why.
- For external data (Sanity, webhooks, query params), **validate** and **parse** with a schema validator (e.g., Zod) before use.

**Example: Zod validation for Sanity data**
```ts
import { z } from "zod";

export const PostSchema = z.object({
  _id: z.string(),
  _type: z.literal("post"),
  title: z.string().min(1),
  slug: z.object({ current: z.string().min(1) }),
  body: z.unknown(), // Portable Text; render via components
  publishedAt: z.string().datetime().optional(),
});

export type Post = z.infer<typeof PostSchema>;
```

---

## 3) ESLint, Formatting & Tailwind

- **Never** add `// eslint-disable` or `/* eslint-disable */` at file scope. If a rule must be disabled, do it on a **single line** with a brief justification.
- Tailwind: prefer tokens over arbitrary values. Extract repeated patterns via component composition or `@apply` in a small CSS layer.
- Prefer utility-first classes; do not inline long unreadable class strings—break them over lines or extract a component.
- Respect configured import/order, hooks rules, and React/Next plugins.

**Accessible Tailwind example**
```tsx
<button
  className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-offset-2"
  aria-label="Save post"
>
  Save
</button>
```

---

## 4) Next.js Best Practices

- Prefer **Server Components** and **Route Handlers**.
- Use `next/image` for images and `next/font` for fonts. Set `alt` text and dimensions.
- Choose the right data strategy:
  - **Static (SSG)** with `revalidate` whenever possible.
  - **SSR** if data must be truly fresh per request.
  - Use `revalidateTag`/`revalidatePath` instead of manual cache busting.
- Use `generateMetadata` for per-route SEO; avoid duplicate `<head>` tags.
- Use `cookies()`/`headers()` from `next/headers` for request-bound data (server-side only).
- Avoid `dangerouslySetInnerHTML`. If absolutely necessary, sanitize on the **server**.

**Example: server-only Sanity fetch**
```ts
// src/server/sanity.ts
import "server-only";
import { createClient } from "@sanity/client";

export const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: "2025-01-01",
  useCdn: true, // read-only, no drafts
  token: undefined, // never expose tokens here
});
```

---

## 5) Sanity CMS Usage (Secure by Default)

- **Never** expose management tokens to the client. If drafts are needed, use a **server-only** client with a **read token** in a Route Handler or Server Component.
- Centralize GROQ queries in `src/sanity/queries.ts` and **validate** responses with Zod.
- Use `next-sanity`’s `PortableText` or custom components for rich text. Do not render untrusted HTML.
- Configure `next.config.*` to allow **only** Sanity image domains. Use `@sanity/image-url` for builders.
- For **webhooks**: verify signatures, rate-limit, and call `revalidateTag` on affected content types.

**Example: Draft mode (App Router)**
```ts
// src/app/api/draft/route.ts
import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  draftMode().enable();
  return NextResponse.json({ ok: true });
}
```

**Example: Signed webhook handler**
```ts
// src/app/api/sanity-webhook/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

function verifySignature(body: string, signature: string, secret: string) {
  const hmac = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature));
}

export async function POST(req: Request) {
  const signature = req.headers.get("x-sanity-signature") ?? "";
  const secret = process.env.SANITY_WEBHOOK_SECRET!;
  const raw = await req.text();
  if (!verifySignature(raw, signature, secret)) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  // TODO: parse, validate, and revalidate tags/paths
  return NextResponse.json({ ok: true });
}
```

---

## 6) Security Requirements (Mandatory)

- **Secrets**: Access via `process.env` only on the server. Define and validate in a single `env.ts` (Zod) file. Never log secrets.
- **Server-only boundaries**: Use `import "server-only";` for files that must not run on the client. Do not import Node-only modules in client components.
- **XSS**: Never trust CMS text as HTML. Use rich-text renderers or sanitize on the server.
- **CSRF**: For state-changing Route Handlers, require POST and a CSRF token (unless using first-party cookies only and no cross-site POSTs). Prefer SameSite=strict cookies.
- **Headers & CSP**: Recommend a strict Content-Security-Policy (script-src 'self' 'unsafe-inline' with nonce if needed, object-src 'none', base-uri 'self', frame-ancestors 'none'). Add `X-Frame-Options: DENY` and `Referrer-Policy: no-referrer-when-downgrade`.
- **Rate limiting**: Add simple per-IP limits for mutation routes.
- **Input validation**: All external inputs (URL params, body, headers) must be schema-validated.
- **Authorization**: If admin or preview features exist, guard with auth checks on the server. Do not ship client-only auth for protected data.

---

## 7) Performance & DX

- Prefer `fetch` with `next` caching options and tagged revalidation. Avoid client-side fetching unless interactivity requires it.
- Use `next/image` for automatic image optimization.
- Split large components with `next/dynamic`.
- Avoid heavy dependencies in client bundles; keep client components lean.
- Memoize stable callbacks (`useCallback`) and derived values (`useMemo`) when passing to children or dependencies.

---

## 8) Accessibility

- Provide labels and roles for interactive elements; ensure keyboard navigation.
- Ensure focus styles are visible. Do not remove outlines without an accessible replacement.
- Use proper heading hierarchy (`h1` per page).
- Maintain color contrast ratios (WCAG AA+). Tailwind utilities should reflect this.

---

## 9) Testing Policy

- **Unit/integration**: Use Vitest or Jest with React Testing Library. Test rendering, accessibility, and logic. Mock network calls.
- **E2E**: Use Playwright for critical flows.
- **Contracts**: For Sanity responses, include schema validation tests.
- **Snapshots**: Use sparingly for structured UI; avoid brittle snapshots.

**Example: component test**
```ts
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

test("renders button with label", () => {
  render(<Button>Save</Button>);
  expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
});
```

---

## 10) Git Hygiene & PR Checklist

- Conventional commits (e.g., `feat:`, `fix:`, `chore:`). Write clear messages.
- PRs must **build**, **lint**, and **pass tests** locally and in CI.
- Include or update **types**, **tests**, and **docs** for new features.
- Remove unused code, console logs, and commented-out blocks.
- Never commit secrets or `.env*` files.

---

## 11) Copilot Prompt Patterns (Do/Don’t)

**Do ask for**
- Server Components that fetch data from Sanity via a **server-only** client with validated output.
- Tailwind-based components with accessible markup.
- Zod schemas for all external data.
- Route Handlers with input validation, rate limiting, and CSRF safeguards where applicable.
- `generateMetadata` implementations with canonical URLs and Open Graph.

**Do not**
- Do not generate code that places tokens or secrets in client bundles.
- Do not suggest `any`, global ESLint disables, or `dangerouslySetInnerHTML` without sanitation.
- Do not bypass existing architectural patterns.

**Good prompt example**
> “Create a Server Component at `src/app/(marketing)/blog/[slug]/page.tsx` that fetches a single post from Sanity by slug using `src/server/sanity.ts` and a GROQ query from `src/sanity/queries.ts`. Validate with `PostSchema`. Use `revalidate = 60` and `generateMetadata`. Render Portable Text via a `RichText` component.”

---

## 12) Ready-to-Use Snippets

**Sanity image builder**
```ts
import imageUrlBuilder from "@sanity/image-url";
import { sanity } from "@/server/sanity";

const builder = imageUrlBuilder(sanity);
export const urlFor = (source: unknown) => builder.image(source);
```

**Typed env loader**
```ts
// src/env.ts
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SANITY_PROJECT_ID: z.string().min(1),
  SANITY_DATASET: z.string().min(1),
  SANITY_WEBHOOK_SECRET: z.string().min(1).optional(),
});

export const env = EnvSchema.parse(process.env);
```

**Route handler with cache tag**
```ts
// src/app/api/revalidate/route.ts
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { tag } = await req.json();
  if (typeof tag !== "string" || tag.length === 0) {
    return NextResponse.json({ error: "Invalid tag" }, { status: 400 });
  }
  revalidateTag(tag);
  return NextResponse.json({ ok: true });
}
```

---

## 13) Documentation Expectations

- Every new module exports clear types and has a top-of-file comment explaining responsibility and boundaries.
- Public functions have JSDoc-style comments for parameters/returns.
- Complex components include a short usage example.

---

## 14) Definition of Done (for Copilot-generated changes)

- Code compiles, lints cleanly, and passes all tests.
- No secrets or unsafe patterns.
- Types are correct and exhaustive.
- Accessibility and performance considerations are addressed.
- Docs and tests updated as needed.

---

**End of file.**

