// api/analyze-odds.js
const Anthropic = require("@anthropic-ai/sdk").default;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key niet geconfigureerd" });
    }

    const { analysisType, league, date } = req.body;

    let userPrompt;

    if (league === "wk-2026") {
      userPrompt = `
Analyseer de WK 2026 voetbalwedstrijden van vandaag (${date}) en geef de BESTE ODDS TIPS.

Focus op:
1. Landenteams & huidigeformatie
2. Groepsfase matches
3. Historical performance
4. Star players & blessures

Voor ELKE wedstrijd, geef:
1. Land A vs Land B · Tijd
2. Beste inzet (Uitslag / Over/Under / Speler scoort)
3. Odds
4. Winkans in %
5. Risicoclassificatie (Laag/Gemiddeld/Hoog)
6. Korte analyse

MAXIMAAL 4-5 tips.`;
    } else if (analysisType === "matches") {
      userPrompt = `
Geef alle voetbalwedstrijden die vandaag (${date}) in ${league} gespeeld worden.

Format:
- Team A vs Team B · Tijd · Stadion

Sorteer op tijd.`;
    } else {
      userPrompt = `
Analyseer voetbalwedstrijden van vandaag (${date}) in ${league} en geef BESTE ODDS TIPS.

Voor ELKE wedstrijd:
1. Wedstrijd (Team A vs Team B · Tijd)
2. Beste inzet
3. Odds
4. Winkans in %
5. Risicoclassificatie (Laag=70%+ / Gemiddeld=55-70% / Hoog=<55%)
6. Analyse

MAXIMAAL 4-5 sterke tips.`;
    }

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: userPrompt
        }
      ]
    });

    res.status(200).json({
      success: true,
      analysis: message.content[0].text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      error: "Analyse mislukt",
      details: error.message
    });
  }
};
