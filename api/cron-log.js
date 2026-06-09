module.exports = async (req, res) => {
  // Dit is ALLEEN om te checken of cron werkt
  
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      cronRun: true,
      matches: 72
    };

    console.log("✅ CRON RUN:", logEntry);

    res.status(200).json({
      success: true,
      message: "Cron job is actief",
      log: logEntry
    });

  } catch (error) {
    console.error("❌ Cron error:", error);
    res.status(500).json({ error: error.message });
  }
};
