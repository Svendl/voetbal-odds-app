# ⚽ Voetbal Odds Analyzer

AI-aangestuurde voetbal tips & odds analyse gebouwd met Next.js en Claude API.

## 🎯 Features

- 📅 **Wie voetbalt er vandaag?** - Alle wedstrijden van de dag
- 💰 **Beste odds vandaag** - AI-geanalyseerde top tips
- 🤖 **Claude AI Powered** - Intelligente analyse
- 🌍 **Multi-league** - La Liga, Premier League, Serie A, Bundesliga, Ligue 1, Eredivisie, MLS
- 📊 **Risicoclassificatie** - Laag/Gemiddeld/Hoog labels
- 🔒 **Veilig** - API key nooit zichtbaar in frontend

## 📋 Tech Stack

- **Frontend:** Next.js + React
- **Backend:** Next.js API Routes (Serverless)
- **AI:** Anthropic Claude API
- **Hosting:** Vercel (gratis)
- **Storage:** GitHub

## 🚀 Quick Start

### 1. Clone het Project

```bash
git clone https://github.com/svendl/voetbal-odds-app.git
cd voetbal-odds-app
```

### 2. Installeer Dependencies

```bash
npm install
```

### 3. Zet je API Key in

Open `.env.local` en zet je Claude API key:

```
CLAUDE_API_KEY=sk-ant-[JOUW-KEY-HIER]
```

### 4. Start Localhost

```bash
npm run dev
```

Open je browser: **http://localhost:3000**

### 5. Test het!

- Kies een competitie
- Klik "Wie voetbalt er vandaag?"
- Of klik "Beste odds vandaag" voor AI-tips

## 📁 Project Structuur

```
voetbal-odds-app/
├── api/
│   └── analyze-odds.js          # Backend API (Claude calls)
├── pages/
│   └── index.js                 # Frontend UI
├── package.json                 # Dependencies
├── vercel.json                  # Vercel config
├── .env.local                   # Je API key (NOOIT in Git!)
└── README.md                    # Dit bestand
```

## 🔑 Environment Variables

Je moet deze in `.env.local` zetten (lokaal):

```
CLAUDE_API_KEY=sk-ant-api03-[JOUW-KEY]
```

Wanneer je naar Vercel deployt, voeg je deze toe via:
- Vercel Dashboard → Settings → Environment Variables
- Naam: `CLAUDE_API_KEY`
- Waarde: `sk-ant-[JOUW-KEY]`

## 💰 Kosten

- **Vercel hosting:** GRATIS (1M requests/maand)
- **Claude API:** ~€0.30-0.50/dag (pay-as-you-go)
- **First time:** $5 gratis credits voor testen

## 🛠️ Deployment naar Vercel

### Stap 1: Push naar GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Stap 2: Connect Vercel

1. Ga naar **vercel.com**
2. Klik "Add New" → "Project"
3. Selecteer je GitHub repo
4. Klik "Import"
5. Voeg Environment Variable toe:
   - Naam: `CLAUDE_API_KEY`
   - Waarde: `sk-ant-[JOUW-KEY]`
6. Klik "Deploy"

### Stap 3: Klaar!

Je website is live op: `https://voetbal-odds-app.vercel.app`

## 📝 Hoe het Werkt

### Frontend (pages/index.js)

- React component met twee buttons
- Stuurt POST request naar je API route
- Toont resultaten in mooi formaat

### Backend (api/analyze-odds.js)

- Verwerkt requests van frontend
- Roept Claude API aan (veilig!)
- API key zit hier opgeslagen (nooit zichtbaar in browser)
- Geeft analyse terug naar frontend

### API Flow

```
1. User klikt button op website
2. Frontend stuurt POST naar /api/analyze-odds
3. Backend roept Claude API aan (met je API key)
4. Claude analyseert voetbalgegevens
5. Response gaat terug naar frontend
6. Website toont resultaten
```

## 🚨 Security Tips

- ✅ API key zit ALLEEN op server (Vercel)
- ✅ Nooit in browser zichtbaar
- ✅ .env.local niet in Git
- ✅ Vercel leest environment variables veilig

## ❌ Veelgemaakte Fouten

### "API key not found"

→ Zorg dat `.env.local` je key bevat

### "Cannot find module '@anthropic-ai/sdk'"

→ Run `npm install`

### "Port 3000 already in use"

→ Gebruik ander port: `npm run dev -- -p 3001`

### "Vercel says: 500 error"

→ Check Vercel Logs: Dashboard → Deployments → Logs

## 🤝 Support

- Check de environment variables
- Zorg dat npm packages geïnstalleerd zijn
- Vercel dashboard → Logs voor errors

## 📄 License

MIT - Gratis te gebruiken

---

**Veel succes met je Voetbal Odds Analyzer!** ⚽🚀
