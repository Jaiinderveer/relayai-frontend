# RelayAI — Frontend

The React frontend for **RelayAI**, an agentic task-delegation platform. The interface lets users delegate tasks through a chat-driven workflow and monitor calls, contacts, and analytics from a unified dashboard.

## Features

- **Agentic Chat** — describe a task in natural language and send it to the RelayAI backend
- **Quick Presets** — shortcuts for common actions such as scheduling meetings, calling contacts, and querying pending tasks
- **Voice Input** — browser voice dictation support where available
- **Live Monitor** — dedicated UI for monitoring ongoing activity and calls
- **Analytics** — view application-level activity and performance information
- **Contacts** — manage the contacts used by delegation and calling workflows
- Markdown-friendly assistant responses
- Client-side routing and shared application state

## Tech Stack

- React 19
- Vite
- React Router
- Tailwind CSS 4
- Axios
- Zustand
- React Markdown
- Lucide React

## Application Routes

| Route | Purpose |
| --- | --- |
| `/chat` | Agentic task delegation and conversation |
| `/monitor` | Live activity/call monitoring |
| `/analytics` | Analytics dashboard |
| `/contacts` | Contact management |

## Run Locally

```bash
git clone https://github.com/Jaiinderveer/relayai-frontend.git
cd relayai-frontend
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```text
.
├── src/
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Shared React hooks, including voice input
│   ├── layouts/      # Application shell/layout
│   ├── pages/        # Chat, monitor, analytics and contacts screens
│   ├── services/     # Backend API clients
│   ├── stores/       # Zustand application state
│   └── App.jsx       # Application routes
├── public/           # Static assets
├── index.html
├── vite.config.js
└── package.json
```

## Backend

This frontend is designed to work with the companion [RelayAI Backend](https://github.com/Jaiinderveer/relayai-backend), which exposes the chat, calling, analytics, and contacts APIs.

## Environment

Configure the API base URL using the environment variables expected by the API service layer in `src/services/` for your local or deployed backend.

## Status

This repository is an actively developed application frontend rather than a Vite starter template.
