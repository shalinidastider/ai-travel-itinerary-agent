# ✈️ AI Travel Itinerary Agent

> Turn your travel preferences (budget, vibe, dates) into a day‑by‑day itinerary with costs and must‑do experiences — powered by a multi‑step AI agent workflow.

---

## 🎯 What Is This?

An AI-powered trip planner that uses **Google Gemini** through a team of specialized agents:

| Agent                | Role                                                                    |
| -------------------- | ----------------------------------------------------------------------- |
| **Preference Agent** | Normalizes your input into a structured trip profile                    |
| **Research Agent**   | Discovers activities, food spots, and experiences for your destination  |
| **Itinerary Agent**  | Packs activities into day-by-day morning/afternoon/evening blocks       |
| **Refine Agent**     | Applies your feedback ("more food, less museums") without starting over |

The agent pipeline is **visible in the UI** via the Agent Log sidebar, so you can see exactly what each step produces.

---

## 🛠 Tech Stack

| Layer     | Technology                                                        |
| --------- | ----------------------------------------------------------------- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, TypeScript)        |
| UI        | [Material UI](https://mui.com/) with custom dark theme            |
| AI        | [Google Gemini 2.0 Flash](https://ai.google.dev/)                 |
| Styling   | MUI + vanilla CSS                                                 |
| Font      | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |

---

## 📂 Project Structure

```
ai-travel-itinerary-agent/
├── docs/
│   └── WALKTHROUGH.md          # Detailed architecture walkthrough
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/
│   │   │   ├── plan-trip/      # POST — full 3-agent pipeline
│   │   │   ├── refine-trip/    # POST — apply feedback to itinerary
│   │   │   └── regenerate-day/ # POST — regenerate a single day
│   │   ├── globals.css
│   │   ├── layout.tsx          # Root layout (theme, fonts)
│   │   └── page.tsx            # Entry point
│   ├── components/
│   │   ├── features/
│   │   │   ├── export/         # ExportPanel (copy text/markdown, print)
│   │   │   ├── itinerary/      # ItineraryView, ActivityCard
│   │   │   └── trip/           # TripForm, AgentStepper
│   │   ├── layout/             # HomePage (main page assembly)
│   │   └── providers/          # ThemeRegistry, TripContext
│   ├── lib/
│   │   ├── agents.ts           # Gemini agent orchestration
│   │   ├── mock-data.ts        # Fallback demo itinerary
│   │   ├── prompts.ts          # Prompt templates per agent
│   │   └── types.ts            # TypeScript interfaces
│   └── theme/
│       └── theme.ts            # MUI dark theme configuration
├── .env.example                # Template for environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- (Optional) A [Google Gemini API key](https://aistudio.google.com/apikey) for live AI features

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/ai-travel-itinerary-agent.git
cd ai-travel-itinerary-agent
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Gemini API key:

```
GEMINI_API_KEY=your-gemini-api-key-here
```

> **Without an API key**, the app still works — it falls back to a sample 3-day Tokyo itinerary so you can explore the full UI.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production (optional)

```bash
npm run build
npm start
```

---

## 🌐 Deploying to Vercel

### TODO: Deployment Checklist

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI Travel Itinerary Agent"
   git remote add origin https://github.com/YOUR_USERNAME/ai-travel-itinerary-agent.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel auto-detects Next.js — no special build settings needed

3. **Add environment variables in Vercel**
   - In the Vercel dashboard → Project Settings → Environment Variables
   - Add `GEMINI_API_KEY` with your API key
   - Make sure it's set for **Production**, **Preview**, and **Development**

4. **Deploy**
   - Vercel auto-deploys on every push to `main`
   - Your app will be live at `your-project.vercel.app`

5. **Custom domain (optional)**
   - In Vercel dashboard → Domains → Add your custom domain
   - Follow DNS instructions provided by Vercel

---

## 🎨 Features

### Screen A: Trip Setup

- Free-form text prompt + guided form fields
- Destination(s), dates, budget slider ($100–$10,000)
- Travel style chips: Foodie, Nature, Nightlife, Family, Culture
- Pace selector: Chill / Balanced / Packed
- Advanced preferences: dietary, walking tolerance, must-see items

### Screen B: Itinerary View

- Summary banner with destination, dates, total cost, and theme chips
- Day-by-day accordion (Day 1, Day 2, ...)
- Morning / Afternoon / Evening activity blocks
- Activity cards with category icons, cost, duration, neighborhood, tags
- **"Regenerate Day"** button per day
- **"Refine Trip"** feedback input (e.g., "more food, less museums")
- **Agent Log** sidebar showing the pipeline steps

### Screen C: Export & Share

- Copy as plain text
- Copy as Markdown (for Notion/docs)
- Print-friendly view

---

## 📖 Further Reading

- [docs/WALKTHROUGH.md](docs/WALKTHROUGH.md) — Detailed architecture walkthrough with diagrams and verification results

---

## 📄 License

MIT
