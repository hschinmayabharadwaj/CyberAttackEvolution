# CyberEvolution AI — Cyber Attack Pattern Evolution Model

## Project Overview
- **Type**: Next.js 14 + TypeScript + Tailwind CSS
- **Purpose**: AI-powered cyber attack pattern evolution analysis platform
- **AI Integration**: Tambo AI for generative UI chat assistant
- **ML Backend**: Python time-series prediction model

## Architecture
- `src/app/` — Next.js App Router pages
- `src/components/cyber/` — Cybersecurity-specific visualization components
- `src/components/` — Layout and chat components
- `src/lib/` — Data engine, utilities, Tambo configuration
- `ml-model/` — Python ML prediction engine

## Key Dependencies
- `@tambo-ai/react` — AI-powered generative UI chat
- `recharts` — Data visualization charts
- `lucide-react` — Icon library
- `framer-motion` — Animations
- `zod` — Schema validation (used by Tambo for component props)

## Development
- Run `npm run dev` to start
- Tambo API key required in `.env.local`
- Python model can run standalone: `python ml-model/cyber_evolution_model.py`
