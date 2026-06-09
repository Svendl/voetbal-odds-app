export default async (req, res) => {
  try {
    const oddsApiKey = process.env.ODDS_API_KEY;
    if (!oddsApiKey) {
      return res.status(500).json({ error: "No Odds API key" });
    }

    // Test WK
    const wkResponse = await fetch(
      `https://api.the-odds-api.com/v4/sports/soccer_world_cup/odds?apiKey=${oddsApiKey}&regions=eu&oddsFormat=decimal`,
      { headers: { "User-Agent": "OddsAnalyzer" } }
    );
    const wkData = await wkResponse.json();

    res.status(200).json({
      wk_matches_found: wkData.events?.length || 0,
      wk_data: wkData.events?.slice(0, 3) || [],
      available_sports: wkData.sports || []
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
