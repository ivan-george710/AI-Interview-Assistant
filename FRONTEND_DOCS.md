# Frontend Architecture & Integration Guide

This document summarizes the current state of the User Interface for the AI Interview Assistant. It is designed to help backend developers or other team members easily merge this UI with the rest of the project and connect it to real data.

## 1. Directory Structure
The frontend is built using Next.js (App Router) and Tailwind CSS.
```text
frontend/
├── app/                  # Application Routes (Pages)
│   ├── analytics/        # Analytics view
│   ├── dashboard/        # Main User Dashboard
│   ├── forgot-password/  # Password reset flow
│   ├── login/            # User authentication
│   ├── mock-interview/   # Mock interview environment
│   ├── practice/         # Practice area
│   └── register/         # User registration
├── components/           # Reusable UI Components
│   ├── DailyCodingGoals.tsx
│   ├── FeatureCard.tsx
│   ├── FeedbackPanel.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── ProgressChart.tsx
│   ├── ReadinessScore.tsx
│   ├── RecentActivity.tsx
│   ├── Sidebar.tsx
│   ├── StatCard.tsx
│   └── TopicPerformance.tsx
```

## 2. Authentication Flow (To-Do for Backend)
The authentication UI is completely styled but currently uses mocked client-side state. To integrate with your real backend (e.g., Supabase, Firebase, or a Custom Node API):

- **`/app/login/page.tsx`**: The `handleLogin` function currently just calls `router.push("/dashboard")`. Replace this with your API call to authenticate the user and establish a session.
- **`/app/register/page.tsx`**: Add an `onSubmit` handler to the form to capture the user's Full Name, Email, and Password, and send it to your user creation endpoint.
- **`/app/forgot-password/page.tsx`**: The `handleSubmit` function currently fakes a success state. Wire this up to your backend route that handles sending reset emails.

## 3. Dashboard Integration
The dashboard (`/app/dashboard/page.tsx`) uses a responsive grid layout composed of several modular components.

### Current State
All components currently contain **hard-coded mock data** directly inside them to demonstrate the premium visual design and layout. 

### How to make it dynamic:
Instead of fetching data inside every single component, you should fetch the user's profile and statistics at the top level in `/app/dashboard/page.tsx` (ideally as a Server Component for performance). 

You will need to update the following components to accept data as `props`:
1. **`ReadinessScore.tsx`**: Pass the user's calculated score (e.g., `score={78}`).
2. **`DailyCodingGoals.tsx`**: Pass the daily goal progress (e.g., `completed={3}`, `total={5}`).
3. **`ProgressChart.tsx`**: Pass the historical data array to feed into Recharts.
4. **`TopicPerformance.tsx`**: Pass the array of topics and mastery percentages.
5. **`RecentActivity.tsx`**: Pass an array of the user's recent actions (e.g., mock interviews completed, problems solved).

## 4. Styling & Design System
- **Framework**: Tailwind CSS.
- **Theme**: Dark mode by default (`bg-slate-950`). 
- **Accents**: We heavily use `cyan-500` and `emerald-500` for primary actions and positive indicators, with `slate-800` and `slate-900` for cards and borders.
- **Responsiveness**: All pages (especially the dashboard) use flexbox and CSS grids (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) to automatically scale down for mobile devices.

## 5. Next Steps for Merging
1. **Global Layouts**: Ensure `frontend/app/layout.tsx` wraps the application in whatever global state providers you need (e.g., AuthProvider, Redux, React Query).
2. **Routing Protection**: Implement a middleware (`middleware.ts`) to prevent unauthenticated users from accessing `/dashboard`, `/mock-interview`, etc., and redirect them to `/login`.
3. **API Utility**: Create a `frontend/utils/api.ts` file to centralize your Axios or Fetch requests to your backend server.
