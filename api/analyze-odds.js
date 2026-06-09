export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Claude API key not configured" });
    }

    const { analysisType, league, date } = req.body;

    const systemPrompt = `Je bent een expert voetbal-odds analist met web search beschikbaar.

JE TAAK:
1. Zoek de werkelijke voetbalwedstrijden voor ${date} in ${league === 'wk-2026' ? 'WK 2026' : league}
2. Voor ELKE wedstrijd, zoek ECHTE odds van Bet365, Toto, BetCity, en Unibet
3. Analyseer die data en geef JSON terug

RESPONSE FORMAT (ALTIJD deze structuur):
{
  "tips": {
    "low_risk": [
      {
        "id": 1,
        "bet": "TEAM A VS TEAM B (Bet type). Bijv: Mexico VS Indonesië (Mexico Wint)",
        "why": "Korte reden (1-2 zinnen)",
        "win_chance": 85,
        "odds": {
          "bet365": 1.25,
          "toto": 1.23,
          "betcity": 1.24,
          "unibet": 1.27
        },
        "best_odds": 1.27
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
      "why": "Korte strategie",
      "win_chance": 50,
      "odds": {
        "bet365": 2.50,
        "toto": 2.45,
        "betcity": 2.48,
        "unibet": 2.55
      },
      "best_odds": 2.55,
      "risk": "low"
    }
  ]
}

CRITICAL RULES:
- LOW RISK: 5 tips, 70%+
- MEDIUM RISK: 5 tips, 55-70%
- HIGH RISK: 5 tips, <55%
- PARLAY: 3 verdubbelaars (1 laag, 1 gemiddeld, 1 hoog)
- VOOR ELKE BET: Include Bet365, Toto, BetCity, Unibet odds
- "best_odds" = highest odds van de 4
- Bet format: "TEAM A VS TEAM B (Bet type)"
- "why" max 2 zinnen
- ALTIJD VALID JSON, geen extra tekst`;

    let userPrompt;

    if (league === "wk-2026") {
      userPrompt = `Analyseer WK 2026 wedstrijden van ${date}.

STAP 1: Zoek ALLE WK 2026 wedstrijden op ${date}
STAP 2: Voor ELKE wedstrijd, zoek ECHTE odds van:
        - Bet365
        - Toto
        - BetCity
        - Unibet
STAP 3: Geef 15 betting tips (5 laag + 5 gemiddeld + 5 hoog) + 3 verdubbelaars in JSON

Format bet: "TEAM A VS TEAM B (Bet type)"
Bijv: "Mexico VS Indonesië (Mexico Wint)"

GEBRUIK WEB SEARCH VOOR ALLES!`;
    } else {
      userPrompt = `Analyseer voetbalwedstrijden van ${date} in ${league}.

STAP 1: Zoek alle wedstrijden op die datum
STAP 2: Voor ELKE wedstrijd, zoek odds van Bet365, Toto, BetCity, Unibet
STAP 3: Geef 15 tips + 3 verdubbelaars in JSON met ALLE bookmaker odds

Format: "TEAM A VS TEAM B (Bet type)"

GEBRUIK WEB SEARCH!`;
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
        max_tokens: 4000,
        system: systemPrompt,
        tools: [
          {
            type: "web_search_20250305",
            name: "web_search"
          }
        ],
        messages: [{ role: "user", content: userPrompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Claude API error: ${data.error?.message || "Unknown"}`);
    }

    let rawText = "";
    if (data.content) {
      for (const block of data.content) {
        if (block.type === "text") {
          rawText += block.text;
        }
      }
    }

    let analysis;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(rawText);
    } catch (parseError) {
      analysis = { error: "Parse error", raw: rawText.substring(0, 500) };
    }

    res.status(200).json({
      success: true,
      analysis: analysis,
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
