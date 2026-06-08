// pages/index.js
import { useState } from "react";

export default function Home() {
  const [league, setLeague] = useState("la-liga");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleTodaysMatches = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const today = selectedDate;
      const response = await fetch("/api/analyze-odds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisType: "matches",
          league: league,
          date: today
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setResults({
        type: "matches",
        content: data.analysis
      });
    } catch (err) {
      setError(`Fout: ${err.message}`);
    }
    setLoading(false);
  };

  const handleBestOdds = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const today = selectedDate;
      const response = await fetch("/api/analyze-odds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisType: "best-odds",
          league: league,
          date: today
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setResults({
        type: "odds",
        content: data.analysis
      });
    } catch (err) {
      setError(`Fout: ${err.message}`);
    }
    setLoading(false);
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
    {/* buttons hier */}
  </div>
</div>

      {error && (
        <div style={styles.errorBox}>
          ⚠️ {error}
        </div>
      )}

      {results && (
        <div style={styles.resultsBox}>
          <div style={styles.resultsHeader}>
            {results.type === "matches" ? "📋 Wedstrijden vandaag" : "🎯 Beste Odds Tips"}
          </div>
          <pre style={styles.resultsContent}>
            {results.content}
          </pre>
          <div style={styles.resultsFooter}>
            💡 Tip: Controleer altijd de actuele odds bij je bookmaker
          </div>
        </div>
      )}

      {!results && !loading && !error && (
        <div style={styles.infoBox}>
          <h2>ℹ️ Hoe werkt het?</h2>
          <ul>
            <li>Selecteer je favoriete competitie</li>
            <li>Klik "Wie voetbalt er vandaag?" om alle matches te zien</li>
            <li>Of klik "Beste odds vandaag?" voor AI-analyse van topweddenschappen</li>
            <li>Claude AI analyseert live data en geeft sterke tips met odds</li>
            <li>Alle tips hebben een risicoclassificatie (Laag/Gemiddeld/Hoog)</li>
          </ul>
          <p style={styles.disclaimer}>
            ⚠️ <strong>Disclaimer:</strong> Dit zijn AI-gebaseerde analysees. Verifieer altijd bij je bookmaker. Speel verantwoord — 18+.
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
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
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
    color: "white"
  },
  buttonPrimary: {
    backgroundColor: "#667eea"
  },
  buttonSecondary: {
    backgroundColor: "#764ba2"
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
  resultsBox: {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
  },
  resultsHeader: {
    backgroundColor: "#667eea",
    color: "white",
    padding: "20px",
    fontSize: "18px",
    fontWeight: "600"
  },
  resultsContent: {
    padding: "20px",
    fontSize: "14px",
    lineHeight: "1.6",
    margin: "0",
    maxHeight: "600px",
    overflowY: "auto",
    fontFamily: "Courier New, monospace",
    whiteSpace: "pre-wrap"
  },
  resultsFooter: {
    backgroundColor: "#f5f5f5",
    padding: "15px 20px",
    fontSize: "13px",
    color: "#666",
    borderTop: "1px solid #ddd"
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
