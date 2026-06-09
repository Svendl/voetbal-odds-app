import { useState } from "react";

export default function Home() {
  const [league, setLeague] = useState("wk-2026");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleBestOdds = async () => {
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
          date: selectedDate
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

  const renderTips = () => {
    if (!results || !results.data.tips) return null;

    const { low_risk, medium_risk, high_risk } = results.data.tips;

    return (
      <div style={styles.tipsContainer}>
        <div style={styles.statsRow}>
          <div style={styles.statCard("success")}>
            <p style={styles.statLabel}>🟢 LAAG RISICO</p>
            <p style={styles.statValue}>5 tips</p>
          </div>
          <div style={styles.statCard("warning")}>
            <p style={styles.statLabel}>🟡 GEMIDDELD</p>
            <p style={styles.statValue}>5 tips</p>
          </div>
          <div style={styles.statCard("danger")}>
            <p style={styles.statLabel}>🔴 HOOG RISICO</p>
            <p style={styles.statValue}>5 tips</p>
          </div>
        </div>

        {/* LAAG RISICO */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle("success")}>
            <i className="ti ti-shield-check" style={styles.icon("success")} aria-hidden="true"></i>
            Laag risico (70%+)
          </h2>
          {low_risk && low_risk.map((tip) => (
            <div key={tip.id} style={styles.tipCard}>
              <div style={styles.tipHeader}>
                <div style={styles.tipInfo}>
                  <p style={styles.tipBet}>{tip.bet}</p>
                  <p style={styles.tipDesc}>{tip.why}</p>
                </div>
                <div style={styles.tipOdds}>
                  <p style={styles.oddsValue}>{tip.odds}</p>
                  <p style={styles.winkans("success")}>{tip.win_chance}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* GEMIDDELD RISICO */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle("warning")}>
            <i className="ti ti-alert-circle" style={styles.icon("warning")} aria-hidden="true"></i>
            Gemiddeld risico (55-70%)
          </h2>
          {medium_risk && medium_risk.map((tip) => (
            <div key={tip.id} style={styles.tipCard}>
              <div style={styles.tipHeader}>
                <div style={styles.tipInfo}>
                  <p style={styles.tipBet}>{tip.bet}</p>
                  <p style={styles.tipDesc}>{tip.why}</p>
                </div>
                <div style={styles.tipOdds}>
                  <p style={styles.oddsValue}>{tip.odds}</p>
                  <p style={styles.winkans("warning")}>{tip.win_chance}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* HOOG RISICO */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle("danger")}>
            <i className="ti ti-flame" style={styles.icon("danger")} aria-hidden="true"></i>
            Hoog risico (&lt;55%)
          </h2>
          {high_risk && high_risk.map((tip) => (
            <div key={tip.id} style={styles.tipCard}>
              <div style={styles.tipHeader}>
                <div style={styles.tipInfo}>
                  <p style={styles.tipBet}>{tip.bet}</p>
                  <p style={styles.tipDesc}>{tip.why}</p>
                </div>
                <div style={styles.tipOdds}>
                  <p style={styles.oddsValue}>{tip.odds}</p>
                  <p style={styles.winkans("danger")}>{tip.win_chance}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* VERDUBBELAARS */}
        {results.data.parlay && results.data.parlay.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle("info")}>
              <i className="ti ti-trending-up" style={styles.icon("info")} aria-hidden="true"></i>
              3 Aanbevolen Verdubbelaars
            </h2>
            {results.data.parlay.map((parlay) => (
              <div key={parlay.id} style={styles.parlayCard(parlay.risk)}>
                <h3 style={styles.parlayTitle}>{parlay.id}. {parlay.name}</h3>
                <div style={styles.parlayBets}>
                  {parlay.bets && parlay.bets.map((bet, idx) => (
                    <p key={idx} style={styles.parlayBet}>{bet}</p>
                  ))}
                </div>
                <div style={styles.parlayStats}>
                  <div style={styles.parlayStatBox}>
                    <p style={styles.statLabel}>Odds</p>
                    <p style={styles.parlayValue}>{parlay.odds}</p>
                  </div>
                  <div style={styles.parlayStatBox}>
                    <p style={styles.statLabel}>Winkans</p>
                    <p style={styles.parlayValue}>{parlay.win_chance}%</p>
                  </div>
                  <div style={styles.parlayStatBox}>
                    <p style={styles.statLabel}>Risico</p>
                    <p style={styles.parlayValue}>{parlay.risk === "low" ? "Laag" : parlay.risk === "medium" ? "Gem." : "Hoog"}</p>
                  </div>
                </div>
                <p style={styles.parlayStrategy}><strong>Strategie:</strong> {parlay.strategy}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>⚽ Voetbal Odds Analyzer</h1>
        <p style={styles.subtitle}>AI-aangestuurde voetbal tips & odds analyse</p>
      </div>

      <div style={styles.controlPanel}>
        <div style={styles.section}>
          <label style={styles.label}>📍 Kies competitie:</label>
          <select 
            value={league} 
            onChange={(e) => setLeague(e.target.value)}
            style={styles.select}
            disabled={loading}
          >
            <option value="la-liga">🇪🇸 La Liga (Spanje)</option>
            <option value="premier-league">🇬🇧 Premier League (Engeland)</option>
            <option value="serie-a">🇮🇹 Serie A (Italië)</option>
            <option value="bundesliga">🇩🇪 Bundesliga (Duitsland)</option>
            <option value="ligue-1">🇫🇷 Ligue 1 (Frankrijk)</option>
            <option value="eredivisie">🇳🇱 Eredivisie (Nederland)</option>
            <option value="mls">🇺🇸 MLS (Amerika)</option>
            <option value="wk-2026">🏆 WK 2026</option>
          </select>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>📅 Kies datum:</label>
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={styles.select}
            disabled={loading}
          />
        </div>

        <div style={styles.buttonGroup}>
          <button 
            onClick={handleBestOdds}
            disabled={loading}
            style={{...styles.button, ...styles.buttonPrimary}}
          >
            {loading ? "⏳ Laden..." : "💰 Beste odds"}
          </button>
        </div>
      </div>

      {error && (
        <div style={styles.errorBox}>
          ⚠️ {error}
        </div>
      )}

      {results && renderTips()}

      {!results && !loading && !error && (
        <div style={styles.infoBox}>
          <h2>ℹ️ Hoe werkt het?</h2>
          <ul>
            <li>Selecteer je favoriete competitie</li>
            <li>Kies een datum</li>
            <li>Klik "Beste odds" voor AI-analyse</li>
            <li>Claude geeft 15 tips + 3 verdubbelaars</li>
            <li>Risicoclassificatie: Laag/Gemiddeld/Hoog</li>
          </ul>
          <p style={styles.disclaimer}>
            ⚠️ <strong>Disclaimer:</strong> Dit zijn AI-gebaseerde analyses. Verifieer altijd bij je bookmaker. Speel verantwoord — 18+.
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    textAlign: "center",
    color: "white",
    marginBottom: "40px",
    paddingTop: "20px"
  },
  title: {
    fontSize: "42px",
    margin: "0 0 10px 0",
    fontWeight: "700"
  },
  subtitle: {
    fontSize: "16px",
    margin: "0",
    opacity: "0.9"
  },
  controlPanel: {
    maxWidth: "800px",
    margin: "0 auto 30px",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
  },
  section: {
    marginBottom: "25px"
  },
  label: {
    display: "block",
    marginBottom: "10px",
    fontWeight: "600",
    color: "#333",
    fontSize: "16px"
  },
  select: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "2px solid #667eea",
    backgroundColor: "white",
    color: "#333",
    cursor: "pointer"
  },
  buttonGroup: {
    display: "flex",
    gap: "15px",
    marginTop: "25px"
  },
  button: {
    padding: "16px",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    color: "white",
    flex: 1
  },
  buttonPrimary: {
    backgroundColor: "#667eea"
  },
  errorBox: {
    maxWidth: "800px",
    margin: "0 auto 20px",
    backgroundColor: "#fee",
    color: "#c33",
    padding: "16px",
    borderRadius: "8px",
    border: "2px solid #f99"
  },
  tipsContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px",
    marginBottom: "30px"
  },
  statCard: (type) => ({
    background: type === "success" ? "#E8F5E9" : type === "warning" ? "#FFF3E0" : "#FFEBEE",
    borderRadius: "8px",
    padding: "12px",
    textAlign: "center"
  }),
  statLabel: {
    fontSize: "12px",
    margin: "0",
    fontWeight: "500",
    color: "#666"
  },
  statValue: {
    fontSize: "20px",
    margin: "4px 0 0",
    fontWeight: "500",
    color: "#333"
  },
  sectionTitle: (type) => ({
    fontSize: "16px",
    fontWeight: "500",
    color: "#333",
    margin: "0 0 12px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  }),
  icon: (type) => ({
    fontSize: "20px",
    color: type === "success" ? "#4CAF50" : type === "warning" ? "#FF9800" : type === "danger" ? "#F44336" : "#2196F3"
  }),
  tipCard: {
    background: "white",
    border: "0.5px solid #e0e0e0",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "10px"
  },
  tipHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  tipInfo: {
    flex: 1
  },
  tipBet: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#333",
    margin: "0"
  },
  tipDesc: {
    fontSize: "12px",
    color: "#666",
    margin: "6px 0 0"
  },
  tipOdds: {
    textAlign: "right",
    marginLeft: "16px"
  },
  oddsValue: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#333",
    margin: "0"
  },
  winkans: (type) => ({
    fontSize: "11px",
    margin: "2px 0 0",
    color: type === "success" ? "#4CAF50" : type === "warning" ? "#FF9800" : "#F44336"
  }),
  parlayCard: (risk) => ({
    background: risk === "low" ? "#E3F2FD" : risk === "medium" ? "#FFF8E1" : "#FFEBEE",
    border: `2px solid ${risk === "low" ? "#2196F3" : risk === "medium" ? "#FBC02D" : "#F44336"}`,
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "12px"
  }),
  parlayTitle: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
    margin: "0 0 12px"
  },
  parlayBets: {
    background: "rgba(255,255,255,0.6)",
    borderRadius: "6px",
    padding: "10px",
    marginBottom: "12px"
  },
  parlayBet: {
    fontSize: "12px",
    color: "#333",
    margin: "4px 0"
  },
  parlayStats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
    marginBottom: "12px"
  },
  parlayStatBox: {
    background: "rgba(255,255,255,0.5)",
    borderRadius: "6px",
    padding: "8px",
    textAlign: "center"
  },
  parlayValue: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#333",
    margin: "2px 0 0"
  },
  parlayStrategy: {
    fontSize: "12px",
    color: "#333",
    margin: "0",
    lineHeight: "1.5"
  },
  infoBox: {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    color: "#333"
  },
  disclaimer: {
    marginTop: "15px",
    padding: "15px",
    backgroundColor: "#fff3cd",
    borderLeft: "4px solid #ffc107",
    fontSize: "13px"
  }
};
