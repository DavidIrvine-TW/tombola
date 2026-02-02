# All The Beans

A coffee bean marketplace featuring a daily "Bean of the Day", product browsing with search/filtering, and an order system. Built to satisfy both Scenario 1 and Scenario 2 of the technical brief.

## Technology Choices

### Why Next.js over MERN

The initial plan was to use the MERN stack (MongoDB, Express, React, Node.js) with a separate frontend and backend. After some thought, it became clear that Next.js would be a simpler and more cohesive choice. Next.js combines the frontend and backend into a single project using API routes, removing the need to maintain two separate servers and deal with CORS configuration. This keeps the codebase smaller and the development workflow straightforward, while still providing a clear separation of concerns between the UI layer and the data layer.

### Stack

- **Next.js** (React framework) - Handles both the UI and the API routes in a single project. Server-side rendering and the App Router provide good performance out of the box.
- **TypeScript** - Type safety across the full stack, from database queries to component props.
- **Drizzle ORM** - A lightweight, type-safe ORM that maps directly to SQL. Chosen over heavier ORMs for its simplicity and minimal abstraction.
- **SQLite** (via libsql) - A file-based relational database that requires no external services to run. Suitable for the scope of this project and satisfies the relational database requirement in Scenario 2. This also satisfies my keen interest in using/learning one or more new technologies with every project I build. 
- **Tailwind CSS** - Utility-first CSS framework for building the responsive layout quickly and consistently.


## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
npm install
```

### Database Setup

The database needs to be created and populated before running the app. This is a three-step process:

1. **Generate migrations** - Reads the schema defined in `src/lib/db/schema.ts` and generates SQL migration files in the `drizzle/` folder.
```bash
npx drizzle-kit generate
```

2. **Run migrations** - Executes the generated SQL against the database, creating the tables (`beans`, `orders`, `botd_history`). This also creates the `data.db` SQLite file in the project root.
```bash
npx drizzle-kit migrate
```

3. **Seed the database** - Reads `AllTheBeans.json` and inserts all the coffee bean data into the `beans` table.
```bash
npm run seed
```

### Run the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/beans` | List all beans (supports `?search=`, `?country=`, `?colour=` filters) |
| GET | `/api/beans/:id` | Get a single bean by ID |
| GET | `/api/beans/countries` | List unique countries |
| GET | `/api/beans/colours` | List unique roast types |
| GET | `/api/botd` | Get today's Bean of the Day |
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders` | List all orders |
| DELETE | `/api/orders` | Clear all orders |

## Features

- Responsive layout that works across mobile, tablet, and desktop
- Bean of the Day selected randomly each day, guaranteed different from the previous day
- Search and filter beans by name, description, country, and roast type
- Order form with input validation
- Orders page with table view (desktop) and card view (mobile)
