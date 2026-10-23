# ResumeIQ — Resume Analyzer & Career Assistant

ResumeIQ is a MERN stack web application that helps users analyze their resumes, improve their content, and create professional resumes.

## Main Features

* **User Authentication:** Register, log in, and log out.
* **Resume Upload:** Upload PDF and DOCX resumes.
* **Resume Analysis:** Analyze resumes and provide scores and suggestions.
* **Dashboard:** View resume statistics and previous analyses.
* **Resume History:** Search, sort, and delete previous analyses.
* **Resume Builder:** Create resumes using four templates, customize colors and text, and download them as PDF.
* **Resume Management:** Save and manage multiple resumes.

## Technology Stack

* Frontend: React.js + Vite
* Backend: Node.js + Express.js
* Database: MongoDB
* Authentication: JWT + Cookies
* PDF/DOCX Parsing: Resume extraction libraries
* Styling: Normal CSS

## Current Status

The initial code has been written, but the frontend and backend have not yet been installed, run, or tested together.

### Not Implemented Yet

* Resume comparison.
* PDF analysis report download.
* Job recommendations.
* Interview preparation.
* Career roadmap.
* AI-powered analysis.
* Complete API integration testing.

## How to Run

**Backend:**

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Configure `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` in the server's `.env` file.

**Frontend:**

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL=http://localhost:5000/api` in the frontend `.env` file.

**Important:** Resume analysis currently uses rule-based scoring, not AI. Its score is an estimate for guidance and is not an official ATS score.
