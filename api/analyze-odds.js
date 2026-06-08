// api/analyze-odds.js
import Anthropic from "@anthropic-ai/sdk";

export default async (req, res) => {
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
    
    if (analysisType === "matches") {
      userPrompt = `
Geef alle voetbalwedstrijden die vandaag (${date}) in ${league} gespeeld worden.

Format:
- Team A vs Team B · Tijd · Stadion · Huidigestand teams

Sorteer op tijd (vroegste eerst).`;
    } else {
      userPrompt = `
Analyseer de voetbalwedstrijden van vandaag (${date}) in ${league} en geef de BESTE ODDS TIPS.

Voor ELKE wedstrijd die je selecteert, geef:
1. Wedstrijd (Team A vs Team B · Tijd)
2. Beste inzet (bijv: Uitslag / BTTS / Over X.5 goals / Speler scoort)
3. Odds
4. Winkans in %
5. Risicoclassificatie (Laag=70%+ / Gemiddeld=55-70% / Hoog=<55%)
6. Korte analyse (waarom)

WICHTIG:
- Risico moet EXACT aansluiten op winkans percentage
- Sorteer op winkans (hoogste eerst)
- Include huidigeformatie en blessures als bekend
- Geef SOURCES (welke experts/modellen adviseren dit)

Geef MAXIMAAL 4-5 sterke tips, niet meer.`;
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
