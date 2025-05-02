# OchaAuth 🍵 - Secure Authentication System

**OchaAuth** is a modern, secure authentication system built with [Qwik](https://qwik.builder.io/) (frontend) and [Fastify](https://fastify.dev/) (backend). It powers user signup, login, logout, and password reset with a focus on security, performance, and clean code. Perfect for web apps needing reliable auth!

🚀 **Live Demo**: [Insert Live Link Here]  
📸 **Screenshots**: [Insert Link or Embed Image of UI]

---

## ✨ Why OchaAuth?

- **Secure & Modern**: Uses [Paseto](https://paseto.io/) tokens (safer than JWT) and [Argon2](https://github.com) for password hashing.
- **Server-Side Magic**: All requests are server-side (via Qwik’s `server$()`), skipping CORS and boosting security.
- **Real-Time Health Checks**: Monitors backend health with Server-Sent Events, showing users a friendly modal if the system’s down.
- **Smooth UX**: Dark mode, animated modals, and seamless routing for a polished experience.
- **Type-Safe**: [TypeBox](https://github.com/sinclairzx81/typebox) (backend) and [Zod](https://zod.dev/) (frontend) ensure robust validation.
- **Password Reset**: Secure email-based reset flow with signed Paseto tokens.

---

## 🛡️ How It Works

1. **Signup/Login**: Users register or log in with email/password. Paseto tokens (access/refresh) are issued, stored securely in Redis.
2. **Refresh Tokens**: One-time-use refresh tokens, never exposed to the frontend, tied to browser ID.
3. **Health Monitoring**: Real-time Redis/Postgres checks via SSE, with UI alerts for downtime.
4. **Error Handling**: Structured error classes and logs for easy debugging.
5. **Deployment-Ready**: Separate frontend/backend for easy scaling, hosted on [Netlify](https://www.netlify.com/) and [Render](https://render.com/).

---

## 🛠️ Tech Stack

- **Frontend**: Qwik (server-first, resumable)
- **Backend**: Fastify (lightweight, fast)
- **Database**: PostgreSQL (via [Neon](https://neon.tech/))
- **Cache**: Redis (via [Upstash](https://upstash.com/))
- **Tokens**: Paseto
- **Hashing**: Argon2

---

## 🏃‍♂️ Run It Locally

1. Clone the repo: `git clone [your-repo-url]`
2. Install dependencies: `cd ochaauth && npm install`
3. Copy `.env.example` to `.env` and fill in credentials (Postgres, Redis, etc.).
4. Start backend: `cd backend && npm run dev`
5. Start frontend: `cd frontend && npm run dev`
6. Open `http://localhost:3000` and test it out!

_Note_: Keep `.env` out of Git for security.

---

## 🚀 Why I Built This

I’m a self-taught dev passionate about secure, modern web apps. OchaAuth showcases my skills in full-stack development, security, and clean code. Want a reliable auth system for your project? Hire me at $15/hour! DM me on [X @yourhandle] or email [your.email@example.com].

---

## 🌱 What’s Next?

- Add OpenAPI docs for backend routes.
- Implement email verification for signups.
- Add rate-limiting for extra security.

---

## 🫶 Thanks

Built with ☕ and late nights to balance security, performance, and simplicity. Feedback welcome!
