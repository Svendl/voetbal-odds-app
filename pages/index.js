import { useState } from "react";

// POULE KLEUREN
const POULE_COLORS = {
  A: { bg: "#FFE5E5", border: "#FF6B6B", text: "#C92A2A" },
  B: { bg: "#E5F3FF", border: "#4ECDC4", text: "#0F3460" },
  C: { bg: "#FFF8E5", border: "#FFD93D", text: "#F57F17" },
  D: { bg: "#E5FFE5", border: "#4CAF50", text: "#2E7D32" },
  E: { bg: "#F3E5FF", border: "#9C27B0", text: "#4A148C" },
  F: { bg: "#FFE5F3", border: "#E91E63", text: "#880E4F" },
  G: { bg: "#E5F9FF", border: "#00BCD4", text: "#00695C" },
  H: { bg: "#FFF0E5", border: "#FF9800", text: "#E65100" },
  I: { bg: "#E5E5FF", border: "#3F51B5", text: "#1A237E" },
  J: { bg: "#F0E5FF", border: "#673AB7", text: "#311B92" },
  K: { bg: "#E5F5FF", border: "#2196F3", text: "#0D47A1" },
  L: { bg: "#FFE5E5", border: "#F44336", text: "#B71C1C" }
};

const WK_2026_DATA = {
  poules: {
    A: {
      groep: "Groep A",
      teams: [
        { naam: "Mexico", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Zuid-Afrika", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Zuid-Korea", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Tsjechië", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 }
      ],
      matches: []
    },
    B: {
      groep: "Groep B",
      teams: [
        { naam: "Canada", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Bosnië-Herzegovina", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Qatar", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Zwitserland", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 }
      ],
      matches: []
    },
    C: {
      groep: "Groep C",
      teams: [
        { naam: "Brazilië", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Marokko", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Haïti", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Schotland", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 }
      ],
      matches: []
    },
    D: {
      groep: "Groep D",
      teams: [
        { naam: "Verenigde Staten", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Paraguay", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Australië", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Turkije", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 }
      ],
      matches: []
    },
    E: {
      groep: "Groep E",
      teams: [
        { naam: "Duitsland", punten: 3, gespeeld: 1, gewonnen: 1, gelijkspel: 0, verloren: 0, doelsaldo: 2 },
        { naam: "Curaçao", punten: 0, gespeeld: 1, gewonnen: 0, gelijkspel: 0, verloren: 1, doelsaldo: -2 },
        { naam: "Ivoorkust", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Ecuador", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 }
      ],
      matches: [
        { id: 1, home: "Duitsland", away: "Curaçao", score: "2-0", played: true }
      ]
    },
    F: {
      groep: "Groep F",
      teams: [
        { naam: "Nederland", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Japan", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Zweden", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Tunesië", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 }
      ],
      matches: []
    },
    G: {
      groep: "Groep G",
      teams: [
        { naam: "België", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Egypte", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Iran", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Nieuw-Zeeland", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 }
      ],
      matches: []
    },
    H: {
      groep: "Groep H",
      teams: [
        { naam: "Spanje", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Kaapverdië", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Saoedi-Arabië", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Uruguay", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 }
      ],
      matches: []
    },
    I: {
      groep: "Groep I",
      teams: [
        { naam: "Frankrijk", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Senegal", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Irak", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Noorwegen", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 }
      ],
      matches: []
    },
    J: {
      groep: "Groep J",
      teams: [
        { naam: "Argentinië", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Algerije", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Oostenrijk", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Jordanië", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 }
      ],
      matches: []
    },
    K: {
      groep: "Groep K",
      teams: [
        { naam: "Portugal", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Congo DR", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Oezbekistan", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Colombia", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 }
      ],
      matches: []
    },
    L: {
      groep: "Groep L",
      teams: [
        { naam: "Engeland", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Kroatië", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Ghana", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 },
        { naam: "Panama", punten: 0, gespeeld: 0, gewonnen: 0, gelijkspel: 0, verloren: 0, doelsaldo: 0 }
      ],
      matches: []
    }
  },
  topscorers: [
    { rank: 1, speler: "Kylian Mbappé", team: "Frankrijk", goals: 3, assists: 1, rating: 8.5 },
    { rank: 2, speler: "Harry Kane", team: "Engeland", goals: 2, assists: 2, rating: 8.2 },
    { rank: 3, speler: "Vinícius Júnior", team: "Brazilië", goals: 2, assists: 1, rating: 8.1 },
    { rank: 4, speler: "Neymar", team: "Brazilië", goals: 1, assists: 3, rating: 7.9 },
    { rank: 5, speler: "Erling Haaland", team: "Noorwegen", goals: 1, assists: 1, rating: 7.8 },
    { rank: 6, speler: "Robert Lewandowski", team: "Polen", goals: 1, assists: 0, rating: 7.6 }
  ]
};

export default function Home() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(WK_2026_DATA.topscorers);
  const [editingStats, setEditingStats] = useState(false);
  const [poulesData, setPoulesData] = useState(WK_2026_DATA.poules);

  const handleBetting = async (isLive) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/analyze-odds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisType: "best-odds",
          league: "wk-2026",
          date: selectedDate,
          useWebSearch: isLive
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResults({ type: "betting", data: data.analysis });
    } catch (err) {
      setError(`Fout: ${err.message}`);
    }
    setLoading(false);
  };

  const updateStat = (index, field, value) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: isNaN(value) ? value : Number(value) };
    setStats(newStats);
  };

  const calculateStandings = (teams, matches) => {
    const standings = teams.map(team => ({ ...team }));

    matches.forEach(match => {
      if (match.played && match.score) {
        const [homeGoals, awayGoals] = match.score.split("-").map(Number);
        const homeTeam = standings.find(t => t.naam === match.home);
        const awayTeam = standings.find(t => t.naam === match.away);

        if (homeTeam && awayTeam) {
          homeTeam.gespeeld++;
          awayTeam.gespeeld++;
          homeTeam.doelsaldo += homeGoals - awayGoals;
          awayTeam.doelsaldo += awayGoals - homeGoals;

          if (homeGoals > awayGoals) {
            homeTeam.gewonnen++;
            homeTeam.punten += 3;
            awayTeam.verloren++;
          } else if (homeGoals < awayGoals) {
            awayTeam.gewonnen++;
            awayTeam.punten += 3;
            homeTeam.verloren++;
          } else {
            homeTeam.gelijkspel++;
            awayTeam.gelijkspel++;
            homeTeam.punten += 1;
            awayTeam.punten += 1;
          }
        }
      }
    });

    return standings.sort((a, b) => b.punten - a.punten || b.doelsaldo - a.doelsaldo);
  };

  const renderHome = () => (
    <div style={styles.homeContainer}>
      <div style={styles.header}>
        <div style={styles.logo}>⚽</div>
        <h1 style={styles.title}>WK 2026 CENTER</h1>
        <p style={styles.subtitle}>Tips, statistieken & voetbal analyse</p>
      </div>

      <div style={styles.menuGrid}>
        <button
          onClick={() => { setCurrentPage("betting-live"); handleBetting(true); }}
          style={{...styles.menuButton, ...styles.buttonLive}}
        >
          <div style={styles.buttonIcon}>💎</div>
          <h2 style={styles.buttonTitle}>Real-Time Tips</h2>
          <p style={styles.buttonDesc}>Live odds</p>
          <p style={styles.buttonPrice}>€0.50-1.00</p>
        </button>

        <button
          onClick={() => { setCurrentPage("betting-budget"); handleBetting(false); }}
          style={{...styles.menuButton, ...styles.buttonBudget}}
        >
          <div style={styles.buttonIcon}>⚡</div>
          <h2 style={styles.buttonTitle}>Budget Tips</h2>
          <p style={styles.buttonDesc}>Goedkoop</p>
          <p style={styles.buttonPrice}>€0.05-0.10</p>
        </button>

        <button
          onClick={() => setCurrentPage("poule")}
          style={{...styles.menuButton, ...styles.buttonPoule}}
        >
          <div style={styles.buttonIcon}>📋</div>
          <h2 style={styles.buttonTitle}>Poules & Uitslagen</h2>
          <p style={styles.buttonDesc}>Groepindelingen</p>
        </button>

        <button
          onClick={() => setCurrentPage("stats")}
          style={{...styles.menuButton, ...styles.buttonStats}}
        >
          <div style={styles.buttonIcon}>🏆</div>
          <h2 style={styles.buttonTitle}>Topscorers & Stats</h2>
          <p style={styles.buttonDesc}>Beste spelers</p>
        </button>
      </div>

      <div style={styles.info}>
        <p>🏆 WK 2026: 11 juni - 19 juli | 12 groepen | 48 teams</p>
        <p>⚠️ Speel verantwoord • 18+ • Disclaimer: AI-analyse</p>
      </div>
    </div>
  );

  const renderBetting = (isLive) => (
    <div style={styles.pageContainer}>
      <button onClick={() => setCurrentPage("home")} style={styles.backButton}>← Menu</button>

      <div style={styles.pageHeader}>
        <h1>{isLive ? "💎 Real-Time Tips" : "⚡ Budget Tips"}</h1>
        <p>{isLive ? "Live odds analyse" : "Jij voegt odds in"}</p>
      </div>

      <div style={styles.controlPanel}>
        <label style={styles.label}>📅 Kies datum:</label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={styles.dateInput} disabled={loading} />
        <button onClick={() => handleBetting(isLive)} disabled={loading} style={styles.analyzeButton}>
          {loading ? "⏳ Analyseren..." : "🔍 Tips ophalen"}
        </button>
      </div>

      {error && <div style={styles.errorBox}>⚠️ {error}</div>}

      {results && results.type === "betting" && (
        <div style={styles.resultsContainer}>
          {results.data.tips?.low_risk && (
            <div style={styles.tipSection("low")}>
              <h2>🟢 Laag Risico (70%+)</h2>
              {results.data.tips.low_risk.map((tip) => <TipCard key={tip.id} tip={tip} isLive={isLive} />)}
            </div>
          )}
          {results.data.tips?.medium_risk && (
            <div style={styles.tipSection("medium")}>
              <h2>🟡 Gemiddeld (55-70%)</h2>
              {results.data.tips.medium_risk.map((tip) => <TipCard key={tip.id} tip={tip} isLive={isLive} />)}
            </div>
          )}
          {results.data.tips?.high_risk && (
            <div style={styles.tipSection("high")}>
              <h2>🔴 Hoog Risico (&lt;55%)</h2>
              {results.data.tips.high_risk.map((tip) => <TipCard key={tip.id} tip={tip} isLive={isLive} />)}
            </div>
          )}
          {results.data.parlay && (
            <div style={styles.parlaySection}>
              <h2>💰 Verdubbelaars</h2>
              {results.data.parlay.map((p) => <ParlayCard key={p.id} parlay={p} isLive={isLive} />)}
            </div>
          )}
        </div>
      )}

      {!results && !loading && !error && <div style={styles.emptyState}><p>📅 Selecteer datum en klik "Tips ophalen"</p></div>}
    </div>
  );

  const renderPoule = () => (
    <div style={styles.pageContainer}>
      <button onClick={() => setCurrentPage("home")} style={styles.backButton}>← Menu</button>

      <div style={styles.pageHeader}>
        <h1>📋 Poules & Uitslagen</h1>
        <p>WK 2026 Groepindelingen met live punten</p>
      </div>

      <div style={styles.poulesGrid}>
        {Object.entries(poulesData).map(([key, groep]) => {
          const standings = calculateStandings(groep.teams, groep.matches);
          const color = POULE_COLORS[key];

          return (
            <div key={key} style={{...styles.pouleCard, backgroundColor: color.bg, borderColor: color.border}}>
              <h3 style={{...styles.pouleTitle, color: color.text, borderBottomColor: color.border}}>{groep.groep}</h3>

              <div style={styles.standingsTable}>
                <div style={{...styles.standingsHeader, backgroundColor: color.border, color: "white"}}>
                  <div style={{flex: 2}}>Team</div>
                  <div style={{flex: 0.5, textAlign: "center"}}>G</div>
                  <div style={{flex: 0.5, textAlign: "center"}}>W</div>
                  <div style={{flex: 0.5, textAlign: "center"}}>G</div>
                  <div style={{flex: 0.5, textAlign: "center"}}>V</div>
                  <div style={{flex: 0.5, textAlign: "center"}}>DS</div>
                  <div style={{flex: 0.7, textAlign: "center", fontWeight: "700"}}>PTS</div>
                </div>

                {standings.map((team, idx) => (
                  <div key={idx} style={{...styles.standingsRow, backgroundColor: idx < 2 ? color.bg : "white", borderColor: color.border}}>
                    <div style={{flex: 2, fontWeight: idx < 2 ? "700" : "600"}}>{team.naam}</div>
                    <div style={{flex: 0.5, textAlign: "center"}}>{team.gespeeld}</div>
                    <div style={{flex: 0.5, textAlign: "center"}}>{team.gewonnen}</div>
                    <div style={{flex: 0.5, textAlign: "center"}}>{team.gelijkspel}</div>
                    <div style={{flex: 0.5, textAlign: "center"}}>{team.verloren}</div>
                    <div style={{flex: 0.5, textAlign: "center", fontSize: "11px"}}>{team.doelsaldo > 0 ? "+" : ""}{team.doelsaldo}</div>
                    <div style={{flex: 0.7, textAlign: "center", fontWeight: "700", backgroundColor: idx < 2 ? color.border : "transparent", color: idx < 2 ? "white" : color.text, borderRadius: "4px", padding: "2px"}}>{team.punten}</div>
                  </div>
                ))}
              </div>

              {groep.matches && groep.matches.length > 0 && (
                <div style={styles.matchesSection}>
                  <p style={styles.matchesTitle}>Wedstrijden:</p>
                  {groep.matches.map((match) => (
                    <div key={match.id} style={{...styles.matchBox, backgroundColor: match.played ? color.bg : "white"}}>
                      <span>{match.home} vs {match.away}</span>
                      <span style={{fontWeight: "700", color: match.played ? color.text : "#999"}}>{match.played ? match.score : "—"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStats = () => (
    <div style={styles.pageContainer}>
      <button onClick={() => setCurrentPage("home")} style={styles.backButton}>← Menu</button>

      <div style={styles.pageHeader}>
        <h1>🏆 Topscorers & Statistieken</h1>
        <p>Beste spelers, assists & ratings</p>
      </div>

      <div style={styles.statsControls}>
        <button onClick={() => setEditingStats(!editingStats)} style={styles.editButton}>
          {editingStats ? "✅ Klaar" : "✏️ Bewerken"}
        </button>
      </div>

      <div style={styles.statsTable}>
        <div style={styles.statsHeader}>
          <div style={{flex: 0.5}}>Rank</div>
          <div style={{flex: 2}}>Speler</div>
          <div style={{flex: 1}}>Team</div>
          <div style={{flex: 0.7}}>⚽ Goals</div>
          <div style={{flex: 0.7}}>🎯 Assists</div>
          <div style={{flex: 0.7}}>⭐ Rating</div>
        </div>

        {stats.map((stat, idx) => (
          <div key={idx} style={styles.statsRow(idx)}>
            <div style={{flex: 0.5, textAlign: "center", fontWeight: "700"}}>#{stat.rank}</div>
            {editingStats ? (
              <>
                <div style={{flex: 2}}><input value={stat.speler} onChange={(e) => updateStat(idx, "speler", e.target.value)} style={styles.editInput} /></div>
                <div style={{flex: 1}}><input value={stat.team} onChange={(e) => updateStat(idx, "team", e.target.value)} style={styles.editInput} /></div>
                <div style={{flex: 0.7}}><input type="number" value={stat.goals} onChange={(e) => updateStat(idx, "goals", e.target.value)} style={styles.editInput} /></div>
                <div style={{flex: 0.7}}><input type="number" value={stat.assists} onChange={(e) => updateStat(idx, "assists", e.target.value)} style={styles.editInput} /></div>
                <div style={{flex: 0.7}}><input type="number" value={stat.rating} onChange={(e) => updateStat(idx, "rating", e.target.value)} style={styles.editInput} step="0.1" /></div>
              </>
            ) : (
              <>
                <div style={{flex: 2, fontWeight: "600"}}>{stat.speler}</div>
                <div style={{flex: 1}}>{stat.team}</div>
                <div style={{flex: 0.7, textAlign: "center"}}>{stat.goals}</div>
                <div style={{flex: 0.7, textAlign: "center"}}>{stat.assists}</div>
                <div style={{flex: 0.7, textAlign: "center"}}>{stat.rating}</div>
              </>
            )}
          </div>
        ))}
      </div>

      {editingStats && <div style={styles.editNotice}>💾 Je kunt hier stats handmatig aanpassen. Click "Klaar" om op te slaan.</div>}
    </div>
  );

  return (
    <div style={styles.container}>
      {currentPage === "home" && renderHome()}
      {currentPage === "betting-live" && renderBetting(true)}
      {currentPage === "betting-budget" && renderBetting(false)}
      {currentPage === "poule" && renderPoule()}
      {currentPage === "stats" && renderStats()}
    </div>
  );
}

function TipCard({ tip, isLive }) {
  return (
    <div style={styles.tipCard}>
      <div style={styles.tipHeader}>
        <h3 style={styles.tipBet}>{tip.bet}</h3>
        <span style={styles.winkans}>{tip.win_chance}%</span>
      </div>
      <p style={styles.tipWhy}>{tip.why}</p>
      {isLive && tip.odds && (
        <div style={styles.oddsList}>
          {Object.entries(tip.odds).map(([book, odd]) => (
            <div key={book} style={styles.oddItem}>
              <div style={styles.oddLabel}>{book.toUpperCase()}</div>
              <div style={styles.oddPrice}>{odd || "—"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ParlayCard({ parlay, isLive }) {
  return (
    <div style={styles.parlayCard(parlay.risk)}>
      <h3>{parlay.id}. {parlay.name}</h3>
      <p style={styles.parlayWhy}>{parlay.why}</p>
      <div style={styles.parlayBets}>
        {parlay.bets?.map((b, i) => <p key={i}>• {b}</p>)}
      </div>
      <div style={styles.parlayStats}>
        <div><strong>Winkans:</strong> {parlay.win_chance}%</div>
        {isLive && <div><strong>Odds:</strong> {parlay.odds?.bet365 || "—"}</div>}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "linear-gradient(135deg, #0F3460 0%, #16213E 50%, #0F3460 100%)", padding: "20px", fontFamily: "'Segoe UI', Arial, sans-serif" },
  homeContainer: { minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" },
  header: { marginBottom: "50px", color: "white" },
  logo: { fontSize: "80px", margin: "0 0 20px" },
  title: { fontSize: "42px", fontWeight: "800", margin: "0 0 10px", letterSpacing: "1px" },
  subtitle: { fontSize: "16px", opacity: "0.9", margin: "0" },
  menuGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", maxWidth: "900px", marginBottom: "50px" },
  menuButton: { border: "none", borderRadius: "16px", padding: "40px 25px", cursor: "pointer", color: "white", textAlign: "center", boxShadow: "0 15px 35px rgba(0,0,0,0.3)", transition: "transform 0.3s", fontSize: "inherit" },
  buttonLive: { background: "linear-gradient(135deg, #FFD93D 0%, #FF9E1B 100%)" },
  buttonBudget: { background: "linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)" },
  buttonPoule: { background: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)" },
  buttonStats: { background: "linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%)" },
  buttonIcon: { fontSize: "48px", marginBottom: "15px" },
  buttonTitle: { fontSize: "20px", fontWeight: "700", margin: "0 0 8px" },
  buttonDesc: { fontSize: "13px", margin: "0", opacity: "0.95" },
  buttonPrice: { fontSize: "12px", fontWeight: "600", margin: "8px 0 0", opacity: "0.9" },
  info: { color: "white", fontSize: "13px", opacity: "0.8" },
  pageContainer: { maxWidth: "900px", margin: "0 auto" },
  backButton: { background: "rgba(255,255,255,0.15)", border: "2px solid white", color: "white", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", marginBottom: "30px" },
  pageHeader: { background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.2)", borderRadius: "12px", padding: "25px", color: "white", marginBottom: "25px", textAlign: "center" },
  controlPanel: { background: "white", borderRadius: "12px", padding: "25px", marginBottom: "25px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" },
  label: { display: "block", marginBottom: "10px", fontWeight: "600", color: "#333" },
  dateInput: { width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #0F3460", fontSize: "14px", marginBottom: "15px" },
  analyzeButton: { width: "100%", padding: "14px", fontSize: "16px", fontWeight: "700", border: "none", borderRadius: "8px", background: "linear-gradient(135deg, #0F3460 0%, #16213E 100%)", color: "white", cursor: "pointer" },
  errorBox: { background: "#FFE0E0", color: "#C33", padding: "16px", borderRadius: "8px", marginBottom: "20px" },
  resultsContainer: { background: "white", borderRadius: "12px", padding: "25px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" },
  tipSection: (risk) => { const colors = { low: "#E8F5E9", medium: "#FFF3E0", high: "#FFEBEE" }; return { background: colors[risk], borderRadius: "8px", padding: "20px", marginBottom: "20px" }; },
  tipCard: { background: "white", border: "1px solid #E0E0E0", borderRadius: "8px", padding: "15px", marginBottom: "12px" },
  tipHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  tipBet: { fontSize: "15px", fontWeight: "700", margin: "0", color: "#333" },
  winkans: { fontWeight: "700", color: "#4CAF50", fontSize: "14px" },
  tipWhy: { fontSize: "12px", color: "#666", margin: "0 0 10px" },
  oddsList: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", marginTop: "10px" },
  oddItem: { background: "#F0F0F0", padding: "8px", borderRadius: "6px", textAlign: "center" },
  oddLabel: { fontSize: "10px", color: "#999", marginBottom: "4px" },
  oddPrice: { fontSize: "14px", fontWeight: "700", color: "#333" },
  parlaySection: { marginTop: "30px" },
  parlayCard: (risk) => { const colors = { low: "#E3F2FD", medium: "#FFF8E1", high: "#FFEBEE" }; return { background: colors[risk], border: `2px solid ${risk === "low" ? "#2196F3" : risk === "medium" ? "#FBC02D" : "#F44336"}`, borderRadius: "8px", padding: "15px", marginBottom: "12px" }; },
  parlayWhy: { fontSize: "12px", color: "#666", margin: "8px 0" },
  parlayBets: { fontSize: "12px", margin: "10px 0", color: "#333" },
  parlayStats: { display: "flex", gap: "20px", fontSize: "12px", marginTop: "10px" },
  emptyState: { background: "white", borderRadius: "12px", padding: "40px", textAlign: "center", color: "#999" },
  poulesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", marginTop: "20px" },
  pouleCard: { borderRadius: "12px", padding: "16px", border: "3px solid", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" },
  pouleTitle: { fontSize: "16px", fontWeight: "700", margin: "0 0 12px", paddingBottom: "8px", borderBottom: "3px solid" },
  standingsTable: { marginBottom: "12px" },
  standingsHeader: { display: "flex", padding: "8px", borderRadius: "6px 6px 0 0", fontSize: "11px", fontWeight: "600" },
  standingsRow: { display: "flex", padding: "8px", borderBottom: "1px solid", fontSize: "12px", alignItems: "center" },
  matchesSection: { borderTop: "2px solid #E0E0E0", paddingTop: "12px" },
  matchesTitle: { fontSize: "11px", fontWeight: "700", margin: "0 0 8px", opacity: "0.7" },
  matchBox: { display: "flex", justifyContent: "space-between", padding: "8px", borderRadius: "6px", marginBottom: "6px", border: "1px solid #E0E0E0", fontSize: "12px" },
  statsControls: { display: "flex", gap: "15px", marginBottom: "25px" },
  editButton: { flex: 1, padding: "12px", background: "linear-gradient(135deg, #FF9E1B 0%, #FFD93D 100%)", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  statsTable: { background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" },
  statsHeader: { display: "flex", background: "#0F3460", color: "white", padding: "15px", fontWeight: "700", fontSize: "13px" },
  statsRow: (idx) => ({ display: "flex", padding: "15px", background: idx % 2 === 0 ? "white" : "#F9F9F9", borderBottom: "1px solid #E0E0E0", fontSize: "13px", alignItems: "center" }),
  editInput: { width: "100%", padding: "8px", border: "1px solid #DDD", borderRadius: "6px", fontSize: "13px" },
  editNotice: { background: "#FFF8E1", border: "2px solid #FBC02D", borderRadius: "8px", padding: "15px", marginTop: "20px", textAlign: "center", color: "#F57F17", fontWeight: "600" }
};
