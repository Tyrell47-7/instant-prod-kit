# AI Workplace Buddy

Build a modern, responsive frontend-only web app called "AI Workplace Productivity Assistant" — a SaaS-style dashboard for professionals to automate workplace tasks using AI. No backend, no database, no data persistence — everything runs client-side in the current session only.

Layout:

Sidebar navigation (collapsible on mobile) with 3 sections: Email Generator, Meeting Notes Summarizer, AI Chatbot

Clean dashboard shell: top header with app name/logo, main content area per section

Modern, professional SaaS aesthetic — neutral palette, generous whitespace, card-based layout, subtle shadows, rounded corners

Fully responsive (mobile, tablet, desktop)

Feature 1 — Smart Email Generator

Input fields: recipient context, purpose/topic, key points

Tone selector: Formal / Friendly / Persuasive

"Generate" button produces a structured draft email (subject + body)

Output shown in an editable text box so the user can tweak it

Feature 2 — Meeting Notes Summarizer

Large textarea for pasting raw meeting notes

"Summarize" button outputs: a short summary, a bulleted list of Action Items, Decisions Made, and Deadlines (clearly separated sections)

Output editable

Feature 3 — AI Chatbot Interface

Simple chat UI (message bubbles, input box, send button)

Acts as a general workplace assistant responding to user prompts

Scrollable conversation history (session-only, not persisted)

Cross-cutting requirements:

All AI outputs must be editable by the user before use

Use structured, well-defined prompts internally for each AI feature (not free-form)

Include a visible "Responsible AI" disclaimer (e.g., footer note or modal) stating outputs should be reviewed before use and may contain errors

No login/auth, no backend, no data storage — purely functional UI demo

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://instant-prod-kit.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8bfed9f5-d71c-483d-9b1b-a92e05f15265).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
