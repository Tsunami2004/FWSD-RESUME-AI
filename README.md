# PrepFocus — AI-Powered Interview Preparation

PrepFocus analyzes a job description and your resume (or self-description) to generate a personalized interview strategy — including technical questions, behavioral questions, skill gap analysis, a match score, and a day-wise preparation roadmap.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router, Axios, SCSS |
| Backend | Node.js, Express 5, MongoDB (Mongoose) |
| AI | Google Gemini API (`@google/genai`) |
| Auth | JWT (stored in HTTP-only cookies) |
| File Handling | Multer (memory storage), pdf-parse v2 |
| PDF Generation | Puppeteer |

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works)
- A [Google AI Studio](https://aistudio.google.com/) account (free tier works)

---

## Step 1 — Get Your API Keys & Secrets

### 1.1 — MongoDB Connection String

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and sign in
2. Create a free cluster if you don't have one
3. Click **Connect** → **Drivers** → copy the connection string
4. Replace `<password>` with your database user's password
5. It looks like: `mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>`

### 1.2 — JWT Secret

Generate a strong random secret. Run this in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output — that's your `JWT_SECRET`.

### 1.3 — Google Gemini API Key

1. Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Click **Create API key**
3. Select or create a Google Cloud project
4. Copy the generated key — it starts with `AIza...`

> **Important:** Never commit this key to GitHub. The `.gitignore` already excludes `.env` files, but double-check before pushing.

---

## Step 2 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/prep-focus.git
cd prep-focus
```

---

## Step 3 — Configure the Backend

### 3.1 — Create the `.env` file

Navigate to the `Backend` folder and create a `.env` file:

```bash
cd Backend
```

Create a file named `.env` with the following content:

```env
MONGO_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_here
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
```

Replace each value with what you collected in Step 1.

### 3.2 — Install Backend Dependencies

```bash
npm install
```

### 3.3 — Start the Backend

```bash
npm run dev
```

The backend runs on **http://localhost:3000**

You should see:
```
Server is running on port 3000
Connected to MongoDB
```

---

## Step 4 — Configure the Frontend

Open a **new terminal** and navigate to the `Frontend` folder:

```bash
cd Frontend
```

### 4.1 — Install Frontend Dependencies

```bash
npm install
```

### 4.2 — Start the Frontend

```bash
npm run dev
```

The frontend runs on **http://localhost:5173**

---

## Step 5 — Open the App

With both servers running, open your browser and go to:

```
http://localhost:5173
```

Register an account, then start generating interview plans.

---

## Project Structure

```
prep-focus/
├── Backend/
│   ├── src/
│   │   ├── config/         # MongoDB connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middlewares/    # Auth + file upload middleware
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   └── services/       # Gemini AI + Puppeteer logic
│   ├── server.js
│   ├── package.json
│   └── .env                # ← YOU CREATE THIS (never commit)
│
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/       # Login, Register, Protected route
│   │   │   └── interview/  # Home, Interview pages, hooks, API
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## Uploading to GitHub Safely

Before pushing to GitHub, verify your `.env` is **not** being tracked:

```bash
git status
```

If `.env` appears in the list, run:

```bash
git rm --cached Backend/.env
```

Then commit and push. The `.gitignore` at the root already excludes all `.env` files so this should be automatic on a fresh clone.

> **Never share your `.env` file or paste its contents publicly.** If a key gets leaked, Google will automatically revoke it and your app will stop working.

---

## Environment Variables Reference

| Variable | Where to get it |
|----------|----------------|
| `MONGO_URL` | MongoDB Atlas → Connect → Drivers |
| `JWT_SECRET` | Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `GOOGLE_GENAI_API_KEY` | [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

---

## Common Issues

**500 Internal Server Error on report generation**
- Check your `GOOGLE_GENAI_API_KEY` is valid and not leaked
- Free tier has rate limits — wait a minute and try again

**403 Forbidden on API calls**
- Your session cookie expired — log out and log back in

**ERR_CONNECTION_REFUSED**
- The backend isn't running — start it with `npm run dev` in the `Backend` folder
