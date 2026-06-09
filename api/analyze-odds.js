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
2. Zoek de ECHTE odds van bookmakers (Bet365, DraftKings, etc) voor die wedstrijden
3. Analyseer die data en geef JSON terug

RESPONSE FORMAT (ALTIJD deze structuur):
{
  "tips": {
    "low_risk": [
      {
        "id": 1,
        "bet": "Exact bet naam (bijv: Mexico wint vs Indonesië)",
        "odds": 1.25,
        "win_chance": 85,
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
      "odds": 2.50,
      "win_chance": 50,
      "strategy": "Korte strategie",
      "risk": "low"
    }
  ]
}

CRITICAL:
- LOW RISK: 5 tips, 70%+, ECHTE ODDS
- MEDIUM RISK: 5 tips, 55-70%, ECHTE ODDS
- HIGH RISK: 5 tips, <55%, ECHTE ODDS
- PARLAY: 3 verdubbelaars met ECHTE ODDS
- GEBRUIK WEB SEARCH VOOR ALLES
- "why" max 2 zinnen
- ALTIJD VALID JSON`;

    let userPrompt;

    if (league === "wk-2026") {
      userPrompt = `Analyseer WK 2026 wedstrijden van ${date}.

STAP 1: Zoek alle WK 2026 wedstrijden die op ${date} gespeeld worden
STAP 2: Zoek voor ELKE wedstrijd de ECHTE odds (Home/Away/Draw) van minstens 3 bookmakers
STAP 3: Geef 15 betting tips (5 laag + 5 gemiddeld + 5 hoog risico) + 3 verdubbelaars in JSON

GEBRUIK WEB SEARCH VOOR ALLES!`;
    } else {
      userPrompt = `Analyseer voetbalwedstrijden van ${date} in ${league}.

STAP 1: Zoek alle wedstrijden op die datum
STAP 2: Zoek ECHTE odds voor die matches
STAP 3: Geef 15 tips + 3 verdubbelaars in JSON

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

    // Extract text from response
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
