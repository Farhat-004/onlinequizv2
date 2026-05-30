## OnlineQuiz (eExam)

Full-stack quiz/exam platform built with Next.js App Router, Auth.js/NextAuth v5, and MongoDB.
Teachers create timed exams and share a join code; students join, attempt, submit, and view results. A single account can have both `teacher` and `student` roles with an active-role switcher.

### Tech stack

- Next.js `16.2.2` (App Router)
- Auth.js / NextAuth `v5 beta` (`next-auth`)
- MongoDB (native driver for Auth adapter) + Mongoose (app models)
- React `19`
- Tailwind CSS `v4`

### Core features

- Credentials auth + Google OAuth2 (Google sign-ins are linked to existing users by email)
- Role-aware dashboards (`teacher` / `student`) with role switching for dual-role accounts
- Exam creation: title, password, duration, marks, start/end windows, MCQ questions
- Join-by-code flow for students (join code + exam password)
- Teacher results view (participant list + score summary)

## Getting started

### Prerequisites

- Node.js (recommended: current LTS)
- MongoDB running locally or a hosted MongoDB URI

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create/update `.env` at the project root:

```bash
# Mongo
MONGODB_URI=PUT_A_MONGO_CONNECTION_STRING
# Optional (used by Mongoose connect helper; falls back to MONGODB_URI)
# MONGODB_CONNECTION_STRING=mongodb://localhost:27017/quizdb

# Auth.js / NextAuth (required)
AUTH_SECRET=replace-with-a-long-random-string

# Google OAuth (optional, for Google sign-in)
AUTH_GOOGLE_ID=put-google-client-id
AUTH_GOOGLE_SECRET=put-google-client-secret
```

Notes:

- `MONGODB_URI` is required (used by the MongoDB adapter and role lookups).
- Use a strong `AUTH_SECRET` in production.

### 3) Run the app

```bash
npm run dev
```

App runs on `http://localhost:3000`.

## How auth works (high level)

- Auth configuration lives in `auth.ts`.
- NextAuth route handler is mounted at `app/api/auth/[...nextauth]/route.ts`.
- Credentials sign-in validates password hashes (scrypt) and auto-migrates legacy plaintext passwords on successful login.
- Google OAuth is configured to link to an existing account with the same email.

## Data model (MongoDB)

Mongoose models live in `models/`:

- `User` (`models/UserModel.js`): name, email, password, role/roles, activeRole, image
- `Exam` (`models/ExamModel.js`): teacher `userId`, joinCode, password, timing, questions
- `Result` (`models/ResultModel.js`): studentId, examinerId, examId, score, answers, submittedAt

## Key routes

UI (App Router):

- `app/signin` / `app/signup`
- `app/create-quiz` (teacher)
- `app/quiz` (student attempt)
- `app/dashboard` (teacher/student dashboard based on active role)

API (App Router route handlers):

- `app/api/auth/[...nextauth]` (NextAuth)
- `app/api/register` (sign up)
- `app/api/teacher/exams/[examId]/results` (teacher results)

## Development notes

- This repo uses both the MongoDB native driver and Mongoose. Mongoose models must be imported in routes that use `populate()` so schemas are registered.
- `npm run lint` currently reports pre-existing `no-explicit-any` violations in parts of the codebase.

## Scripts

- `npm run dev` – start development server
- `npm run build` – production build
- `npm run start` – start production server
- `npm run lint` – run ESLint

## Production checklist (recommended)

- Set a strong `AUTH_SECRET` and keep it private
- Use a real MongoDB deployment (Atlas, etc.)
- Configure Google OAuth authorized redirect URIs for your domain
- Set `NODE_ENV=production` for secure cookies + production behavior
