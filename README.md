# ResumeIQ

Resume analyzer and career assistant (MERN). **Status: Steps 1-4 written. The server and client have NOT been installed, run or integration-tested.**

## What exists
- `server/`: Express API with cookie auth (register, login, logout, me), PDF/DOCX upload and parsing, resume CRUD, structured extraction. Models: User, Resume.
- Analysis API (`/api/analysis`, `/api/dashboard/overview`) with saved history; pages for upload and analyze, results, history (search, sort, pagination, delete), and resumes.
- Resume builder (`/api/builder`): editor with 4 templates, accent color, text size, section visibility, entry reordering, live preview, save, and PDF via the browser print dialog (choose "Save as PDF"; text stays selectable).
- Client forms now call the real API; dashboard routes are protected.
- `server/services/analysisEngine.js`: explainable, rule-based scoring, with 5 unit tests. Not yet connected to any API.
- `client/`: Vite + React app with landing page, login/register (UI only), dashboard layout and routes.

## What does not exist yet
Analysis comparison, PDF report export, editing extracted fields, jobs, interviews, roadmap, history, settings, admin, PDF export, AI provider, API integration tests.

## Run the backend
```bash
cd server
npm install
cp .env.example .env   # set MONGODB_URI, JWT_SECRET (32+ chars), CLIENT_URL
npm run dev            # http://localhost:5000/api/health
```
For the client set `VITE_API_URL=http://localhost:5000/api`. In production, cross-site cookies use `SameSite=None; Secure`, so both sites must be HTTPS and `CLIENT_URL` must match the frontend origin exactly.

## Run the frontend
```bash
cd client
npm install
cp .env.example .env     # optional until Step 2
npm run dev              # http://localhost:5173
npm run build            # production build into client/dist
```

## Run the analysis engine tests (no install needed, Node 18+)
```bash
node --test server/tests/analysisEngine.test.js server/tests/resumeExtractor.test.js
```

## Deploy (frontend)
Vercel: root directory `client`, build `npm run build`, output `dist`. `vercel.json` provides the SPA fallback.

## Notes
- Landing-page dashboard and templates are labelled sample/layout previews, not real data.
- The scoring engine's score is guidance only, not an actual ATS score.
