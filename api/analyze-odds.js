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

    // Haal real matches + odds op
    let matchesData = "";
    let hasLiveOdds = false;
    
    try {
      const leagueCode = league === "wk-2026" ? "soccer_world_cup" : `soccer_${league}`;
      
      const oddsResponse = await fetch(
        `https://api.the-odds-api.com/v4/sports/${leagueCode}/odds?apiKey=${oddsApiKey}&regions=eu&oddsFormat=decimal&markets=h2h`,
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
          hasLiveOdds = true;
          matchesData = filteredEvents.slice(0, 10).map(event => {
            const homeBookmaker = event.bookmakers?.[0];
            const outcomes = homeBookmaker?.markets?.[0]?.outcomes || [];
            const homeOdds = outcomes.find(o => o.name === event.home_team)?.price || "N/A";
            const awayOdds = outcomes.find(o => o.name === event.away_team)?.price || "N/A";
            return `${event.home_team} vs ${event.away_team}: Home ${homeOdds}, Away ${awayOdds}`;
          }).join("\n");
        }
      }
    } catch (oddsErr) {
      console.log("Odds API call note:", oddsErr.message);
    }

    const systemPrompt = `Je bent een expert voetbal-odds analist. Je antwoordt ALTIJD in VALID JSON format.

${hasLiveOdds ? "JE HEBT REAL LIVE ODDS ONTVANGEN - GEBRUIK DEZE!" : "Je gebruikt historische data voor analyse."}

RESPONSE FORMAT (ALTIJD deze structuur):
{
  "tips": {
    "low_risk": [
      {
        "id": 1,
        "bet": "Bet naam",
        "odds": 1.50,
        "win_chance": 75,
        "why": "Korte reden (1-2 zinnen)"
      }
    ],
    "medium_risk": [...],
    "high_risk": [...]
  },
  "parlay": [
    {
      "id": 1,
      "name": "Naam",
      "bets": ["Bet 1", "Bet 2"],
      "odds": 2.63,
      "win_chance": 57,
      "strategy": "Korte strategie",
      "risk": "low"
    }
  ]
}

STRICT RULES:
- LOW RISK: 5 tips, 70%+
- MEDIUM RISK: 5 tips, 55-70%
- HIGH RISK: 5 tips, <55%
- PARLAY: 3 verdubbelaars
- ${hasLiveOdds ? "GEBRUIK DE REAL ODDS!" : "Gebruik realistische odds op basis van team-strength."}
- ALTIJD VALID JSON
- "why" max 2 zinnen`;

    let userPrompt;

    if (league === "wk-2026") {
      userPrompt = `Analyseer WK 2026 wedstrijden van ${date}.

${hasLiveOdds ? `LIVE REAL ODDS VAN BOOKMAKERS:\n${matchesData}\n\nGEBRUIK DEZE ODDS IN JE ANALYSE!` : "Analyseer op basis van team-kwaliteit en historische patronen."}

Geef 15 tips (5 laag + 5 gemiddeld + 5 hoog) + 3 verdubbelaars in JSON.

STRICT JSON ONLY.`;
    } else {
      userPrompt = `Analyseer voetbal van ${date} in ${league}.

${hasLiveOdds ? `REAL ODDS:\n${matchesData}` : "Analyseer op team-kwaliteit."}

Geef 15 tips + 3 verdubbelaars in JSON format.

STRICT JSON ONLY.`;
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
      throw new Error(`Claude API error: ${data.error?.message || "Unknown"}`);
    }

    const rawText = data.content[0]?.text || "";
    let analysis;
    
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(rawText);
    } catch (parseError) {
      analysis = { error: "Parse error", raw: rawText };
    }

    res.status(200).json({
      success: true,
      analysis: analysis,
      has_live_odds: hasLiveOdds,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Analysis failed",
      details: error.message
    });
  }
};
