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

    let userPrompt;

    if (league === "wk-2026") {
      userPrompt = `Analyseer WK 2026 voetbalwedstrijden van ${date}. Geef beste odds tips met risicoclassificatie (Laag/Gemiddeld/Hoog).`;
    } else if (analysisType === "matches") {
      userPrompt = `Geef alle voetbalwedstrijden van ${date} in ${league}. Format: Team A vs Team B · Tijd · Stadion.`;
    } else {
      userPrompt = `Analyseer voetbalwedstrijden van ${date} in ${league} en geef 4-5 beste odds tips met winkans % en risicoclassificatie.`;
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
        max_tokens: 2000,
        messages: [{ role: "user", content: userPrompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Claude API error: ${data.error?.message || "Unknown error"}`);
    }

    const analysis = data.content[0]?.text || "No response";

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
