# Cyber Attack Evolution

Interactive threat-intelligence dashboard built with Next.js + Tambo AI, with an optional Python model for offline prediction output.

## What this project does

- Lets you explore cyber threat trends in multiple dashboard views (timeline, predictions, MITRE tactics, sectors, global map, and more).
- Provides an AI chat interface that can render visualization components directly in the conversation.
- Supports an optional Python model that reads historical data and exports `threat_analysis_output.json`.

## Quick start

### Prerequisites

- Node.js 18+
- npm
- Python 3.10+ (only if running the optional ML model)

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_TAMBO_API_KEY=your_api_key_here
```

Get a key from https://console.tambo.co/

### 3) Run the web app

```bash
npm run dev
```

Open http://localhost:3000

### 4) (Optional) Run the Python model

```bash
cd ml-model
python cyber_evolution_model.py
```

If `historical_attack_data.json` is not present, start from `historical_attack_data.template.json`.

## App flow (simple)

1. The UI loads in `src/app/page.tsx` and initializes `TamboProvider`.
2. `src/lib/tambo-config.ts` registers chat components and tools.
3. Tools fetch live/remote data when available, otherwise fall back to generated local data.
4. Dashboard and chat views render charts/tables from those tool outputs.
5. Optional Python run writes model summary data to `ml-model/threat_analysis_output.json`.

## Main scripts

- `npm run dev` — Start local development server
- `npm run build` — Create production build
- `npm run start` — Run production server
- `npm run lint` — Run ESLint

## Tech stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- AI UI: `@tambo-ai/react`
- Charts: Recharts
- Optional backend model: Python deterministic time-series baseline

## Project layout

```text
cyber-attack-evolution/
├── src/
│   ├── app/                 # Next.js app shell
│   ├── components/          # Sidebar, chat, dashboard, cyber widgets
│   └── lib/                 # Data generators/fetchers + Tambo config
├── ml-model/                # Python model + configs + templates
├── public/
└── README.md
```

## License

MIT
