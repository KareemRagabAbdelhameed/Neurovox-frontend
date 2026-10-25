# NeuroVox Frontend

Web client for [NeuroVox](https://github.com/KareemRagabAbdelhameed/Neurovox), a financial platform for account access, deposits, withdrawals, daily missions, and referrals. This repository is the React app (`neurovoxstrat-frontend`). After sign-in, a dashboard covers wallet activity, missions, notifications, and account settings.

The interface brands the product as Neurovox, an AI investment platform. The sections below describe only behavior implemented in this codebase.

## Features

### Authentication

- Registration collects first name, last name, email, phone, date of birth, and password. Yup requires age 18 or older, a phone number of 10–15 digits, and a password of at least 8 characters with uppercase, lowercase, a number, and a special character.
- Login sends email and password to `POST auth/login`. The access token and refresh token are stored in `localStorage` as `token` and `refreshToken`.
- Logout calls `POST auth/logout` and clears both tokens.
- Forgot-password submits an email to `POST auth/forgot-password`. Reset-password submits a new password to `POST auth/reset-password`.
- `/verify-email` reads `status` and `message` from the query string. `success` shows a confirmation, then navigates to `/login`.
- Every `/dashboard` route is wrapped in a token check. With no token, the app redirects to `/`.
- The Axios client sends `Authorization: Bearer <token>`. On a `401` it calls `POST auth/refresh` once, stores the new access token, and retries the original request. If refresh fails, both tokens are removed and the browser is sent to `/`.

### Dashboard

- `/dashboard` and `/dashboard/plans` render one overview: sample cards for total balance, active investments, total earnings, and completed missions, plus shortcuts to deposits, withdrawals, plans, and missions.
- The active-investments and active-missions panels on that screen are empty states.
- Sidebar entries for Teams and Analytics open this same overview (`/dashboard/teams`, `/dashboard/analytics`).
- The sidebar quick-stats card uses fixed sample values for daily earnings, active plans, and active missions.

### Deposits

- A deposit form takes a method (`crypto`, `bank`, or `card`) and a USD amount, then posts `{ amount, method }` to `POST /deposits`.
- History comes from `GET deposits`. Each row shows amount, currency, method, date, and a status of confirmed, pending, or failed.
- Choosing cryptocurrency shows a note that only USDT/USDC should be sent. The form does not render a wallet address.

### Withdrawals

- The form accepts cryptocurrency or bank transfer, a destination (wallet address or account details), and a USD amount.
- Copy on the page states a 5% processing fee and a $10 minimum. Submit calculates that 5% fee locally, rejects an empty destination, and rejects an amount above the available balance stored in component state (initialized to $250). A locked balance of $50 sits in the same state object. The balance card that would display those figures is commented out.
- The new withdrawal is prepended to that local list for the current view. The handler leaves the $10 minimum as on-screen copy and sends nothing to the API.

### Missions

Four tasks award points in the Redux `missions` slice for the current browser session:

| Task | Route | Points |
| --- | --- | --- |
| Watch a video (placeholder player) | `/dashboard/missions/video` | 50 |
| Read an article | `/dashboard/missions/article` | 30 |
| Daily check-in | `/dashboard/missions/checkin` | 20 |
| Three-question survey | `/dashboard/missions/survey` | 50 |

Opening a task starts a timer. Completing it stores the elapsed seconds and returns to `/dashboard/missions`. Progress stays in memory for the session. It is not written to `localStorage` or the API.

### Profile and referrals

- `GET auth/profile` loads the signed-in user.
- The page shows name, email, available balance, locked balance, and credits, with skeleton placeholders while the request is in flight.
- The invite link can be copied to the clipboard.
- Referred users (name, email, created at, level) load from `GET /users/referral/:id` on the referral host listed under [Environment variables](#environment-variables).

### Notifications

- The header loads `GET notifications`, shows an unread count, and can mark one notification or all of them as read.
- `/dashboard/notifications` lists the same feed with per-item and mark-all-as-read actions.

### Settings and layout

- Settings offers English, Arabic, French, German, Spanish, Chinese, and Italian. The choice is stored in `localStorage` as `lang` and applied with i18next. English is the fallback.
- A dark-mode toggle stores `darkMode` in `localStorage` and toggles the `dark` class on `<html>` (Tailwind `darkMode: "class"`).
- Signed-in layout: desktop sidebar, and a mobile navigation drawer in the header.
- Unmatched paths render a 404 page. Its button navigates to `/dashboard`.

## Tech stack

| Area | Choice |
| --- | --- |
| UI | React 19, TypeScript |
| Build | Vite 7. `build` runs `tsc -b` before `vite build` |
| Routing | React Router 7 (`BrowserRouter` in `src/main.tsx`) |
| Auth and API calls | Redux Toolkit async thunks and Axios |
| Query client | TanStack Query is provided in `App`. `useAuth` reads a `/api/auth/user` query through it. Sign-in, profile, deposits, and notifications go through Axios and Redux |
| Styling | Tailwind CSS 3, PostCSS, Autoprefixer |
| Components | Button, badge, card, and a Radix avatar are used on screen. `src/components/ui` also includes Radix dropdown-menu and toast primitives (`class-variance-authority`, `clsx`, `tailwind-merge`) |
| Forms | React Hook Form, Yup, `@hookform/resolvers` |
| Internationalization | i18next, react-i18next, i18next-browser-languagedetector |
| Feedback | SweetAlert2 on auth flows |
| Icons | Lucide React, React Icons |

`src/lib/currencyService.ts` can fetch USD rates from `https://api.exchangerate-api.com/v4/latest/USD`, cache them for one hour, and format amounts. No page imports `useCurrency`.

## Getting started

### Prerequisites

- Node.js `^20.19.0 || >=22.12.0` (the `engines` range published by Vite 7.1, which this app depends on)
- npm (this repo ships a `package-lock.json`)

### Install and run

```bash
git clone https://github.com/KareemRagabAbdelhameed/Neurovox-frontend.git
cd Neurovox-frontend
npm install
npm run dev
```

`vite.config.ts` does not set a host or port, so the dev server uses Vite's default: [http://localhost:5173](http://localhost:5173).

### Scripts

Defined in `package.json`:

| Script | Command | What it does |
| --- | --- | --- |
| `dev` | `vite` | Dev server with hot module replacement |
| `build` | `tsc -b && vite build` | Typecheck the project, then write the production bundle to `dist/` |
| `preview` | `vite preview` | Serve the production build locally |
| `lint` | `eslint .` | Lint `*.ts` / `*.tsx` with the flat config in `eslint.config.js` |

`package.json` does not define a test script.

### Environment variables

The app does not read environment variables. There is no `.env` file, no `.env.example`, and no `import.meta.env` usage anywhere in the source.

API hosts are constants in the client:

| Client | Host | Used for |
| --- | --- | --- |
| `src/config/axiosConfig.ts` (`baseURL`) | `http://178.16.131.149/` | Register, login, logout, forgot-password, reset-password, token refresh, `GET auth/profile`, `GET deposits`, `POST /deposits`, `GET notifications`, and the header action that marks every notification read |
| Direct Axios calls in `src/pages/ProfilePage.tsx`, `src/pages/Notifications.tsx`, and `src/components/Header.tsx` | `http://195.200.15.135` | `GET /users/referral/:id`, and `PATCH /notifications/is-read/:id` for a single notification (and for mark-all on the notifications page) |

To target another backend, change those URLs in source. Authenticated requests made with the shared Axios instance send the access token from `localStorage`.

The companion repository, [Neurovox](https://github.com/KareemRagabAbdelhameed/Neurovox), is a separate project. This client does not start it. At the time of writing, that repository is empty, so a running API has to be available at the hosts above (or at whatever hosts you substitute).

### Routes

| Path | Screen | Access |
| --- | --- | --- |
| `/` | Login | Public |
| `/register` | Register | Public |
| `/forgot-password` | Forgot password | Public |
| `/reset-password` | Reset password | Public |
| `/verify-email` | Email verification result (`?status=&message=`) | Public |
| `/dashboard` | Investment overview | Token required |
| `/dashboard/plans` | Same overview | Token required |
| `/dashboard/missions` | Mission list | Token required |
| `/dashboard/missions/video` | Video task | Token required |
| `/dashboard/missions/article` | Article task | Token required |
| `/dashboard/missions/checkin` | Daily check-in | Token required |
| `/dashboard/missions/survey` | Survey | Token required |
| `/dashboard/deposits` | Deposits | Token required |
| `/dashboard/withdrawals` | Withdrawals | Token required |
| `/dashboard/teams` | Same overview as plans | Token required |
| `/dashboard/analytics` | Same overview as plans | Token required |
| `/dashboard/settings` | Language and theme | Token required |
| `/dashboard/notifications` | Notification list | Token required |
| `/dashboard/profile` | Profile and referrals | Token required |
| Any other path | 404 | Public |

## Project structure

```text
.
├── index.html                  # Vite HTML shell, mounts #root
├── vite.config.ts              # @vitejs/plugin-react only
├── tailwind.config.js          # class dark mode, content globs, slow bounce keyframe
├── postcss.config.js
├── eslint.config.js            # flat config: JS, typescript-eslint, react-hooks, react-refresh
├── package.json
├── public/
│   └── vite.svg
└── src/
    ├── main.tsx                # React root, Redux Provider, BrowserRouter
    ├── App.tsx                 # Routes, theme class, initial language
    ├── i18n.ts                 # Locale resources and language detector
    ├── index.css
    ├── languages/              # en, ar, fr, de, es, zh, ita
    ├── pages/                  # One screen per route
    ├── Layout/                 # Signed-in shell (index.tsx) and Sidebar.tsx
    ├── components/
    │   ├── Header.tsx          # Account menu, notifications, mobile nav
    │   └── ui/                 # Button, avatar, badge, card, dropdown-menu, toast
    ├── store/                  # auth, user, missions, theme
    ├── hooks/                  # useTheme, useAuth, useCurrency
    ├── config/axiosConfig.ts   # Axios instance, bearer token, refresh on 401
    ├── validation/             # Yup auth schemas and ProtectedRoute
    ├── lib/                    # query client, currency service, cn(), authUtils
    ├── interfaces/
    └── assets/react.svg
```

The Redux store registers `auth`, `theme`, `user`, and `missions`. `src/store/settingsSlice.ts` is present in the tree and is not passed to `configureStore`. Theme changes go through `themeSlice`.

## Screenshots

<!-- TODO: Add screenshots of login, the dashboard, deposits, missions, and profile once image files are committed (for example under docs/screenshots/). The repository only contains public/vite.svg and src/assets/react.svg, the default Vite starter assets, so no product screenshots are embedded. -->

## Related

- Companion repository: [https://github.com/KareemRagabAbdelhameed/Neurovox](https://github.com/KareemRagabAbdelhameed/Neurovox)
