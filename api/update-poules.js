export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Alleen POST requests toegestaan" });
  }

  try {
    // DEMO DATA - PUUR VOOR TESTEN
    const demoMatches = [
      { groep: "A", home: "Mexico", away: "Zuid-Afrika", score: "2-1", played: true, date: "2026-06-11" },
      { groep: "A", home: "Zuid-Korea", away: "Tsjechië", score: "0-1", played: true, date: "2026-06-11" },
      { groep: "A", home: "Mexico", away: "Zuid-Korea", score: "3-0", played: true, date: "2026-06-18" },
      { groep: "A", home: "Tsjechië", away: "Zuid-Afrika", score: "1-1", played: true, date: "2026-06-18" },
      
      { groep: "B", home: "Canada", away: "Bosnië-Herzegovina", score: "1-0", played: true, date: "2026-06-12" },
      { groep: "B", home: "Qatar", away: "Zwitserland", score: "0-2", played: true, date: "2026-06-12" },
      { groep: "B", home: "Canada", away: "Qatar", score: "2-0", played: true, date: "2026-06-19" },
      { groep: "B", home: "Zwitserland", away: "Bosnië-Herzegovina", score: "3-1", played: true, date: "2026-06-19" },
      
      { groep: "C", home: "Brazilië", away: "Marokko", score: "2-0", played: true, date: "2026-06-13" },
      { groep: "C", home: "Haïti", away: "Schotland", score: "1-2", played: true, date: "2026-06-13" },
      { groep: "C", home: "Brazilië", away: "Haïti", score: "4-0", played: true, date: "2026-06-20" },
      { groep: "C", home: "Schotland", away: "Marokko", score: "1-1", played: true, date: "2026-06-20" },
      
      { groep: "D", home: "Verenigde Staten", away: "Paraguay", score: "3-0", played: true, date: "2026-06-12" },
      { groep: "D", home: "Australië", away: "Turkije", score: "0-1", played: true, date: "2026-06-13" },
      { groep: "D", home: "Verenigde Staten", away: "Australië", score: "2-1", played: true, date: "2026-06-19" },
      { groep: "D", home: "Turkije", away: "Paraguay", score: "3-1", played: true, date: "2026-06-20" },
      
      { groep: "E", home: "Duitsland", away: "Curaçao", score: "4-0", played: true, date: "2026-06-14" },
      { groep: "E", home: "Ivoorkust", away: "Ecuador", score: "2-2", played: true, date: "2026-06-14" },
      { groep: "E", home: "Duitsland", away: "Ivoorkust", score: "3-1", played: true, date: "2026-06-21" },
      { groep: "E", home: "Ecuador", away: "Curaçao", score: "1-0", played: true, date: "2026-06-21" },
      
      { groep: "F", home: "Nederland", away: "Japan", score: "2-0", played: true, date: "2026-06-15" },
      { groep: "F", home: "Zweden", away: "Tunesië", score: "1-0", played: true, date: "2026-06-15" },
      { groep: "F", home: "Nederland", away: "Zweden", score: "2-1", played: true, date: "2026-06-22" },
      { groep: "F", home: "Tunesië", away: "Japan", score: "0-2", played: true, date: "2026-06-22" },
      
      { groep: "G", home: "België", away: "Egypte", score: "2-0", played: true, date: "2026-06-15" },
      { groep: "G", home: "Iran", away: "Nieuw-Zeeland", score: "1-0", played: true, date: "2026-06-16" },
      { groep: "G", home: "België", away: "Iran", score: "3-0", played: true, date: "2026-06-22" },
      { groep: "G", home: "Nieuw-Zeeland", away: "Egypte", score: "2-1", played: true, date: "2026-06-23" },
      
      { groep: "H", home: "Spanje", away: "Kaapverdië", score: "3-0", played: true, date: "2026-06-16" },
      { groep: "H", home: "Saoedi-Arabië", away: "Uruguay", score: "0-2", played: true, date: "2026-06-16" },
      { groep: "H", home: "Spanje", away: "Saoedi-Arabië", score: "2-0", played: true, date: "2026-06-23" },
      { groep: "H", home: "Uruguay", away: "Kaapverdië", score: "1-0", played: true, date: "2026-06-24" },
      
      { groep: "I", home: "Frankrijk", away: "Senegal", score: "2-0", played: true, date: "2026-06-17" },
      { groep: "I", home: "Irak", away: "Noorwegen", score: "0-2", played: true, date: "2026-06-17" },
      { groep: "I", home: "Frankrijk", away: "Irak", score: "3-0", played: true, date: "2026-06-23" },
      { groep: "I", home: "Noorwegen", away: "Senegal", score: "1-1", played: true, date: "2026-06-24" },
      
      { groep: "J", home: "Argentinië", away: "Algerije", score: "3-0", played: true, date: "2026-06-18" },
      { groep: "J", home: "Oostenrijk", away: "Jordanië", score: "2-0", played: true, date: "2026-06-18" },
      { groep: "J", home: "Argentinië", away: "Oostenrijk", score: "1-0", played: true, date: "2026-06-24" },
      { groep: "J", home: "Jordanië", away: "Algerije", score: "0-1", played: true, date: "2026-06-25" },
      
      { groep: "K", home: "Portugal", away: "Congo DR", score: "4-1", played: true, date: "2026-06-19" },
      { groep: "K", home: "Oezbekistan", away: "Colombia", score: "0-2", played: true, date: "2026-06-19" },
      { groep: "K", home: "Portugal", away: "Oezbekistan", score: "2-0", played: true, date: "2026-06-25" },
      { groep: "K", home: "Colombia", away: "Congo DR", score: "3-0", played: true, date: "2026-06-26" },
      
      { groep: "L", home: "Engeland", away: "Kroatië", score: "2-0", played: true, date: "2026-06-17" },
      { groep: "L", home: "Ghana", away: "Panama", score: "2-0", played: true, date: "2026-06-17" },
      { groep: "L", home: "Engeland", away: "Ghana", score: "3-0", played: true, date: "2026-06-23" },
      { groep: "L", home: "Panama", away: "Kroatië", score: "1-2", played: true, date: "2026-06-23" }
    ];

    console.log("✅ DEMO data geladen:", demoMatches.length, "matches");

    res.status(200).json({
      success: true,
      matches: demoMatches,
      timestamp: new Date().toISOString(),
      total: demoMatches.length,
      note: "🧪 DEMO DATA - PUUR VOOR TESTEN"
    });

  } catch (error) {
    console.error("💥 ERROR:", error.message);
    res.status(500).json({
      error: "Fout",
      details: error.message
    });
  }
};
