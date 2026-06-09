export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const { analysisType, league, date } = req.body;

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
- Odds realistische decimale getallen
- win_chance is percentage (0-100)`;

    let userPrompt;

    if (league === "wk-2026") {
      userPrompt = `Analyseer WK 2026 voetbalwedstrijden van ${date}.

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

Format: JSON met "matches" array. Elk match: {"home":"Team A", "away":"Team B", "time":"HH:MM", "stadium":"Stadion"}

STRICT JSON OUTPUT ALLEEN.`;
    } else {
      userPrompt = `Analyseer voetbalwedstrijden van ${date} in ${league}.

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
