module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Claude API key not configured" });
    }

    const { analysisType, league, date, useWebSearch = true } = req.body;

    // GEOPTIMALISEERDE SYSTEM PROMPT
    const systemPrompt = `Je bent een voetbal-odds expert. Geef ALTIJD valid JSON, niks anders.

RESPONSE FORMAT (EXACT deze structuur):
{
  "tips": {
    "low_risk": [
      {
        "id": 1,
        "bet": "Team A vs B (Wedstrijdtype)",
        "why": "Korte reden",
        "win_chance": 85,
        "odds": {
          "bet365": 1.25,
          "toto": 1.23,
          "betcity": 1.24,
          "unibet": 1.27
        }
      }
    ],
    "medium_risk": [],
    "high_risk": []
  },
  "parlay": [
    {
      "id": 1,
      "name": "Dubbel naam",
      "bets": ["Bet 1", "Bet 2"],
      "win_chance": 50,
      "odds": {"bet365": 2.5},
      "risk": "low"
    }
  ]
}

VERPLICHT:
- LOW RISK: 3 tips (70%+)
- MEDIUM RISK: 2 tips (55-70%)
- HIGH RISK: 1 tip (<55%)
- PARLAY: 3 verdubbelaars (laag/middel/hoog)`;

    const userPrompt = useWebSearch
      ? `WK 2026 op ${date}: 
Geef EXACT deze structuur in JSON:
- 3 laag-risico tips (70%+)
- 2 gemiddeld-risico tips (55-70%)
- 1 hoog-risico tip (<55%)
- 3 verdubbelaars (1 laag, 1 middel, 1 hoog)

Korte redenen. Odds van Bet365, Toto, BetCity, Unibet.
GEBRUIK WEB SEARCH!`
      : `WK 2026 op ${date}: 
Geef EXACT deze structuur in JSON:
- 3 laag-risico tips (70%+)
- 2 gemiddeld-risico tips (55-70%)
- 1 hoog-risico tip (<55%)
- 3 verdubbelaars (1 laag, 1 middel, 1 hoog)

Korte redenen. Geschat op basis van historie.
Geen web search.`;

    // API CALL
    const requestBody = {
      model: "claude-opus-4-6",
      max_tokens: 1200,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
    };

    if (useWebSearch) {
      requestBody.tools = [
        {
          type: "web_search_20250305",
          name: "web_search"
        }
      ];
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);
      throw new Error(`Claude API error: ${data.error?.message || "Unknown error"}`);
    }

    // JSON PARSING
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
      if (rawText.trim().startsWith("{")) {
        analysis = JSON.parse(rawText);
      } else {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("Geen JSON gevonden");
        }
        analysis = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Parse Error:", parseError.message);
      analysis = {
        error: "JSON parse failed",
        tips: { low_risk: [], medium_risk: [], high_risk: [] },
        parlay: []
      };
    }

    res.status(200).json({
      success: true,
      analysis: analysis,
      timestamp: new Date().toISOString(),
      config: { useWebSearch, tips_total: 6, parlays: 3 }
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({
      error: "Analysis failed",
      details: error.message
    });
  }
};
