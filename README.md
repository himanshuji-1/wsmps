WSMPS – Web-based Symptom-to-Medicine Prescribing System

A fast, simple MERN project that lets users record symptoms and get medicine suggestions via rules or optional LLMs (Gemini/DeepSeek). Doctors can finalize prescriptions and download a PDF.

✨ Features

Auth (JWT): Register/Login (patient/doctor/admin)

Symptoms: Save symptom records with severity, duration, age, allergies, current meds

Suggestions:

Rule-engine matches indications → suggested medicines

Optional LLM (Gemini/DeepSeek) to enrich suggestions

Prescription PDF: Doctors finalize and get a signed PDF

Frontend: React + Vite + Tailwind; simple dashboard flow

Seed data: Preload common medicines for testing

🧱 Tech Stack

Frontend: React, Vite, Tailwind, React Router, Axios

Backend: Node, Express, Mongoose, JWT, PDFKit, dotenv

Database: MongoDB (Atlas or local/Docker)

Optional AI: Gemini / DeepSeek (server-side only)

📁 Project Structure
WSMPS/
├─ backend/
│  ├─ src/
│  │  ├─ models/          # User, Symptom, Medicine, Prescription
│  │  ├─ routes/          # auth, symptoms, suggestions, prescriptions
│  │  ├─ utils/           # ruleEngine, llmClient, generatePDF
│  │  ├─ index.js         # express app + db connect
│  │  └─ middleware.js    # auth/role/error middlewares
│  ├─ .env.example
│  ├─ package.json
│  └─ seed.js
└─ frontend/
   ├─ src/
   │  ├─ api/api.js
   │  ├─ pages/           # Login, Register, Dashboard
   │  ├─ App.jsx, main.jsx, index.css
   ├─ vite.config.mjs
   ├─ .env.example
   └─ package.json

⚙️ Environment Variables
backend/.env
PORT=4000
MONGO_URI=mongodb+srv://<DB_USER>:<DB_PASS>@<CLUSTER>/<DB_NAME>?retryWrites=true&w=majority
JWT_SECRET=<RANDOM_STRING>
# Optional AI keys (add only if using LLM mode)
GEMINI_API_KEY=
DEEPSEEK_API_KEY=
CORS_ORIGIN=http://localhost:5173


⚠️ Never commit .env. Keep secrets out of Git. Add a public .env.example with empty values.

frontend/.env
VITE_API_URL=http://localhost:4000

🚀 Run Locally
1) Backend
cd backend
npm install
# (Optional) seed medicines
npm run seed
npm run dev


You should see:

✅ MongoDB Connected
🚀 Server running on port 4000

2) Frontend
cd frontend
npm install
npm run dev


Open: http://localhost:5173

🧪 Quick Test Flow

Register a user (patient) → Login → token is stored in localStorage.

Submit symptoms (e.g., “fever, body ache”) → record ID created.

Get suggestions: uses rule engine by default.

For AI suggestions, set useLLM: true (requires valid key in backend .env).

Doctor logs in → finalize prescription → receive PDF (base64 from API; UI can be added to download).

📡 API Endpoints (summary)

Base URL: http://localhost:4000

Auth

POST /auth/register — { name, email, password, role }

POST /auth/login — { email, password } → { token, user }

Symptoms (JWT required)

POST /symptoms — create symptom record
Body: { symptoms[], severity, duration, age, allergies[], currentMedications[] }

GET /symptoms/patient/:id — list patient’s records

Suggestions (JWT required)

POST /suggestions
Body: { symptomRecordId: "<id>", useLLM: false|true }
Returns: { suggestions: [{ name, score, blocked, flags[], reasons[] }] }

Prescriptions (JWT + doctor)

POST /prescriptions/finalize
Body: { symptomRecordId, medicines: [{ name, dose, notes }] }
Returns: { prescription, pdfBase64 }


🧠 AI Integration

Backend checks keys in .env:

If DEEPSEEK_API_KEY present → uses DeepSeek

Else if GEMINI_API_KEY present → uses Gemini

Else → only rule engine is used

Call with useLLM: true to include AI candidates.

☁️ Deployment Notes

Frontend (Vercel/Netlify):

Set VITE_API_URL to your backend URL in project settings.

Backend (Render/Railway/Heroku/Vercel functions):

Add env vars from .env

Ensure IP access (if Mongo Atlas) is allowed

Use a production JWT_SECRET


🔐 Security

JWT tokens expire in 1 day (configurable)

Do not store API keys on the client

Validate/escape any user-provided text used in PDFs


🧭 Roadmap / Future Work

Admin dashboard for medicines CRUD

Better contraindication/interaction knowledge base

Full prescription UI with PDF download

Role-based UI (doctor vs patient)

Unit/integration tests


📝 License

MIT — feel free to use/modify with attribution.


🆘 Common Fixes

Frontend “plugin-react ESM” error: rename vite.config.js → vite.config.mjs.

Mongo ECONNREFUSED: use a valid MONGO_URI (Atlas) or run local Mongo (Docker).

401 on protected routes: ensure localStorage.token exists and Axios adds Authorization: Bearer <token>.
