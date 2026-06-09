module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Alleen POST requests toegestaan" });
  }

  try {
    // VOLLEDIGE DEMO DATA - ALLE 72 GROEPSFASE MATCHES
    const demoMatches = [
      // GROEP A (6 matches)
      { groep: "A", home: "Mexico", away: "Zuid-Afrika", score: "2-1", played: true },
      { groep: "A", home: "Zuid-Korea", away: "Tsjechië", score: "0-1", played: true },
      { groep: "A", home: "Mexico", away: "Zuid-Korea", score: "3-0", played: true },
      { groep: "A", home: "Tsjechië", away: "Zuid-Afrika", score: "1-1", played: true },
      { groep: "A", home: "Zuid-Afrika", away: "Zuid-Korea", score: "2-2", played: true },
      { groep: "A", home: "Tsjechië", away: "Mexico", score: "0-2", played: true },

      // GROEP B (6 matches)
      { groep: "B", home: "Canada", away: "Bosnië-Herzegovina", score: "1-0", played: true },
      { groep: "B", home: "Qatar", away: "Zwitserland", score: "0-2", played: true },
      { groep: "B", home: "Canada", away: "Qatar", score: "2-0", played: true },
      { groep: "B", home: "Zwitserland", away: "Bosnië-Herzegovina", score: "3-1", played: true },
      { groep: "B", home: "Bosnië-Herzegovina", away: "Canada", score: "0-1", played: true },
      { groep: "B", home: "Zwitserland", away: "Qatar", score: "2-0", played: true },

      // GROEP C (6 matches)
      { groep: "C", home: "Brazilië", away: "Marokko", score: "2-0", played: true },
      { groep: "C", home: "Haïti", away: "Schotland", score: "1-2", played: true },
      { groep: "C", home: "Brazilië", away: "Haïti", score: "4-0", played: true },
      { groep: "C", home: "Schotland", away: "Marokko", score: "1-1", played: true },
      { groep: "C", home: "Marokko", away: "Haïti", score: "3-0", played: true },
      { groep: "C", home: "Schotland", away: "Brazilië", score: "0-3", played: true },

      // GROEP D (6 matches)
      { groep: "D", home: "Verenigde Staten", away: "Paraguay", score: "3-0", played: true },
      { groep: "D", home: "Australië", away: "Turkije", score: "0-1", played: true },
      { groep: "D", home: "Verenigde Staten", away: "Australië", score: "2-1", played: true },
      { groep: "D", home: "Turkije", away: "Paraguay", score: "3-1", played: true },
      { groep: "D", home: "Paraguay", away: "Australië", score: "1-1", played: true },
      { groep: "D", home: "Turkije", away: "Verenigde Staten", score: "0-2", played: true },

      // GROEP E (6 matches)
      { groep: "E", home: "Duitsland", away: "Curaçao", score: "4-0", played: true },
      { groep: "E", home: "Ivoorkust", away: "Ecuador", score: "2-2", played: true },
      { groep: "E", home: "Duitsland", away: "Ivoorkust", score: "3-1", played: true },
      { groep: "E", home: "Ecuador", away: "Curaçao", score: "1-0", played: true },
      { groep: "E", home: "Curaçao", away: "Ivoorkust", score: "1-2", played: true },
      { groep: "E", home: "Ecuador", away: "Duitsland", score: "0-2", played: true },

      // GROEP F (6 matches)
      { groep: "F", home: "Nederland", away: "Japan", score: "2-0", played: true },
      { groep: "F", home: "Zweden", away: "Tunesië", score: "1-0", played: true },
      { groep: "F", home: "Nederland", away: "Zweden", score: "2-1", played: true },
      { groep: "F", home: "Tunesië", away: "Japan", score: "0-2", played: true },
      { groep: "F", home: "Japan", away: "Zweden", score: "1-1", played: true },
      { groep: "F", home: "Tunesië", away: "Nederland", score: "0-3", played: true },

      // GROEP G (6 matches)
      { groep: "G", home: "België", away: "Egypte", score: "2-0", played: true },
      { groep: "G", home: "Iran", away: "Nieuw-Zeeland", score: "1-0", played: true },
      { groep: "G", home: "België", away: "Iran", score: "3-0", played: true },
      { groep: "G", home: "Nieuw-Zeeland", away: "Egypte", score: "2-1", played: true },
      { groep: "G", home: "Egypte", away: "Iran", score: "1-1", played: true },
      { groep: "G", home: "Nieuw-Zeeland", away: "België", score: "0-2", played: true },

      // GROEP H (6 matches)
      { groep: "H", home: "Spanje", away: "Kaapverdië", score: "3-0", played: true },
      { groep: "H", home: "Saoedi-Arabië", away: "Uruguay", score: "0-2", played: true },
      { groep: "H", home: "Spanje", away: "Saoedi-Arabië", score: "2-0", played: true },
      { groep: "H", home: "Uruguay", away: "Kaapverdië", score: "1-0", played: true },
      { groep: "H", home: "Kaapverdië", away: "Saoedi-Arabië", score: "1-1", played: true },
      { groep: "H", home: "Uruguay", away: "Spanje", score: "0-1", played: true },

      // GROEP I (6 matches)
      { groep: "I", home: "Frankrijk", away: "Senegal", score: "2-0", played: true },
      { groep: "I", home: "Irak", away: "Noorwegen", score: "0-2", played: true },
      { groep: "I", home: "Frankrijk", away: "Irak", score: "3-0", played: true },
      { groep: "I", home: "Noorwegen", away: "Senegal", score: "1-1", played: true },
      { groep: "I", home: "Senegal", away: "Irak", score: "2-0", played: true },
      { groep: "I", home: "Noorwegen", away: "Frankrijk", score: "0-3", played: true },

      // GROEP J (6 matches)
      { groep: "J", home: "Argentinië", away: "Algerije", score: "3-0", played: true },
      { groep: "J", home: "Oostenrijk", away: "Jordanië", score: "2-0", played: true },
      { groep: "J", home: "Argentinië", away: "Oostenrijk", score: "1-0", played: true },
      { groep: "J", home: "Jordanië", away: "Algerije", score: "0-1", played: true },
      { groep: "J", home: "Algerije", away: "Oostenrijk", score: "0-1", played: true },
      { groep: "J", home: "Jordanië", away: "Argentinië", score: "0-2", played: true },

      // GROEP K (6 matches)
      { groep: "K", home: "Portugal", away: "Congo DR", score: "4-1", played: true },
      { groep: "K", home: "Oezbekistan", away: "Colombia", score: "0-2", played: true },
      { groep: "K", home: "Portugal", away: "Oezbekistan", score: "2-0", played: true },
      { groep: "K", home: "Colombia", away: "Congo DR", score: "3-0", played: true },
      { groep: "K", home: "Congo DR", away: "Oezbekistan", score: "1-1", played: true },
      { groep: "K", home: "Colombia", away: "Portugal", score: "1-2", played: true },

      // GROEP L (6 matches)
      { groep: "L", home: "Engeland", away: "Kroatië", score: "2-0", played: true },
      { groep: "L", home: "Ghana", away: "Panama", score: "2-0", played: true },
      { groep: "L", home: "Engeland", away: "Ghana", score: "3-0", played: true },
      { groep: "L", home: "Panama", away: "Kroatië", score: "1-2", played: true },
      { groep: "L", home: "Kroatië", away: "Ghana", score: "1-1", played: true },
      { groep: "L", home: "Panama", away: "Engeland", score: "0-3", played: true }
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
