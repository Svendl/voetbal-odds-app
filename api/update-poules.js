export default async (req, res) => {
  // Alleen POST requests toestaan
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Alleen POST requests toegestaan" });
  }

  try {
    const API_KEY = process.env.API_FOOTBALL_KEY;

    if (!API_KEY) {
      return res.status(500).json({ 
        error: "API_FOOTBALL_KEY niet ingesteld in Vercel environments" 
      });
    }

    // Haal alle WK 2026 matches op
    const response = await fetch(
      "https://v3.football-data.org/v4/competitions/WC/matches",
      {
        method: "GET",
        headers: { "X-Auth-Token": API_KEY }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: `API Error: ${errorData.message || "Unknown error"}` 
      });
    }

    const data = await response.json();

    // Parse de matches in ons format
    const updatedMatches = data.matches
      .filter(match => {
        // Filter alleen groepsfase matches (status: FINISHED of IN_PLAY)
        return match.stage === "GROUP_STAGE" && 
               (match.status === "FINISHED" || match.status === "IN_PLAY");
      })
      .map(match => {
        // Bepaal groep op basis van stadium code
        let groep = "A";
        if (match.group) {
          groep = match.group.charAt(match.group.length - 1); // Pak laatste letter
        }

        return {
          groep: groep,
          home: match.homeTeam.name,
          away: match.awayTeam.name,
          score: match.score.fullTime.home !== null && match.score.fullTime.away !== null
            ? `${match.score.fullTime.home}-${match.score.fullTime.away}`
            : null,
          played: match.status === "FINISHED",
          date: match.utcDate
        };
      });

    // Return de bijgewerkte matches
    res.status(200).json({
      success: true,
      matches: updatedMatches,
      timestamp: new Date().toISOString(),
      total: updatedMatches.length
    });

  } catch (error) {
    console.error("Error in update-poules:", error);
    res.status(500).json({
      error: "Fout bij het ophalen van poule-gegevens",
      details: error.message
    });
  }
};
