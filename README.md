# 🛡️ CyberEvolution AI — Cyber Attack Pattern Evolution Model

> AI-powered platform for predicting and visualizing the evolution of cyber attack patterns using time-series analysis.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)
![Tambo AI](https://img.shields.io/badge/Tambo_AI-Generative_UI-cyan?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.10+-green?style=flat-square&logo=python)

---

## 🌍 The Problem

Cyber attacks evolve over time. Traditional static threat intelligence can't keep up with:
- **AI-powered attacks** growing at 340%+ annually
- **Supply chain compromises** becoming increasingly sophisticated
- **Attack convergence** where multiple techniques merge into new threats
- **Rapid mutation** of attack patterns that evade detection systems

## 🤖 The Solution

**CyberEvolution AI** uses a time-series prediction model to:

1. **Predict New Attack Patterns** — Forecast emerging threats before they become widespread
2. **Track Threat Evolution** — Visualize how attacks branch, mutate, and converge over time
3. **Assess Sector Risk** — Industry-specific risk scoring and vulnerability analysis
4. **Map to MITRE ATT&CK** — Connect predictions to the ATT&CK framework for actionable defense
5. **AI Chat Assistant** — Natural language interface powered by Tambo generative UI

---

## 🚀 Features

### 📊 Dashboard Views
| View | Description |
|------|-------------|
| **AI Assistant** | Tambo-powered chat that renders rich visualizations inline |
| **Dashboard** | High-level threat metrics with key indicators |
| **Attack Timeline** | 24-month time-series trend analysis across 10 categories |
| **Predictions** | AI model forecasts with confidence scores and recommendations |
| **Evolution Tree** | Visual lineage of how threats branched and evolved |
| **Attack Patterns** | Detailed intel on tracked attack patterns with MITRE mapping |
| **Severity Distribution** | Pie chart breakdown of threat severity levels |
| **MITRE ATT&CK** | Tactic distribution across observed attacks |
| **Sector Risks** | Industry risk scores with trend indicators |
| **Global Threats** | Regional threat intelligence with incident counts |

### 🧠 AI-Powered Chat (Tambo)
Ask natural language questions and get rich, interactive visualizations:
- *"Show me the threat evolution dashboard"*
- *"What are the top predicted attack trends?"*
- *"Which industries are most at risk?"*
- *"Tell me about LLM-powered spear phishing"*
- *"Show the global threat landscape"*

### 🔬 ML Model (Python)
The backend Python model provides:
- Ensemble time-series forecasting (ARIMA + LSTM + Prophet architecture)
- Evolution event detection (variants, convergence, divergence)
- Confidence-scored predictions with risk-level classification
- Exportable threat landscape summaries

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS |
| **AI Chat** | [Tambo AI](https://tambo.co/) — Generative UI for React |
| **UI Components** | Inspired by [21st.dev](https://21st.dev/) community components |
| **Visualization** | Recharts, custom cyber-themed components |
| **Icons** | Lucide React |
| **ML Backend** | Python (standalone prediction engine) |

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Python 3.10+ (for ML model)

### 1. Install Dependencies

```bash
cd cyber-attack-evolution
npm install
```

### 2. Configure Tambo API Key

Get a free API key from [console.tambo.co](https://console.tambo.co/):

```bash
# Edit .env.local
NEXT_PUBLIC_TAMBO_API_KEY=your_api_key_here
```

### 3. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run the Python ML Model (Optional)

```bash
cd ml-model
python cyber_evolution_model.py
```

This generates predictions and exports to `threat_analysis_output.json`.

---

## 📁 Project Structure

```
cyber-attack-evolution/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main app with TamboProvider
│   │   └── globals.css         # Dark cyber theme styles
│   ├── components/
│   │   ├── cyber/
│   │   │   ├── threat-timeline-chart.tsx    # Time-series area chart
│   │   │   ├── attack-prediction-card.tsx   # AI prediction cards
│   │   │   ├── threat-evolution-tree.tsx    # Evolution lineage tree
│   │   │   ├── attack-pattern-detail.tsx    # Detailed pattern view
│   │   │   ├── severity-pie-chart.tsx       # Severity distribution
│   │   │   ├── mitre-tactic-chart.tsx       # MITRE ATT&CK bars
│   │   │   ├── sector-risk-table.tsx        # Sector risk table
│   │   │   ├── global-threat-map.tsx        # Global threat cards
│   │   │   └── threat-summary-dashboard.tsx # Overview dashboard
│   │   ├── cyber-chat.tsx       # Tambo AI chat interface
│   │   ├── sidebar.tsx          # Navigation sidebar
│   │   └── dashboard-content.tsx # Dashboard view router
│   └── lib/
│       ├── cyber-data.ts        # Attack pattern data engine
│       ├── tambo-config.ts      # Tambo component/tool registry
│       └── utils.ts             # Utility functions
├── ml-model/
│   └── cyber_evolution_model.py # Python ML prediction engine
├── .env.local                   # API keys (not committed)
└── README.md
```

---

## 🔐 Attack Categories Tracked

| Category | Growth Rate | Risk Level |
|----------|------------|------------|
| AI-Powered Attacks | +340% | 🔴 Critical |
| Supply Chain | +185% | 🔴 Critical |
| IoT Exploits | +210% | 🟠 High |
| Ransomware (RaaS v4) | +67% | 🟠 High |
| APT Campaigns | +45% | 🟠 High |
| Deepfake Social Engineering | +280% | 🟠 High |
| Phishing | +22% | 🟡 Medium |
| DDoS | +12% | 🟡 Medium |
| Cryptojacking | -15% | 🟢 Low |

---

## 💡 How It Works

1. **Data Collection** — Historical attack frequency data across 10 categories over 24 months
2. **Time-Series Analysis** — Pattern detection including trend, seasonality, and anomalies
3. **Prediction** — Ensemble model forecasts 6-month attack frequency and severity
4. **Evolution Detection** — Identifies mutation, convergence, and divergence events
5. **Visualization** — Rich, interactive dashboards with Tambo AI chat interface
6. **Recommendations** — Category-specific defensive recommendations based on predictions

---

## 📝 License

MIT License — Built for cybersecurity research and education.
