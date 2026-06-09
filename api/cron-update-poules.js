module.exports = async (req, res) => {
  // Cron job endpoint - GEEN POST check nodig!
  
  try {
    console.log("🔄 CRON STARTED:", new Date().toISOString());

    // Demo data (zelfde als in update-poules.js)
    const demoMatches = [
      { groep: "A", home: "Mexico", away: "Zuid-Afrika", score: "2-1", played: true },
      { groep: "A", home: "Zuid-Korea", away: "Tsjechië", score: "0-1", played: true },
      { groep: "A", home: "Mexico", away: "Zuid-Korea", score: "3-0", played: true },
      { groep: "A", home: "Tsjechië", away: "Zuid-Afrika", score: "1-1", played: true },
      { groep: "A", home: "Zuid-Afrika", away: "Zuid-Korea", score: "2-2", played: true },
      { groep: "A", home: "Tsjechië", away: "Mexico", score: "0-2", played: true },
    ];

    console.log("✅ CRON COMPLETED:", demoMatches.length, "matches");

    // Vercel expects 200 response
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      matches_processed: demoMatches.length,
      cron: true
    });

  } catch (error) {
    console.error("❌ CRON ERROR:", error.message);
    res.status(200).json({ error: error.message }); // Return 200 anyway!
  }
};
