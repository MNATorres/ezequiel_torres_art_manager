# Ezequiel Torres Art Manager

Admin dashboard for managing the Ezequiel Torres Art portfolio.

## Architecture

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#6366f1','primaryTextColor':'#fff','primaryBorderColor':'#4f46e5','lineColor':'#94a3b8','fontFamily':'Inter, system-ui, sans-serif'}}}%%
flowchart TB
    user(["👤 Admin User"])

    subgraph browser["🌐 Browser — React 19 SPA"]
        direction TB

        subgraph entry["Bootstrap"]
            main["main.tsx<br/><i>ReactDOM root</i>"]
            app["App.tsx<br/><i>BrowserRouter</i>"]
        end

        subgraph state["🔐 Global State"]
            authctx["AuthContext<br/><i>useAuth() hook</i><br/>token · user · isAuthenticated"]
        end

        subgraph routing["🧭 Routing — react-router-dom v7"]
            guard{"ProtectedRoute<br/><i>isAuthenticated?</i>"}
            login["/login<br/><i>Login page</i>"]
            dash["/dashboard<br/><i>Dashboard page</i>"]
        end

        subgraph ui["🎨 UI Layer"]
            mui["Material UI v9<br/><i>+ Emotion</i>"]
        end

        subgraph data["📡 Data Layer"]
            services["services/api.ts<br/><i>authService · userService</i>"]
            axiosI["axios instance<br/><i>request interceptor</i><br/>injects Bearer token"]
        end

        storage[("💾 localStorage<br/>token · user")]
    end

    backend["⚙️ Backend REST API<br/><i>VITE_API_BASE_URL</i><br/>/api/auth · /api/users"]

    %% Flows
    user -->|interacts| browser
    main --> app
    app --> authctx
    app --> routing

    guard -->|"✅ authed"| dash
    guard -->|"❌ not authed"| login

    login -->|"login()"| authctx
    dash -->|"reads user"| authctx

    login & dash -.->|render| mui

    login -->|"authService.login()"| services
    dash -->|"userService.getAllUsers()"| services
    services --> axiosI

    authctx <-->|"persist / rehydrate"| storage
    axiosI -->|"reads token"| storage

    axiosI <==>|"HTTPS · JSON<br/>Bearer JWT"| backend

    classDef store fill:#1e293b,stroke:#475569,color:#e2e8f0;
    classDef ext fill:#0f766e,stroke:#0d9488,color:#fff;
    class storage store;
    class backend ext;
```

**Request flow:** the user authenticates via the `Login` page → `AuthContext` stores the JWT in `localStorage` → `ProtectedRoute` unlocks `/dashboard` → page components call `authService`/`userService`, whose shared axios instance auto-injects the `Bearer` token on every request to the backend REST API.

**Tech Stack:**
- React 19 + TypeScript
- Vite (build tool)
- Material UI (components)
- React Router (navigation)
- Axios (HTTP client)

## Getting Started

### Prerequisites
- Node.js 18+
- Backend running at `http://localhost:3000` (see `VITE_API_BASE_URL` in `.env`)

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Server runs at `http://localhost:5173`

**Demo credentials:**
- Email: `admin@example.com`
- Password: `admin123`

### Build

```bash
npm run build
npm run preview  # Preview the production build locally
```

## Project Structure

```
src/
├── pages/           # Page components (Login, Dashboard)
├── components/      # Reusable components (ProtectedRoute)
├── context/         # React Context (AuthContext)
├── services/        # API client (Axios + endpoints)
├── types/           # TypeScript types
└── App.tsx          # Main router
```

## Features

- ✅ Login/Logout with JWT
- ✅ Protected routes (redirect to login if not authenticated)
- ✅ Users table (list all users)
- ✅ Material UI theming
- ✅ Auto token injection in requests

## Next Steps

- [ ] User CRUD (Create, Edit, Delete)
- [ ] Artworks management
- [ ] Gallery editor
- [ ] User role management
