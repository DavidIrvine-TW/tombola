# All The Beans - Implementation Plan

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite via better-sqlite3 + Drizzle ORM
- **Single project** - no client/server split

### Why This Stack?

- **Next.js** combines frontend and backend in one project. API routes live alongside pages. One `npm run dev`, no CORS, no proxy config.
- **SQLite** is a single file on disk. No cloud accounts, no connection strings, no running services.
- **Drizzle** gives type-safe SQL queries and a clean migration path to PostgreSQL if ever needed.
- **Tailwind** is the practical default for component styling.

---

## Project Structure

```
tombola/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (header, footer)
│   │   ├── page.tsx                # Home page (BOTD + bean list)
│   │   ├── globals.css             # Tailwind imports + custom styles
│   │   └── api/
│   │       ├── beans/
│   │       │   ├── route.ts        # GET /api/beans
│   │       │   ├── countries/
│   │       │   │   └── route.ts    # GET /api/beans/countries
│   │       │   ├── colours/
│   │       │   │   └── route.ts    # GET /api/beans/colours
│   │       │   └── [id]/
│   │       │       └── route.ts    # GET /api/beans/:id
│   │       ├── botd/
│   │       │   └── route.ts        # GET /api/botd
│   │       └── orders/
│   │           └── route.ts        # POST /api/orders
│   ├── components/
│   │   ├── BeanCard.tsx
│   │   ├── BeanList.tsx
│   │   ├── BeanDetail.tsx
│   │   ├── BeanOfTheDay.tsx
│   │   ├── SearchFilter.tsx
│   │   └── OrderForm.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts           # Drizzle table definitions
│   │   │   ├── index.ts            # DB connection singleton
│   │   │   └── seed.ts             # Seed script
│   │   └── botd.ts                 # BOTD selection logic
│   └── types/
│       └── index.ts                # Shared TypeScript types
├── drizzle.config.ts               # Drizzle Kit config
├── AllTheBeans.json                # Seed data (existing)
├── brief.md                        # Requirements (existing)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── .claude/
    └── plan.md                     # This file
```

---

## Database Schema (SQLite via Drizzle)

### beans

| Column      | Type    | Notes                        |
|-------------|---------|------------------------------|
| id          | integer | Primary key, auto-increment  |
| index       | integer | Original index from seed data|
| isBOTD      | integer | 0 or 1 (SQLite boolean)      |
| cost        | text    | e.g. "£39.26"                |
| image       | text    | URL                          |
| colour      | text    | Roast type                   |
| name        | text    | Bean name                    |
| description | text    | Bean description             |
| country     | text    | Country of origin            |

### orders

| Column       | Type    | Notes                       |
|--------------|---------|-----------------------------|
| id           | integer | Primary key, auto-increment |
| beanId       | integer | Foreign key → beans.id      |
| customerName | text    |                             |
| email        | text    |                             |
| quantity     | integer |                             |
| totalCost    | text    | e.g. "£78.52"              |
| createdAt    | text    | ISO 8601 timestamp          |

### botd_history

| Column | Type    | Notes                       |
|--------|---------|-----------------------------|
| id     | integer | Primary key, auto-increment |
| beanId | integer | Foreign key → beans.id      |
| date   | text    | Date string (YYYY-MM-DD), unique |

---

## API Endpoints (Next.js Route Handlers)

| Method | Endpoint               | Description                                                    |
|--------|------------------------|----------------------------------------------------------------|
| GET    | `/api/beans`           | List all beans (supports `?search=`, `?country=`, `?colour=`) |
| GET    | `/api/beans/:id`       | Get single bean by ID                                          |
| GET    | `/api/beans/countries` | Get unique country list                                        |
| GET    | `/api/beans/colours`   | Get unique colour/roast list                                   |
| GET    | `/api/botd`            | Get Bean of the Day (auto-selects if needed)                   |
| POST   | `/api/orders`          | Create new order                                               |

### BOTD Logic

1. Check `botd_history` for an entry with today's date
2. If found, return that bean
3. If not found:
   - Get yesterday's BOTD from history (if any)
   - Select a random bean that is NOT yesterday's BOTD
   - Set `isBOTD = 0` on all beans, then `isBOTD = 1` on selected bean
   - Insert entry into `botd_history`
4. Return the selected bean

---

## Implementation Steps

### Step 1: Project Setup

1. Initialize Next.js project with TypeScript and Tailwind
2. Install dependencies:
   - `better-sqlite3`, `drizzle-orm`
   - Dev: `drizzle-kit`, `@types/better-sqlite3`
3. Configure `next.config.js` (allow external images from unsplash)
4. Set up Tailwind with custom coffee colour palette

### Step 2: Database Layer

1. Define Drizzle schema in `src/lib/db/schema.ts` (beans, orders, botd_history tables)
2. Create DB connection singleton in `src/lib/db/index.ts`
3. Configure `drizzle.config.ts`
4. Generate and run migration
5. Create seed script (`src/lib/db/seed.ts`) to import `AllTheBeans.json`
6. Add `"seed"` script to `package.json`

### Step 3: API Routes

1. `src/app/api/beans/route.ts` - GET with search/filter via Drizzle `like()` and `eq()`
2. `src/app/api/beans/[id]/route.ts` - GET single bean
3. `src/app/api/beans/countries/route.ts` - GET distinct countries
4. `src/app/api/beans/colours/route.ts` - GET distinct colours
5. `src/app/api/botd/route.ts` - GET with BOTD selection logic (calls `src/lib/botd.ts`)
6. `src/app/api/orders/route.ts` - POST with validation and cost calculation

### Step 4: Frontend Components

1. **Root layout** (`app/layout.tsx`) - Header, footer, fonts, metadata
2. **Home page** (`app/page.tsx`) - Client component composing all sections
3. **BeanOfTheDay** - Hero banner fetching from `/api/botd`
4. **SearchFilter** - Text input + country/colour dropdowns
5. **BeanList** - Responsive grid with loading/empty states
6. **BeanCard** - Image, name, price, country, colour badge
7. **BeanDetail** - Modal with full info and "Order Now" button
8. **OrderForm** - Modal form with name, email, quantity, total calculation

### Step 5: Verification

1. Run `npm run seed` to populate database
2. Run `npm run dev`
3. Test: browse beans, search/filter, view BOTD, open detail modal, place order
4. Verify BOTD returns a different bean from yesterday

---

## Files to Create (total: ~22)

### Config (5)
1. `package.json`
2. `tsconfig.json`
3. `next.config.js`
4. `tailwind.config.ts`
5. `drizzle.config.ts`

### Database (3)
6. `src/lib/db/schema.ts`
7. `src/lib/db/index.ts`
8. `src/lib/db/seed.ts`

### API Routes (6)
9. `src/app/api/beans/route.ts`
10. `src/app/api/beans/[id]/route.ts`
11. `src/app/api/beans/countries/route.ts`
12. `src/app/api/beans/colours/route.ts`
13. `src/app/api/botd/route.ts`
14. `src/app/api/orders/route.ts`

### Shared (2)
15. `src/lib/botd.ts`
16. `src/types/index.ts`

### Frontend (8)
17. `src/app/layout.tsx`
18. `src/app/page.tsx`
19. `src/app/globals.css`
20. `src/components/BeanCard.tsx`
21. `src/components/BeanList.tsx`
22. `src/components/BeanDetail.tsx`
23. `src/components/BeanOfTheDay.tsx`
24. `src/components/SearchFilter.tsx`
25. `src/components/OrderForm.tsx`

---

## Getting Started (after implementation)

```bash
# Install dependencies
npm install

# Set up database and seed
npx drizzle-kit generate
npx drizzle-kit migrate
npm run seed

# Start dev server
npm run dev
```

App available at `http://localhost:3000`
