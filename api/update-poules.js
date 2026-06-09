export default async (req, res) => {
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
      { groep: "D", home: "Turkije", away:
