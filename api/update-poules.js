export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const API_KEY = process.env.API_FOOTBALL_KEY; // Voeg dit toe in Vercel
    
    // Haal alle WK 2026 fixtures op
    const response = await fetch(
      `https://v3.football-data.org/v4/competitions/WC/matches?status=FINISHED`,
      {
        headers: { "X-Auth-Token": API_KEY }
      }
    );

    const data = await response.json();
    
    // Parse de resultaten en update poules
    const updatedMatches = data.matches.map(match => ({
      home: match.homeTeam.name,
      away: match.awayTeam.name,
      score: `${match.score.fullTime.home}-${match.score.fullTime.away}`,
      played: true,
      date: match.utcDate
    }));

    res.status(200).json({
      success: true,
      matches: updatedMatches,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Failed to update poules",
      details: error.message
    });
  }
};
