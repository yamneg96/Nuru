# 🌟 Nuru – Youth Life Navigation Platform

> **“Your life. Your choices. Your future.”**

Nuru is a **privacy-first, AI-assisted decision support platform** designed to help adolescents make safe, informed life decisions—especially around relationships, health, and future planning.

🚀 Built for impact in Ethiopia, Nuru combines:
- Anonymous guidance 🤫
- AI-powered support 🤖
- Structured decision flows 🧭
- Real-world service connections 🏥

---

# 🎯 Problem

Teenage pregnancy and risky life decisions are driven by:
- ❌ Lack of safe, private guidance  
- ❌ Fear of judgment and stigma  
- ❌ Limited access to youth-friendly services  
- ❌ Static, non-personalized information  

👉 Adolescents don’t just need information…  
They need **real-time decision support**.

---

# 💡 Solution

Nuru provides a **safe, anonymous digital space** where young people can:

✨ Ask sensitive questions without fear  
🧠 Navigate real-life situations through guided flows  
🤖 Receive AI-assisted, culturally relevant support  
📍 Access nearby youth-friendly health services  

> Nuru doesn’t replace existing systems—it **digitally extends their reach**.

---

# 🚀 Core Features

## 🤖 AI Assistant
- Anonymous chat experience
- Safe, non-judgmental responses
- Powered by Grok AI (via xAI)

---

## 🧭 Decision Flows
Structured guidance for real-life situations:
- “I missed my period”
- “I feel pressured in a relationship”
- “I want to avoid pregnancy”

👉 Step-by-step → Risk awareness → Actionable next steps

---

## 📚 Explore & Learn
- Bite-sized, youth-friendly content
- Topics:
  - Relationships ❤️
  - Health 🩺
  - Life skills 🌱
  - Myths vs Facts ❗

---

## 📍 Services & Help
- Discover youth-friendly clinics
- Location-based support (Google Maps)
- Direct connection to real services

---

## 🔐 Privacy First
- Google Sign-In (for verification) 🔑
- Immediate anonymization 🕶️
- No personal identity exposed

---

## 📊 Social Proof Metrics
- Users supported 👥
- Questions answered 💬
- Active engagement 📈

---

# 🏗️ Tech Stack

## 🎨 Frontend
- ⚛️ React + Vite + TypeScript
- 🎨 Tailwind CSS + shadcn/ui
- 🔄 TanStack Query
- 📡 Axios
- 🧠 Zustand

---

## ⚙️ Backend
- 🟢 Node.js + Express
- 🍃 MongoDB + Mongoose
- 🔐 JWT Authentication

---

## 🤖 AI Layer
- 🧠 Grok API (xAI)
- Prompt-engineered safety system

---

## 🗺️ Maps
- Google Maps API
- Services visualization

---

# 📁 Project Structure

```bash
nuru/
├── client/        # Frontend (React)
├── server/        # Backend (Express)
├── shared/        # Shared types/utilities
````

---

# 🔐 Authentication Flow

1. User signs in with Google
2. Backend verifies identity
3. Email is hashed 🔒
4. Anonymous ID is generated 🆔
5. User interacts **fully anonymously**

---

# 🧠 AI Safety Design

Nuru AI is designed to:

* ✅ Be supportive, not authoritative
* ✅ Avoid explicit or harmful content
* ✅ Encourage safe decisions
* ✅ Recommend real-world help when needed

---

# 📊 Impact Goals

🎯 Initial Target:

* Reach **5,000+ adolescents in 6 months**

📈 Expected Outcomes:

* Improved decision-making
* Increased access to youth-friendly services
* Reduction in risky behaviors

---

# 🧪 MVP Status

✅ Core UI/UX (Stitch AI)
✅ Auth system (Google OAuth)
✅ AI integration (Grok)
✅ Decision flows
🚧 Ongoing:

* Services expansion
* Localization (Amharic / Afaan Oromo)
* Performance optimization

---

# ⚙️ Getting Started

## 1️⃣ Clone the repo

```bash
git clone https://github.com/your-username/nuru.git
cd nuru
```

---

## 2️⃣ Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

## 3️⃣ Setup Backend

```bash
cd server
npm install
npm run dev
```

---

## 4️⃣ Environment Variables

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
```

---

### Backend (`.env`)

```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret

GOOGLE_CLIENT_ID=your_google_client_id
GROK_API_KEY=your_grok_api_key
```

---

# 🧩 Key API Endpoints

## Auth

* `POST /auth/google`
* `GET /auth/me`

## Chat

* `POST /chat/message`

## Decision

* `POST /decision/start`
* `POST /decision/step`
* `GET /decision/result`

## Metrics

* `GET /metrics/public`

## Services

* `GET /services`

---

# 🌍 Vision

To build a future where:

> Every young person can make informed, confident life decisions—without fear, stigma, or limitation.

---

# 🤝 Contributing

We welcome contributors passionate about:

* Youth empowerment 💪
* Health tech 🩺
* AI for social good 🤖
* African innovation 🌍

---

# 📜 License

MIT License © Nuru Project

---

# 💬 Final Note

Nuru is more than a product.

It’s a **decision support system for a generation**. 🌱✨