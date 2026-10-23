# ResumeIQ — Resume Analyzer & Career Assistant
LIVE DEMO -- https://resume-iq-resume-analyzer-career-as.vercel.app/
<img width="1897" height="925" alt="image" src="https://github.com/user-attachments/assets/2129062d-934f-44d6-82d4-b0db516c365f" />


ResumeIQ is a MERN stack web application that helps users analyze their resumes, improve their content, and create professional resumes.

## Main Features

<img width="1912" height="922" alt="image" src="https://github.com/user-attachments/assets/ef510237-afb7-4337-a326-5852042d84d5" />


* **User Authentication:** Register, log in, and log out.
* **Resume Upload:** Upload PDF and DOCX resumes.
* **Resume Analysis:** Analyze resumes and provide scores and suggestions.
* **Dashboard:** View resume statistics and previous analyses.
* **Resume History:** Search, sort, and delete previous analyses.
* **Resume Builder:** Create resumes using four templates, customize colors and text, and download them as PDF.
* **Resume Management:** Save and manage multiple resumes.
<img width="1917" height="922" alt="image" src="https://github.com/user-attachments/assets/14046a0a-316b-41cc-a671-f4f04e9572a0" />


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
