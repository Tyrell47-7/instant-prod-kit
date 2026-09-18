# 🧠 AI Workplace Productivity Assistant

**A modern, AI-powered dashboard that helps professionals automate everyday workplace tasks.**
---
## 📖 Overview

**AI Workplace Productivity Assistant** is a responsive, SaaS-style web application that helps professionals automate common workplace tasks using AI. It brings together an email generator, a meeting notes summarizer, and an AI chatbot in one clean, easy-to-navigate dashboard.

> ⚠️ This is a **frontend-only** application — there is no backend, database, or authentication layer. All data exists only for the current browser session and is never stored or persisted.

---

## ✨ Features

### 📧 Smart Email Generator
- Generates professional email drafts from recipient context, purpose, and key points
- Choose from three tones: **Formal**, **Friendly**, or **Persuasive**
- Outputs a subject line and body — fully editable before use

### 📝 Meeting Notes Summarizer
- Paste raw, unstructured meeting notes
- Get a clear, structured summary broken into:
  - ✅ Action Items
  - 📌 Decisions Made
  - ⏰ Deadlines
- Fully editable output

### 💬 AI Chatbot Interface
- Conversational AI assistant for general workplace questions and tasks
- Chat-style UI with session-based message history

### ⚙️ Core Functionality
- Sidebar navigation across all tools
- Fully responsive design (mobile, tablet, desktop)
- All AI-generated outputs are editable
- Structured, purpose-built prompts behind each feature
- Visible Responsible AI disclaimer throughout the app

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Frontend Framework | React |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui *(or equivalent, depending on build)* |
| Platform | [Lovable](https://lovable.dev) |
| Backend / Database | None — client-side only |

---

## 🚀 Getting Started

### Option 1 — Run via Lovable
1. Open the project in your Lovable workspace
2. Use the built-in preview to interact with the app in-browser
3. Publish/deploy directly from Lovable when ready

### Option 2 — Run Locally

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-workplace-productivity-assistant

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open **http://localhost:5173** (or the port shown in your terminal).

> 💡 No environment variables, API keys, or database setup are required — the app runs entirely client-side. If AI responses are wired to an external API rather than mocked, check the relevant component files before deploying.

---

## ⚠️ Responsible AI Disclaimer

This application generates AI-assisted content. All outputs (emails, summaries, chat responses) should be **reviewed and edited by the user** before being used or shared, as AI-generated content may contain inaccuracies.

---

## 👤 Author

**Tyrell**
