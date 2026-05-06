# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build (outputs to dist/)
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

No test suite is currently configured.

## Architecture

**Attestation Portal** is a React SPA for the Ghana Ministry of Foreign Affairs that manages document attestation requests. It has two distinct user portals — applicant dashboard and admin panel — both backed by Supabase.

### Tech Stack

- **React 19** + **React Router 7** + **Vite**
- **Supabase** — auth, database (PostgreSQL), real-time subscriptions
- **Tailwind CSS 4** (via `@tailwindcss/vite` plugin, configured in `src/index.css` using `@theme`)
- **Lucide React** for icons

### Routing & Auth

`App.jsx` defines all routes. The `ProtectedRoute` component (`src/components/ProtectedRoute.jsx`) guards routes by role. Role detection lives in `AuthContext` (`src/context/AuthContext.jsx`): the email `fsowah001@gmail.com` is hardcoded as the admin user; all others get the `user` role.

Route structure:
- `/login` — public, redirects from `/`
- `/dashboard` — applicant portal (protected, role: user)
- `/admin/*` — admin portal (protected, role: admin): Dashboard, Applications, Appointments, Settings

### Supabase Integration

The client is initialized once in `src/supabaseClient.js` and imported wherever needed. The Supabase URL and anon key are hardcoded there (anon key is intentionally public; RLS controls data access).

**Key tables:**
- `applications` — core table; columns include `user_id`, `document_type`, `status`, `service_tier`, `appointment_details` (JSON), `submitted_at`
- `profiles` — user metadata with `role`, `full_name`, `email`

The admin dashboard uses Supabase real-time channels (`supabase.channel(...)`) to receive live application updates.

### Applicant Dashboard

`src/pages/dashboard/Dashboard.jsx` is the root with three tabs: Applications, Invoices, Track Status.

New application submission is a multi-step form flow orchestrated by `NewApplicationSteps.jsx`, which renders these steps in sequence:
1. `PersonalDetailsForm.jsx`
2. `UploadDocumentsForm.jsx`
3. `ServiceTierPaymentForm.jsx` (Standard GHS 200 / Express GHS 450)
4. `AppointmentBookingForm.jsx`
5. `ApplicationSubmittedSuccess.jsx`

`ApplicationDetailsModal.jsx` shows full detail for any existing application.

### Admin Panel

`AdminLayout.jsx` provides the sidebar shell. Sub-pages:
- `AdminDashboard.jsx` — live stats via real-time subscriptions
- `AdminApplications.jsx` — filterable list of all applications
- `AdminApplicationDetail.jsx` — per-application management view
- `AdminAppointments.jsx` — appointment scheduling

### Design System

Custom Tailwind theme is defined with `@theme` in `src/index.css`. Key tokens:
- Brand navy: `--color-navy-900: #081524`, `--color-navy-800: #0d1f36`
- Brand gold: `--color-gold-500: #fcd116`, `--color-gold-600: #caa712`
- Neutral scale: `--color-neutral-*` from `#242220` (900) to `#f0efee` (50)
- Custom animations: `fade-in-up`, `slide-in-right`, `float`

Ghana flag gradient bar (red/gold/green) appears as a decorative element throughout. Font is Inter via Google Fonts (loaded in `index.html`).
