export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.CLAUDE_API_KEY;
    const oddsApiKey = process.env.ODDS_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: "Claude API key not configured" });
    }
    if (!oddsApiKey) {
      return res.status(500).json({ error: "Odds API key not configured" });
    }

    const { analysisType, league, date } = req.body;

    // Haal real matches + odds op van Odds API
    let matchesData = "";
    try {
      const oddsResponse = await fetch(
        `https://api.the-odds-api.com/v4/sports/soccer_${getOddsLeagueCode(league)}/odds?apiKey=${oddsApiKey}&regions=eu&oddsFormat=decimal&markets=h2h`,
        { headers: { "User-Agent": "OddsAnalyzer" } }
      );
      
      if (oddsResponse.ok) {
        const oddsJson = await oddsResponse.json();
        const events = oddsJson.events || [];
        
        // Filter by date
        const filteredEvents = events.filter(event => {
          const eventDate = new Date(event.commence_time).toISOString().split("T")[0];
          return eventDate === date;
        });

        if (filteredEvents.length > 0) {
          matchesData = filteredEvents.map(event => {
            const odds = event.bookmakers[0]?.markets[0]?.outcomes || [];
            return `${event.home_team} vs ${event.away_team} - Home: ${odds[0]?.price || "N/A"}, Away: ${odds[1]?.price || "N/A"}`;
          }).join("\n");
        }
      }
    } catch (oddsErr) {
      console.log("Odds API call failed, continuing without live odds");
    }

    const systemPrompt = `Je bent een expert voetbal-odds analist. Je antwoordt ALTIJD in VALID JSON format.

RESPONSE FORMAT (ALTIJD deze structuur):
{
  "tips": {
    "low_risk": [
      {
        "id": 1,
        "bet": "Bet naam",
        "odds": 1.50,
        "win_chance": 75,
        "why": "Korte reden waarom (1-2 zinnen)"
      }
    ],
    "medium_risk": [...],
    "high_risk": [...]
  },
  "parlay": [
    {
      "id": 1,
      "name": "Veilige Dubbel",
      "bets": ["Bet 1", "Bet 2"],
      "odds": 2.63,
      "win_chance": 57,
      "strategy": "Korte strategie (1 zin)",
      "risk": "low"
    }
  ]
}

REGELS:
- LOW RISK: 5 tips, 70%+ winkans
- MEDIUM RISK: 5 tips, 55-70% winkans  
- HIGH RISK: 5 tips, <55% winkans
- PARLAY: 3 verdubbelaars (1 laag, 1 gemiddeld, 1 hoog risico)
- ALTIJD JSON, geen markdown, geen tekst buiten JSON
- "why" velden zijn 1-2 korte, heldere zinnen
- Odds MOETEN realistisch zijn gebaseerd op beschikbare data
- win_chance is percentage (0-100)`;

    let userPrompt;

    if (league === "wk-2026") {
      userPrompt = `Analyseer WK 2026 voetbalwedstrijden van ${date}.

${matchesData ? `REAL MATCHES VAN VANDAAG:\n${matchesData}\n\nGebruik DEZE odds!` : "Analyseer WK matches op basis van historische data."}

Geef 15 betting tips (5 laag + 5 gemiddeld + 5 hoog risico) + 3 verdubbelaars in JSON format.

Focus op:
- Gastlanden voordeel
- Titelverdedigers momentum
- Tactische voorzichtigheid openers
- Clean sheets in groepsfase
- Historische WK-patronen

STRICT JSON OUTPUT ALLEEN.`;
    } else if (analysisType === "matches") {
      userPrompt = `Geef voetbalwedstrijden van ${date} in ${league}.

${matchesData ? `REAL MATCHES:\n${matchesData}` : "Geen matches beschikbaar voor deze datum."}

Format: JSON met "matches" array. Elk match: {"home":"Team A", "away":"Team B", "odds_home":1.50, "odds_away":2.50}

STRICT JSON OUTPUT ALLEEN.`;
    } else {
      userPrompt = `Analyseer voetbalwedstrijden van ${date} in ${league}.

${matchesData ? `REAL MATCHES VAN VANDAAG:\n${matchesData}\n\nGebruik DEZE odds!` : "Analyseer op basis van historische data."}

Geef 15 betting tips (5 laag + 5 gemiddeld + 5 hoog risico) + 3 verdubbelaars in JSON format.

STRICT JSON OUTPUT ALLEEN.`;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 3000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Claude API error: ${data.error?.message || "Unknown error"}`);
    }

    const rawText = data.content[0]?.text || "";
    
    let analysis;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = JSON.parse(rawText);
      }
    } catch (parseError) {
      analysis = { error: "Could not parse Claude response", raw: rawText };
    }

    res.status(200).json({
      success: true,
      analysis: analysis,
      timestamp: new Date().toISOString(),
      has_live_odds: matchesData ? true : false
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Analysis failed",
      details: error.message
    });
  }
};

function getOddsLeagueCode(league) {
  const codes = {
    "la-liga": "spain_la_liga",
    "premier-league": "england_premier_league",
    "serie-a": "italy_serie_a",
    "bundesliga": "germany_bundesliga",
    "ligue-1": "france_ligue_1",
    "eredivisie": "netherlands_eredivisie",
    "mls": "usa_mls",
    "wk-2026": "fifa_world_cup"
  };
  return codes[league] || "england_premier_league";
}
