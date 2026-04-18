Perfect. I have everything I need. Let me lay out the full plan before we touch a single file.

---

## 🗺️ Full-Stack Migration Plan

### What we're building
A user gets auth → uploads PDFs → Gemini analyzes → results saved to DB → PDFs saved to Uploadthing → user can revisit any past analysis anytime.

---

### Phase 1 — Database Schema (Drizzle)
Add two tables to `packages/db/src/schema/`:

- **`analyses`** — `id`, `userId`, `subject`, `paperCount`, `createdAt`
- **`questions`** — `id`, `analysisId`, `question`, `marks`, `frequency`, `solution`, `category` (`hot | cool | extras`)

The `user` table already exists via Better-Auth, so we just foreign-key into it.

---

### Phase 2 — File Storage (Uploadthing)
- Install & configure Uploadthing in `apps/web`
- Create an uploadthing router that accepts PDFs (up to 4 files, 5MB each)
- Returns file URLs that we store alongside the analysis in DB

---

### Phase 3 — oRPC Backend Routes
Move the Gemini logic from a raw Next.js API route into proper oRPC procedures in `packages/api`:

- `analysis.create` — receives file URLs, calls Gemini, saves results to DB, returns analysis ID
- `analysis.getById` — fetch one analysis with all its questions
- `analysis.list` — fetch all analyses for the logged-in user (for a history page)

---

### Phase 4 — Frontend Wiring
- **Dashboard** (`/dashboard`) — upload flow using Uploadthing, calls `analysis.create`, redirects to result page
- **Analysis page** (`/dashboard/analysis/[id]`) — calls `analysis.getById`, renders your existing `QuesCardSec` + download PDF button
- **History page** (`/dashboard/history`) — calls `analysis.list`, shows past analyses as cards

---

### Order we'll do it step by step:
1. DB schema + migration
2. Uploadthing setup
3. oRPC `analysis` router (Gemini call lives here)
4. Dashboard page refactor
5. Analysis `[id]` page
6. History page

---

**Before we start Phase 1**, two quick things I need from you:

1. Can you share `packages/db/src/schema/auth.ts` so I can see the existing `user` table shape?
2. Can you share `packages/api/src/routers/index.ts` and `packages/api/src/index.ts` so I know how oRPC is currently structured?

That way I won't write anything that conflicts with what's already there.