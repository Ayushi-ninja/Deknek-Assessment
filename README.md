# AI-Powered 3D Model Marketplace built for DekNek 3D

A full-stack web application that lets users browse, preview, and request custom 3D models — powered by AI search and an interactive in-browser 3D viewer.


## 🚀 Features

*   **🔐 Authentication** — Secure email/password login & signup via Supabase Auth
*   **🤖 AI-Powered Search** — Natural language search using Claude API (e.g. "Show me a fantasy dragon under ₹500")
*   **🎮 Interactive 3D Viewer** — Rotate, zoom, and inspect .glb models directly in the browser via React Three Fiber
*   **📦 Model Marketplace** — Browse models with category filters, price range, and tag-based discovery
*   **🛠️ Custom Order System** — Submit text descriptions or reference images to request a fully custom 3D model
*   **📊 Customer Dashboard** — Track purchases, monitor custom request statuses in real time
*   **🧑‍💼 Admin Panel** — Upload models, manage listings, update custom order statuses with notes
*   **📱 Fully Responsive** — Optimized for all screen sizes from mobile to desktop

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router + TypeScript) |
| **Database & Auth** | Supabase (Postgres + Storage + Auth) |
| **AI Search** | Anthropic Claude API |
| **3D Rendering** | React Three Fiber + Drei |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Deployment** | Vercel |

## 📁 Project Structure

```text
app/               → All pages (landing, login, dashboard, models, admin)
components/        → Reusable UI components
lib/               → Supabase + Claude API clients
types/             → TypeScript interfaces
app/api/           → Server-side API routes (AI search)
```

## ⚙️ Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/deknek-3d-marketplace
cd deknek-3d-marketplace

# Install dependencies
npm install

# Add environment variables
cp .env.example .env.local
# Fill in your Supabase and Anthropic API keys

# Run locally
npm run dev
```

## 🔑 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_claude_api_key
```

## 🌐 Live Demo

https://deknek-assessment.vercel.app/

## 📸 Screenshots

  <img width="1909" height="925" alt="image" src="https://github.com/user-attachments/assets/a42f2690-7f80-4830-aea8-886f6f24cf61" />
  <img width="1913" height="921" alt="image" src="https://github.com/user-attachments/assets/9403445c-a855-415e-9222-1a9ada6aab10" />
  <img width="1898" height="912" alt="image" src="https://github.com/user-attachments/assets/31018f81-46a4-4187-9d08-58f33cf4f3fa" />




## 👤 Built By

Made with ❤️ as a Round 2 Assessment submission for DekNek 3D — demonstrating full-stack capability, AI integration, and product thinking aligned with DekNek's vision of "Imagination to Reality"
