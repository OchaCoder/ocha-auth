# OchaAuth - 🍵 Smart Token-Based Authentication System

**_OchaAuth_** is a secure, lightweight authentication system built with Fastify (backend) and Qwik (frontend).  
It demonstrates professional-grade features such as real-time server health monitoring, structured error handling, secure token architecture, and thoughtful full-stack integration.

---

## ✨ Features

- **Authentication & Access**

  - Secure secret header-based backend access control
  - One-time-use-only Refresh Token model
  - Paseto token system (stronger alternative to JWT)
  - Refresh Tokens never exposed to the frontend — keyed only by browser ID

- **System Health Monitoring**

  - Real-time backend monitoring via Server-Sent Events (SSE)
    - Persistent health stream with automatic UI updates
    - A red modal for system down, a green modal for system back up
    - Instant system recovery/downtime detection
    - Safe JSON parsing and initial boot-check flag for graceful UX

- **Developer Tooling & Helpers**

  - Modular helper function suite (`runRedis`, `runPg`, etc.)
  - Structured error classes for system and user-level error management
  - Proactive health checking for Redis and Postgres
    - Emergency, Routine, and Special modes
  - Detailed system error logging with timestamps and latency

- **UI & UX**

  - Dark mode UI for enhanced user experience
  - Real-time system down/recovery modal with animation
  - Seamless modal routing with live fallback background
    - If users land on modal URLs (`/sign-in`, `/register`)
    - The live home page is still rendered underneath

- **Deployment-Ready Architecture**
  - Frontend/backend separation for independent scaling
  - SSR-friendly with Qwik + Fastify

---

## 🛡️ Security Highlights

- Header-based request filtering via custom Fastify plugin
- IP address and user-agent logging for suspicious access attempts
- Password hashing with Argon2 (resistant to brute-force)
- Secure cookie practices (`HttpOnly`, `Secure`, `SameSite=Strict`)
- Entirely CORS-free architecture by enforcing server-side fetches only — no cross-origin frontend requests
- Carefully staggered TTLs across tokens and Redis entries
- Server-side input validation at frontend (Qwik + Zod) and backend (Fastify + TypeBox)
- Server-side response validation at the frontend boundary (Qwik + TypeBox)
- Password reset via email flow using signed Paseto tokens and secure nanoid generation

---

## 🔬 SSE-Based Health Check Architecture

The frontend establishes a persistent connection to the `/health-events` route using **Server-Sent Events (SSE)**.  
This enables:

- **Live health status streaming**: Redis and Postgres health changes are reflected in real time.
- **Immediate connection check**: Users know whether the system is stable right when the app loads.
- **Graceful fallback**: If the connection drops, the UI gracefully detects backend downtime and displays a modal.
- **Efficient client cleanup**: SSE clients are deregistered on disconnect to prevent memory leaks.

---

## 🔥 Performance Optimizations

- One-round-trip token refresh and data fetch flow
- Redis caching for Refresh Token storage to minimize DB load
- Efficient frontend-side error feedback and SEO support

---

## 🏗️ Architecture Overview

- **Frontend**: [Qwik](https://qwik.builder.io/)
- **Backend**: [Fastify](https://fastify.dev/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Cache**: [Redis](https://redis.io/)
- **Token System**: [Paseto](https://paseto.io/)
- **Hashing**: [Argon2](https://github.com/P-H-C/phc-winner-argon2)

---

## 🫵 Running Locally

- Please make sure to keep your `.env` file out of Git!
- This project uses environment variables for tokens, database credentials, and more.
- To help setting up environment variables, `.env.example` is provided.

---

## 🌱 Future Improvements

- Full OpenAPI documentation integration
- Predefined token rotation engine based on static shared sequences
- Rate limiting and blacklisting for suspicious access attempts
- Optional email verification flow with expiry timers

---

## 🫶🏻 Acknowledgments

This project was created with a focus on building clean, responsible backend architecture, and learning the **realistic balance** between security, complexity, and performance.

---
