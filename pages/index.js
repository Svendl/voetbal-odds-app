import { useState } from "react";

export default function Home() {
  const [currentPage, setCurrentPage] = useState("home");
  const [league, setLeague] = useState("wk-2026");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [useWebSearch, setUseWebSearch] = useState(true);

  const handleAnalysis = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/analyze-odds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisType: "best-odds",
          league: league,
          date: selectedDate,
          useWebSearch: useWebSearch
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setResults({
        type: "odds",
        data: data.analysis
      });
    } catch (err) {
      setError(`Fout: ${err.message}`);
    }
    setLoading(false);
  };

  const renderHome = () => (
    <div style={styles.homeContainer}>
      <div style={styles.heroSection}>
        <h1 style={styles.heroTitle}>⚽ VOETBAL ODDS ANALYZER</h1>
        <p style={styles.heroSubtitle}>AI-aangestuurde betting tips & voetbal statistieken</p>
      </div>

      <div style={styles.menuGrid}>
        <button
          onClick={() => setCurrentPage("poule")}
          style={styles.menuButton("gradient1")}
        >
          <div style={styles.menuIcon}>📋</div>
          <h2 style={styles.menuTitle}>Poule & Uitslagen</h2>
          <p style={styles.menuDesc}>Groepindelingen en matchresultaten</p>
        </button>

        <button
          onClick={() => setCurrentPage("stats")}
          style={styles.menuButton("gradient2")}
        >
          <div style={styles.menuIcon}>🏆</div>
          <h2 style={styles.menuTitle}>Topscoorders & Stats</h2>
          <p style={styles.menuDesc}>Beste spelers & cijfers</p>
        </button>

        <button
          onClick={() => { setCurrentPage("betting"); setUseWebSearch(true); }}
          style={styles.menuButton("gradient3")}
        >
          <div style={styles.menuIcon}>💎</div>
          <h2 style={styles.menuTitle}>Gokken (Real-time)</h2>
          <p style={styles.menuDesc}>Real-time odds analyse</p>
          <p style={styles.menuPrice}>💰 €0.50-1.00 per analyse</p>
        </button>

        <button
          onClick={() => { setCurrentPage("betting"); setUseWebSearch(false); }}
          style={styles.menuButton("gradient4")}
        >
          <div style={styles.menuIcon}>⚡</div>
          <h2 style={styles.menuTitle}>Gokken (Budget)</h2>
          <p style={styles.menuDesc}>Tips + voeg odds zelf in</p>
          <p style={styles.menuPrice}>💰 €0.05-0.10 per analyse</p>
        </button>
      </div>

      <div style={styles.footerHome}>
        <p>🎯 Kies een optie om te starten • Speel verantwoord • 18+</p>
      </div>
    </div>
  );

  const renderBetting = () => (
    <div style={styles.pageContainer}>
      <button onClick={() => setCurrentPage("home")} style={styles.backButton}>
        ← Terug naar menu
      </button>

      <div style={styles.bettingHeader}>
        <h1>{useWebSearch ? "💎 Real-time Odds Analyse" : "⚡ Budget Analyse"}</h1>
        <p>{useWebSearch ? "Web search enabled - Echte odds" : "Zonder web search - Jij voegt odds in"}</p>
      </div>

      <div style={styles.controlPanel}>
        <div style={styles.section}>
          <label style={styles.label}>📍 Competitie:</label>
          <select 
            value={league} 
            onChange={(e) => setLeague(e.target.value)}
            style={styles.select}
            disabled={loading}
          >
            <option value="wk-2026">🏆 WK 2026</option>
            <option value="la-liga">🇪🇸 La Liga</option>
            <option value="premier-league">🇬🇧 Premier League</option>
            <option value="serie-a">🇮🇹 Serie A</option>
            <option value="bundesliga">🇩🇪 Bundesliga</option>
            <option value="ligue-1">🇫🇷 Ligue 1</option>
            <option value="eredivisie">🇳🇱 Eredivisie</option>
          </select>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>📅 Datum:</label>
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={styles.select}
            disabled={loading}
          />
        </div>

        <button 
          onClick={handleAnalysis}
          disabled={loading}
          style={styles.analyzeButton}
        >
          {loading ? "⏳ Analyseren..." : "🔍 Analyseer tips"}
        </button>
      </div>

      {error && <div style={styles.errorBox}>⚠️ {error}</div>}

      {results && renderTips()}

      {!results && !loading && !error && (
        <div style={styles.infoBox}>
          <h2>ℹ️ Hoe werkt het?</h2>
          <ul>
            <li>Selecteer competitie en datum</li>
            <li>Klik "Analyseer tips"</li>
            <li>{useWebSearch ? "Claude zoekt real-time odds" : "Claude geeft tips, jij voegt odds in"}</li>
            <li>Zie 15 tips + 3 verdubbelaars</li>
          </ul>
        </div>
      )}
    </div>
  );

  const renderTips = () => {
    if (!results || !results.data.tips) return null;

    const { low_risk, medium_risk, high_risk } = results.data.tips;

    return (
      <div style={styles.tipsContainer}>
        <div style={styles.statsRow}>
          <div style={styles.statCard("success")}>
            <p>🟢 LAAG RISICO</p>
            <p style={styles.statValue}>5 tips</p>
          </div>
          <div style={styles.statCard("warning")}>
            <p>🟡 GEMIDDELD</p>
            <p style={styles.statValue}>5 tips</p>
          </div>
          <div style={styles.statCard("danger")}>
            <p>🔴 HOOG RISICO</p>
            <p style={styles.statValue}>5 tips</p>
          </div>
        </div>

        {/* LAAG RISICO */}
        <div style={styles.riskSection}>
          <h2 style={styles.riskTitle("success")}>🟢 Laag risico (70%+)</h2>
          {low_risk && low_risk.map((tip) => (
            <div key={tip.id} style={styles.tipCard}>
              <div style={styles.tipTitle}>
                <h3 style={styles.matchVs}>{tip.bet}</h3>
                <p style={styles.winChance}>{tip.win_chance}%</p>
              </div>
              <p style={styles.tipBio}>{tip.why}</p>
              {tip.odds && (
                <div style={styles.bookmakerRow}>
                  <div style={styles.bookmakerItem}>
                    <p>Bet365</p>
                    <p style={styles.oddPrice}>{tip.odds.bet365 || "—"}</p>
                  </div>
                  <div style={styles.bookmakerItem}>
                    <p>Toto</p>
                    <p style={styles.oddPrice}>{tip.odds.toto || "—"}</p>
                  </div>
                  <div style={styles.bookmakerItem}>
                    <p>BetCity</p>
                    <p style={styles.oddPrice}>{tip.odds.betcity || "—"}</p>
                  </div>
                  <div style={styles.bookmakerItem}>
                    <p>Unibet</p>
                    <p style={styles.oddPrice}>{tip.odds.unibet || "—"}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* GEMIDDELD RISICO */}
        <div style={styles.riskSection}>
          <h2 style={styles.riskTitle("warning")}>🟡 Gemiddeld risico (55-70%)</h2>
          {medium_risk && medium_risk.map((tip) => (
            <div key={tip.id} style={styles.tipCard}>
              <div style={styles.tipTitle}>
                <h3 style={styles.matchVs}>{tip.bet}</h3>
                <p style={styles.winChance}>{tip.win_chance}%</p>
              </div>
              <p style={styles.tipBio}>{tip.why}</p>
              {tip.odds && (
                <div style={styles.bookmakerRow}>
                  <div style={styles.bookmakerItem}>
                    <p>Bet365</p>
                    <p style={styles.oddPrice}>{tip.odds.bet365 || "—"}</p>
                  </div>
                  <div style={styles.bookmakerItem}>
                    <p>Toto</p>
                    <p style={styles.oddPrice}>{tip.odds.toto || "—"}</p>
                  </div>
                  <div style={styles.bookmakerItem}>
                    <p>BetCity</p>
                    <p style={styles.oddPrice}>{tip.odds.betcity || "—"}</p>
                  </div>
                  <div style={styles.bookmakerItem}>
                    <p>Unibet</p>
                    <p style={styles.oddPrice}>{tip.odds.unibet || "—"}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* HOOG RISICO */}
        <div style={styles.riskSection}>
          <h2 style={styles.riskTitle("danger")}>🔴 Hoog risico (<55%)</h2>
          {high_risk && high_risk.map((tip) => (
            <div key={tip.id} style={styles.tipCard}>
              <div style={styles.tipTitle}>
                <h3 style={styles.matchVs}>{tip.bet}</h3>
                <p style={styles.winChance}>{tip.win_chance}%</p>
              </div>
              <p style={styles.tipBio}>{tip.why}</p>
              {tip.odds && (
                <div style={styles.bookmakerRow}>
                  <div style={styles.bookmakerItem}>
                    <p>Bet365</p>
                    <p style={styles.oddPrice}>{tip.odds.bet365 || "—"}</p>
                  </div>
                  <div style={styles.bookmakerItem}>
                    <p>Toto</p>
                    <p style={styles.oddPrice}>{tip.odds.toto || "—"}</p>
                  </div>
                  <div style={styles.bookmakerItem}>
                    <p>BetCity</p>
                    <p style={styles.oddPrice}>{tip.odds.betcity || "—"}</p>
                  </div>
                  <div style={styles.bookmakerItem}>
                    <p>Unibet</p>
                    <p style={styles.oddPrice}>{tip.odds.unibet || "—"}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* VERDUBBELAARS */}
        {results.data.parlay && results.data.parlay.length > 0 && (
          <div style={styles.riskSection}>
            <h2 style={styles.riskTitle("info")}>💰 Aanbevolen Verdubbelaars</h2>
            {results.data.parlay.map((parlay) => (
              <div key={parlay.id} style={styles.parlayCard(parlay.risk)}>
                <h3>{parlay.id}. {parlay.name}</h3>
                <p>{parlay.why}</p>
                <div style={styles.parlayBets}>
                  {parlay.bets && parlay.bets.map((bet, idx) => (
                    <p key={idx}>• {bet}</p>
                  ))}
                </div>
                <div style={styles.bookmakerRow}>
                  <div style={styles.bookmakerItem}>
                    <p>Bet365</p>
                    <p style={styles.oddPrice}>{parlay.odds?.bet365 || "—"}</p>
                  </div>
                  <div style={styles.bookmakerItem}>
                    <p>Toto</p>
                    <p style={styles.oddPrice}>{parlay.odds?.toto || "—"}</p>
                  </div>
                  <div style={styles.bookmakerItem}>
                    <p>BetCity</p>
                    <p style={styles.oddPrice}>{parlay.odds?.betcity || "—"}</p>
                  </div>
                  <div style={styles.bookmakerItem}>
                    <p>Unibet</p>
                    <p style={styles.oddPrice}>{parlay.odds?.unibet || "—"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPoule = () => (
    <div style={styles.pageContainer}>
      <button onClick={() => setCurrentPage("home")} style={styles.backButton}>
        ← Terug naar menu
      </button>
      <div style={styles.pageTitle}>📋 Poule & Uitslagen</div>
      <div style={styles.infoBox}>
        <p>Coming soon! 🚧</p>
        <p>Hier zullen groepindelingen en uitslagen verschijnen.</p>
      </div>
    </div>
  );

  const renderStats = () => (
    <div style={styles.pageContainer}>
      <button onClick={() => setCurrentPage("home")} style={styles.backButton}>
        ← Terug naar menu
      </button>
      <div style={styles.pageTitle}>🏆 Topscoorders & Statistieken</div>
      <div style={styles.infoBox}>
        <p>Coming soon! 🚧</p>
        <p>Hier zullen topscoorders en statistieken verschijnen.</p>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {currentPage === "home" && renderHome()}
      {currentPage === "betting" && renderBetting()}
      {currentPage === "poule" && renderPoule()}
      {currentPage === "stats" && renderStats()}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a472a 0%, #2d5a3d 25%, #1e3a52 50%, #2d3e5a 75%, #1a2d3a 100%)",
    backgroundAttachment: "fixed",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: "relative",
    overflow: "hidden"
  },

  // HOME PAGE
  homeContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },

  heroSection: {
    textAlign: "center",
    color: "white",
    marginBottom: "60px",
    zIndex: 2,
    position: "relative"
  },

  heroTitle: {
    fontSize: "48px",
    fontWeight: "800",
    margin: "0 0 10px",
    textShadow: "0 4px 10px rgba(0,0,0,0.5)",
    letterSpacing: "2px"
  },

  heroSubtitle: {
    fontSize: "18px",
    opacity: "0.9",
    margin: "0",
    textShadow: "0 2px 5px rgba(0,0,0,0.3)"
  },

  menuGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
    maxWidth: "900px",
    margin: "0 auto",
    zIndex: 2
  },

  menuButton: (gradientType) => {
    const gradients = {
      gradient1: "linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%)",
      gradient2: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)",
      gradient3: "linear-gradient(135deg, #FFD93D 0%, #FF9E1B 100%)",
      gradient4: "linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)"
    };

    return {
      background: gradients[gradientType],
      border: "none",
      borderRadius: "16px",
      padding: "40px 25px",
      cursor: "pointer",
      color: "white",
      textAlign: "center",
      transition: "all 0.3s ease",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      transform: "translateY(0)",
      aspectRatio: "1",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      ":hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 15px 40px rgba(0,0,0,0.4)"
      }
    };
  },

  menuIcon: {
    fontSize: "48px",
    marginBottom: "15px"
  },

  menuTitle: {
    fontSize: "20px",
    fontWeight: "700",
    margin: "0 0 10px",
    textShadow: "0 2px 4px rgba(0,0,0,0.2)"
  },

  menuDesc: {
    fontSize: "13px",
    opacity: "0.95",
    margin: "0",
    textShadow: "0 1px 2px rgba(0,0,0,0.2)"
  },

  menuPrice: {
    fontSize: "12px",
    marginTop: "10px",
    opacity: "0.85",
    fontWeight: "600"
  },

  footerHome: {
    marginTop: "60px",
    color: "white",
    textAlign: "center",
    opacity: "0.8",
    fontSize: "14px"
  },

  // PAGE CONTAINER
  pageContainer: {
    maxWidth: "900px",
    margin: "0 auto",
    position: "relative",
    zIndex: 2
  },

  backButton: {
    background: "rgba(255,255,255,0.1)",
    border: "2px solid white",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "20px",
    transition: "all 0.3s",
    ":hover": {
      background: "rgba(255,255,255,0.2)"
    }
  },

  bettingHeader: {
    background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
    border: "2px solid rgba(255,255,255,0.2)",
    borderRadius: "12px",
    padding: "25px",
    color: "white",
    marginBottom: "25px",
    backdropFilter: "blur(10px)"
  },

  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "white",
    marginBottom: "25px",
    textShadow: "0 2px 5px rgba(0,0,0,0.3)"
  },

  controlPanel: {
    background: "white",
    borderRadius: "12px",
    padding: "25px",
    marginBottom: "25px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  },

  section: {
    marginBottom: "20px"
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#333",
    fontSize: "14px"
  },

  select: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "2px solid #4ECDC4",
    backgroundColor: "white",
    color: "#333",
    cursor: "pointer"
  },

  analyzeButton: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "700",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
  },

  errorBox: {
    background: "#FFE0E0",
    color: "#C33",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "2px solid #F99"
  },

  infoBox: {
    background: "white",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    color: "#333"
  },

  tipsContainer: {
    background: "white",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  },

  statsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px",
    marginBottom: "25px"
  },

  statCard: (type) => ({
    background: type === "success" ? "#E8F5E9" : type === "warning" ? "#FFF3E0" : "#FFEBEE",
    borderRadius: "8px",
    padding: "12px",
    textAlign: "center",
    color: type === "success" ? "#2E7D32" : type === "warning" ? "#E65100" : "#C62828"
  }),

  statValue: {
    fontSize: "20px",
    fontWeight: "700",
    margin: "8px 0 0"
  },

  riskSection: {
    marginBottom: "30px"
  },

  riskTitle: (type) => ({
    fontSize: "16px",
    fontWeight: "700",
    color: type === "success" ? "#2E7D32" : type === "warning" ? "#E65100" : type === "danger" ? "#C62828" : "#1565C0",
    margin: "0 0 15px",
    paddingBottom: "10px",
    borderBottom: `3px solid ${type === "success" ? "#4CAF50" : type === "warning" ? "#FF9800" : type === "danger" ? "#F44336" : "#2196F3"}`
  }),

  tipCard: {
    background: "#F9F9F9",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "12px"
  },

  tipTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px"
  },

  matchVs: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#333",
    margin: "0",
    flex: 1
  },

  winChance: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#4CAF50",
    margin: "0",
    marginLeft: "12px"
  },

  tipBio: {
    fontSize: "12px",
    color: "#666",
    margin: "0 0 12px",
    lineHeight: "1.5"
  },

  bookmakerRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: "8px",
    paddingTop: "12px",
    borderTop: "1px solid #E0E0E0"
  },

  bookmakerItem: {
    textAlign: "center",
    background: "#F0F0F0",
    borderRadius: "6px",
    padding: "8px",
    fontSize: "11px"
  },

  oddPrice: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#333",
    margin: "4px 0 0"
  },

  parlayCard: (risk) => ({
    background: risk === "low" ? "#E3F2FD" : risk === "medium" ? "#FFF8E1" : "#FFEBEE",
    border: `2px solid ${risk === "low" ? "#2196F3" : risk === "medium" ? "#FBC02D" : "#F44336"}`,
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "12px"
  }),

  parlayBets: {
    fontSize: "12px",
    color: "#333",
    margin: "10px 0",
    lineHeight: "1.6"
  }
};
