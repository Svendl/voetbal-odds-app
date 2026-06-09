export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Alleen POST requests toegestaan" });
  }

  try {
    console.log("📡 Fetching van TheSportsDB...");

    // TheSportsDB - GRATIS, geen API key nodig!
    const response = await fetch(
      "https://www.thesportsdb.com/api/v1/eventslast.php?id=133602",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      }
    );

    console.log("📊 Response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Data ontvangen");

    if (!data.results || data.results.length === 0) {
      return res.status(200).json({
        success: true,
        matches: [],
        message: "Geen matches beschikbaar",
        timestamp: new Date().toISOString()
      });
    }

    // Parse matches
    const updatedMatches = data.results.map(event => {
      const homeGoals = event.intHomeScore;
      const awayGoals = event.intAwayScore;
      const score = homeGoals !== null && awayGoals !== null 
        ? `${homeGoals}-${awayGoals}`
        : null;

      return {
        groep: "A", // TheSportsDB geeft groep niet, dus default
        home: event.strHomeTeam,
        away: event.strAwayTeam,
        score: score,
        played: score !== null,
        date: event.dateEvent
      };
    });

    console.log("✅ Parsed:", updatedMatches.length, "matches");

    res.status(200).json({
      success: true,
      matches: updatedMatches,
      timestamp: new Date().toISOString(),
      total: updatedMatches.length
    });

  } catch (error) {
    console.error("💥 ERROR:", error.message);
    res.status(500).json({
      error: "Fout bij API call",
      details: error.message
    });
  }
};
