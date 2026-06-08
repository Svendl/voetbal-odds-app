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
          <button 
            onClick={handleTodaysMatches}
            disabled={loading}
            style={{...styles.button, ...styles.buttonPrimary}}
          >
            {loading ? "⏳ Laden..." : "📅 Wie voetbalt er vandaag?"}
          </button>
          <button 
            onClick={handleBestOdds}
            disabled={loading}
            style={{...styles.button, ...styles.buttonSecondary}}
          >
            {loading ? "⏳ Laden..." : "💰 Beste odds vandaag"}
          </button>
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
            {results.type === "matches" ? "📋 Wedstrijden" : "🎯 Beste Odds Tips"}
          </di
