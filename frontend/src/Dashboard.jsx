import { useEffect, useState } from "react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Space Grotesk', sans-serif;
    background: #080e1a;
    color: #e2e8f0;
  }

  .app { background: #080e1a; min-height: 100vh; width: 100%; margin: 0; padding: 0; }

  /* ── NAVBAR ── */
  .navbar {
    background: #0d1525;
    border-bottom: 1px solid #1a2744;
    padding: 0 16px;
    height: 64px;
    display: flex;
    align-items: center;
    gap: 24px;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .nav-logo {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    box-shadow: 0 0 16px rgba(59,130,246,0.4);
  }

  .nav-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 18px;
    font-weight: 700;
    color: #f1f5f9;
    letter-spacing: -0.5px;
  }

  .nav-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    background: rgba(59,130,246,0.15);
    border: 1px solid rgba(59,130,246,0.3);
    color: #60a5fa;
    padding: 3px 7px;
    border-radius: 4px;
    letter-spacing: 1px;
  }

  .nav-search-wrap {
    flex: 1;
    display: flex;
    justify-content: center;
    padding: 0 20px;
  }

  .nav-search-form {
    width: 100%;
    max-width: 600px;
    display: flex;
    align-items: center;
    background: #131e33;
    border: 1px solid #1e2f4a;
    border-radius: 10px;
    padding: 0 16px;
    gap: 10px;
    transition: border-color 0.2s;
  }

  .nav-search-form:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  }

  .nav-search-icon { color: #4b6080; font-size: 14px; }

  .nav-search-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #e2e8f0;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14px;
    padding: 10px 0;
  }

  .nav-search-input::placeholder { color: #4b6080; }

  .nav-search-btn {
    background: #3b82f6;
    border: none;
    color: white;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 7px;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }

  .nav-search-btn:hover { background: #2563eb; }
  .nav-search-btn:disabled { background: #334155; cursor: not-allowed; }

  .nav-tabs {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }

  .nav-tab {
    background: transparent;
    border: none;
    color: #4b6080;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    letter-spacing: 0.5px;
    transition: all 0.2s;
  }

  .nav-tab:hover { color: #94a3b8; background: rgba(255,255,255,0.04); }

  .nav-tab.active {
    background: #3b82f6;
    color: white;
  }

  /* ── MAIN LAYOUT ── */
  .main {
    padding: 24px 16px;
    width: 100%;
    max-width: none;
    margin: 0;
  }

  /* ── STOCK HEADER ROW ── */
  .stock-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
  }

  .stock-globe { color: #4b6080; font-size: 18px; }

  .stock-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: 22px;
    font-weight: 700;
    color: #f1f5f9;
    letter-spacing: -0.5px;
  }

  .sentiment-badge {
    padding: 4px 10px;
    border-radius: 5px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    font-family: 'JetBrains Mono', monospace;
  }

  .sentiment-bearish {
    background: rgba(239,68,68,0.15);
    border: 1px solid rgba(239,68,68,0.3);
    color: #f87171;
  }

  .sentiment-bullish {
    background: rgba(16,185,129,0.15);
    border: 1px solid rgba(16,185,129,0.3);
    color: #34d399;
  }

  .stock-price-right {
    margin-left: auto;
    text-align: right;
  }

  .price-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 32px;
    font-weight: 700;
    color: #f1f5f9;
    line-height: 1;
  }

  .price-change {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
    justify-content: flex-end;
  }

  .mode-tag {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #4b6080;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    margin-top: 2px;
  }

  /* ── CENTER CONTENT GRID ── */
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 24px;
    margin-bottom: 24px;
  }

  /* ── CHART CARD ── */
  .chart-card {
    background: #0d1525;
    border: 1px solid #1a2744;
    border-radius: 16px;
    padding: 20px 24px 16px;
    position: relative;
    overflow: hidden;
  }

  .chart-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #3b82f6, transparent);
    opacity: 0.6;
  }

  /* ── SIGNAL CARD ── */
  .signal-card {
    background: #0d1525;
    border: 1px solid #1a2744;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .signal-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    color: #4b6080;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .signal-label-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #3b82f6;
    box-shadow: 0 0 8px #3b82f6;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .signal-direction {
    text-align: center;
    padding: 20px 16px;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
  }

  .signal-direction-up {
    background: linear-gradient(135deg, #064e3b, #065f46);
    border: 1px solid #10b981;
  }

  .signal-direction-down {
    background: linear-gradient(135deg, #450a0a, #7f1d1d);
    border: 1px solid #ef4444;
  }

  .signal-dir-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 52px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -2px;
  }

  .signal-dir-up { color: #34d399; text-shadow: 0 0 30px rgba(16,185,129,0.6); }
  .signal-dir-down { color: #f87171; text-shadow: 0 0 30px rgba(239,68,68,0.6); }

  .signal-prob-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }

  .signal-prob-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: rgba(255,255,255,0.5);
    letter-spacing: 1px;
  }

  .signal-prob-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 20px;
    font-weight: 700;
    color: white;
  }

  .signal-forecast-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 1.5px;
    color: rgba(255,255,255,0.4);
    margin-top: 4px;
  }

  /* Strength score */
  .strength-block {
    background: #080e1a;
    border: 1px solid #1a2744;
    border-radius: 10px;
    padding: 14px 16px;
  }

  .strength-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .strength-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    color: #4b6080;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .strength-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 18px;
    font-weight: 700;
    color: #f1f5f9;
  }

  .strength-bar-bg {
    background: #1a2744;
    height: 6px;
    border-radius: 3px;
    overflow: hidden;
  }

  .strength-bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.6s ease;
  }

  /* Advisory Button */
  .advisory-btn {
    background: linear-gradient(135deg, #2563eb, #3b82f6);
    border: none;
    color: white;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14px;
    font-weight: 700;
    padding: 13px;
    border-radius: 10px;
    cursor: pointer;
    width: 100%;
    letter-spacing: 0.5px;
    transition: all 0.2s;
    box-shadow: 0 4px 16px rgba(59,130,246,0.3);
  }

  .advisory-btn:hover {
    background: linear-gradient(135deg, #1d4ed8, #2563eb);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(59,130,246,0.4);
  }

  /* VQC info */
  .vqc-info {
    background: #080e1a;
    border: 1px solid #1a2744;
    border-radius: 10px;
    padding: 14px 16px;
  }

  .vqc-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .vqc-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 8px #10b981;
    flex-shrink: 0;
  }

  .vqc-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #94a3b8;
  }

  .vqc-text strong { color: #e2e8f0; }

  /* ── BOTTOM MODEL CARDS ── */
  .model-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .model-card {
    background: #0d1525;
    border: 1px solid #1a2744;
    border-radius: 16px;
    padding: 20px 24px;
  }

  .model-card-quantum {
    border-color: #1e3a5f;
    box-shadow: 0 0 30px rgba(59,130,246,0.07);
  }

  .model-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .model-card-title {
    font-size: 15px;
    font-weight: 600;
    color: #e2e8f0;
  }

  .model-card-sub {
    font-size: 12px;
    color: #4b6080;
    font-family: 'JetBrains Mono', monospace;
  }

  .model-card-winner {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #3b82f6;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .model-prediction {
    background: #080e1a;
    border: 1px solid #1a2744;
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 12px;
  }

  .model-pred-label {
    font-size: 11px;
    color: #4b6080;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  .model-pred-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 26px;
    font-weight: 700;
    color: #f1f5f9;
  }

  .model-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .model-stat {
    background: #080e1a;
    border: 1px solid #1a2744;
    border-radius: 8px;
    padding: 10px 12px;
  }

  .model-stat-label {
    font-size: 11px;
    color: #4b6080;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.8px;
    margin-bottom: 4px;
  }

  .model-stat-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 18px;
    font-weight: 700;
    color: #e2e8f0;
  }

  /* ── COMPARISON TAB ── */
  .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  .comp-table { width: 100%; border-collapse: collapse; }
  .comp-table th {
    text-align: left; padding: 10px 14px;
    color: #4b6080; font-size: 11px; font-weight: 600;
    letter-spacing: 1px; font-family: 'JetBrains Mono', monospace;
    border-bottom: 1px solid #1a2744;
  }
  .comp-table th:not(:first-child) { text-align: center; }
  .comp-table td { padding: 12px 14px; font-size: 14px; border-bottom: 1px solid #0d1525; }
  .comp-table td:first-child { color: #94a3b8; }
  .comp-table td:nth-child(2) { text-align: center; color: #64748b; font-family: 'JetBrains Mono', monospace; }
  .comp-table td:nth-child(3) { text-align: center; color: #3b82f6; font-family: 'JetBrains Mono', monospace; font-weight: 700; }

  .perf-label { font-size: 13px; color: #94a3b8; }
  .perf-val { font-size: 13px; font-weight: 700; color: #e2e8f0; }
  .perf-bar-bg { background: #0d1525; height: 8px; border-radius: 4px; overflow: hidden; margin-top: 8px; }
  .perf-bar-fill { height: 100%; border-radius: 4px; }

  /* Advisory content */
  .advisory-output {
    margin-top: 16px;
    padding: 16px;
    background: rgba(59, 130, 246, 0.05);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 10px;
    font-size: 13px;
    line-height: 1.6;
    color: #e2e8f0;
    white-space: pre-wrap;
  }
  .advisory-output h3 {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    color: #60a5fa;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .advisory-output strong { color: #fff; }

  /* ── LOADING ── */
  .loading-screen {
    background: #080e1a; min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 16px;
  }
  .loading-icon { font-size: 40px; animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .loading-text { font-family: 'JetBrains Mono', monospace; font-size: 16px; color: #4b6080; }

  /* Tooltip custom */
  .recharts-tooltip-wrapper { outline: none; }

  /* Asset Dropdown */
  .asset-select-wrap {
    background: #131e33;
    border: 1px solid #1e2f4a;
    border-radius: 8px;
    padding: 6px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s;
    margin-right: 12px;
    position: relative;
  }

  .asset-select-wrap:hover {
    border-color: #3b82f6;
    background: #1a2744;
  }

  .asset-select-label {
    font-size: 11px;
    color: #4b6080;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 1px;
  }

  .asset-select-value {
    font-size: 14px;
    font-weight: 600;
    color: #f1f5f9;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .asset-dropdown-list {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 240px;
    background: #0d1525;
    border: 1px solid #1a2744;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    z-index: 1000;
    max-height: 300px;
    overflow-y: auto;
    padding: 6px;
  }

  .asset-option {
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .asset-option:hover {
    background: rgba(59, 130, 246, 0.1);
    color: #f1f5f9;
  }

  .asset-option.active {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
    font-weight: 600;
  }

  /* Collapsible Advisory */
  .advisory-box {
    margin-top: 12px;
    border: 1px solid #1a2744;
    border-radius: 12px;
    overflow: hidden;
    background: #0d1525;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .advisory-box-header {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    background: rgba(59, 130, 246, 0.05);
  }

  .advisory-box-header:hover {
    background: rgba(59, 130, 246, 0.1);
  }

  .advisory-toggle-arrow {
    font-size: 10px;
    transition: transform 0.3s;
    color: #4b6080;
  }

  .advisory-toggle-arrow.open {
    transform: rotate(180deg);
    color: #3b82f6;
  }

  .advisory-collapse-content {
    max-height: 0;
    opacity: 0;
    transition: all 0.3s ease-in-out;
    padding: 0 16px;
  }

  .advisory-collapse-content.open {
    max-height: 800px;
    opacity: 1;
    padding: 16px;
    border-top: 1px solid rgba(59, 130, 246, 0.1);
  }
`

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [searchSymbol, setSearchSymbol] = useState("^NSEI")
  const [inputValue, setInputValue] = useState("Nifty 50")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [error, setError] = useState("")
  const [advisory, setAdvisory] = useState("")
  const [advisoryLoading, setAdvisoryLoading] = useState(false)
  const [advisoryExpanded, setAdvisoryExpanded] = useState(false)
  const [showAssetDropdown, setShowAssetDropdown] = useState(false)

  const popularStocks = [
    { symbol: "^NSEI", name: "Nifty 50 Index" },
    { symbol: "RELIANCE.NS", name: "Reliance Industries" },
    { symbol: "TCS.NS", name: "Tata Consultancy Services" },
    { symbol: "HDFCBANK.NS", name: "HDFC Bank" },
    { symbol: "ICICIBANK.NS", name: "ICICI Bank" },
    { symbol: "INFY.NS", name: "Infosys" },
    { symbol: "HINDUNILVR.NS", name: "Hindustan Unilever" },
    { symbol: "ITC.NS", name: "ITC Limited" },
    { symbol: "KOTAKBANK.NS", name: "Kotak Mahindra Bank" },
    { symbol: "LT.NS", name: "Larsen & Toubro" },
    { symbol: "AXISBANK.NS", name: "Axis Bank" },
    { symbol: "BAJFINANCE.NS", name: "Bajaj Finance" },
    { symbol: "MARUTI.NS", name: "Maruti Suzuki" },
    { symbol: "BHARTIARTL.NS", name: "Bharti Airtel" },
  ]

  const fetchData = (symbol) => {
    setLoading(true)
    setData(null)
    setAdvisory("")
    setError("")
    fetch(`/api/predict?symbol=${encodeURIComponent(symbol)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        return res.json()
      })
      .then((result) => {
        if (result.error) {
          setError(result.error)
          setData(null)
        } else {
          setData(result)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching data:", err)
        setError("Market data unavailable. Please check the stock symbol.")
        setLoading(false)
      })
  }

  const handleAdvisory = () => {
    if (!data || advisoryLoading) return
    setAdvisoryLoading(true)

    fetch('/api/advisory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbol: data.symbol,
        current_price: data.current_price,
        classical_prediction: data.classical_prediction,
        quantum_prediction: data.quantum_prediction,
        winner: data.winner,
        market_direction: data.market_direction,
        direction_confidence: data.direction_confidence,
        classical_train_accuracy: data.classical_train_accuracy,
        quantum_train_accuracy: data.quantum_train_accuracy
      })
    })
      .then(res => res.json())
      .then(result => {
        setAdvisory(result.summary)
        setAdvisoryLoading(false)
        setAdvisoryExpanded(true)
      })
      .catch(err => {
        console.error("Advisory error:", err)
        setAdvisoryLoading(false)
      })
  }

  useEffect(() => { fetchData(searchSymbol) }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const query = inputValue.trim()
    if (!query) return

    // try to match popularStocks first
    const stock = popularStocks.find(
      (s) => s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.symbol.toLowerCase().includes(query.toLowerCase())
    )

    let symbol = ""
    if (stock) {
      symbol = stock.symbol
      setInputValue(stock.name) // Sync input with full name
    } else {
      // For arbitrary input, try to sanitize it as a symbol
      let upperQuery = query.toUpperCase()

      // If it looks like a symbol but doesn't have .NS, append it
      if (!upperQuery.includes(".") && !upperQuery.includes("^")) {
        symbol = `${upperQuery}.NS`
      } else {
        symbol = upperQuery
      }
    }

    setSearchSymbol(symbol)
    fetchData(symbol)
  }

  const getCompanyName = () => {
    if (!data) return ""
    if (data.symbol === "^NSEI") return "NIFTY50"
    return data.symbol.replace(".NS", "")
  }

  const getStrengthColor = (confidence) => {
    if (confidence > 70) return "#10b981"
    if (confidence > 50) return "#f59e0b"
    return "#3b82f6"
  }

  // compute accuracy percentages for comparison tab based on training performance
  const classicalAccuracy = data ? (data.classical_train_accuracy || 0).toFixed(1) : "0"
  const quantumAccuracy = data ? (data.quantum_train_accuracy || 0).toFixed(1) : "0"

  const getDayChange = () => {
    if (!data?.chart_data || data.chart_data.length < 2) return { text: "0%", pos: true }
    const lastPrice = data.chart_data[data.chart_data.length - 1].price
    const firstPrice = data.chart_data[0].price
    const change = ((lastPrice - firstPrice) / firstPrice * 100).toFixed(2)
    const pos = change >= 0
    return { text: `${pos ? "+" : ""}${change}%`, pos }
  }

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="loading-screen">
        <div className="loading-icon">⚡</div>
        <div className="loading-text">Loading market analysis...</div>
      </div>
    </>
  )

  // if we're not loading and still have no data, show navbar + error/placeholder
  if (!data) {
    return (
      <>
        <style>{styles}</style>
        <div className="app">
          <nav className="navbar">
            <div className="nav-brand">
              <div className="nav-logo">⚡</div>
              <div>
                <div className="nav-title">QuantumPredict</div>
              </div>
              <div className="nav-badge">ADVANCED ML ENGINE</div>
            </div>

            <div className="nav-search-wrap">
              <form className="nav-search-form" onSubmit={handleSearch}>
                <span className="nav-search-icon">🔍</span>
                <input
                  className="nav-search-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter asset (e.g. BTC, NVIDIA, GOLD)..."
                />
                <button className="nav-search-btn" type="submit" disabled={loading}>
                  {loading ? "..." : "Search"}
                </button>
              </form>
              {error && <div style={{ color: '#f87171', marginTop: '4px', fontSize: '13px' }}>{error}</div>}
            </div>

            <div className="nav-tabs">
              <button
                className={`nav-tab ${activeTab === "dashboard" ? "active" : ""}`}
                onClick={() => setActiveTab("dashboard")}
              >
                DASHBOARD
              </button>
              <button
                className={`nav-tab ${activeTab === "comparison" ? "active" : ""}`}
                onClick={() => setActiveTab("comparison")}
              >
                COMPARISON
              </button>
            </div>
          </nav>

          <div className="main">
            <div style={{ padding: '40px', color: '#f87171', textAlign: 'center' }}>
              {error || "Search for a Nifty 50 company to see data"}
            </div>
          </div>
        </div>
      </>
    )
  }

  const dayChange = getDayChange()
  const isUp = data.market_direction === "UP"

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* NAVBAR */}
        <nav className="navbar">
          <div className="nav-brand">
            <div className="nav-logo">⚡</div>
            <div>
              <div className="nav-title">QuantumPredict</div>
            </div>
            <div className="nav-badge">ADVANCED ML ENGINE</div>
          </div>

          <div className="nav-search-wrap">
            <form className="nav-search-form" onSubmit={handleSearch}>
              <span className="nav-search-icon">🔍</span>
              <input
                className="nav-search-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter asset (e.g. BTC, NVIDIA, GOLD)..."
              />
              <button className="nav-search-btn" type="submit" disabled={loading}>
                {loading ? "..." : "Search"}
              </button>
            </form>
            {error && <div style={{ color: '#f87171', marginTop: '4px', fontSize: '13px' }}>{error}</div>}
          </div>

          <div className="nav-tabs">
            {/* Asset Selection Dropdown */}
            <div className="asset-select-wrap" onClick={() => setShowAssetDropdown(!showAssetDropdown)} style={{ position: 'relative' }}>
              <span className="asset-select-label">WATCHING INFO</span>
              <span className="asset-select-value">
                {getCompanyName()} <span style={{ fontSize: '10px', opacity: 0.6 }}>{showAssetDropdown ? "▲" : "▼"}</span>
              </span>

              {showAssetDropdown && (
                <div className="asset-dropdown-list">
                  {popularStocks.map(stock => (
                    <div
                      key={stock.symbol}
                      className={`asset-option ${searchSymbol === stock.symbol ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchSymbol(stock.symbol);
                        setInputValue(stock.name);
                        fetchData(stock.symbol);
                        setShowAssetDropdown(false);
                      }}
                    >
                      <span style={{ flex: 1, textAlign: 'left' }}>{stock.name}</span>
                      <span style={{ fontSize: '10px', opacity: 0.5 }}>{stock.symbol}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              className={`nav-tab ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              DASHBOARD
            </button>
            <button
              className={`nav-tab ${activeTab === "comparison" ? "active" : ""}`}
              onClick={() => setActiveTab("comparison")}
            >
              COMPARISON
            </button>
          </div>
        </nav>

        {/* MAIN */}
        <div className="main">

          {activeTab === "dashboard" && (
            <>
              {/* Stock header */}
              <div className="stock-header">
                <span className="stock-globe">🌐</span>
                <span className="stock-name">{getCompanyName()}</span>
                <span className={`sentiment-badge ${isUp ? "sentiment-bullish" : "sentiment-bearish"}`}>
                  {isUp ? "BULLISH SENTIMENT" : "BEARISH SENTIMENT"}
                </span>
                <div style={{ color: "#4b6080", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>ⓘ</span> Local Math Mode (AI is cooling down)
                </div>
                <div className="stock-price-right">
                  <div className="price-value">
                    {data.current_price.toFixed(2)}
                  </div>
                  <div className="price-change" style={{ color: dayChange.pos ? "#34d399" : "#f87171" }}>
                    <span>{dayChange.pos ? "▼" : "▼"}</span>
                    <span>{dayChange.text}</span>
                  </div>
                </div>
              </div>

              {/* Chart + Signal */}
              <div className="content-grid">
                {/* Chart */}
                <div className="chart-card">
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={data.chart_data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#1a2744" tick={{ fill: "#4b6080", fontSize: 11, fontFamily: "JetBrains Mono" }} />
                      <YAxis stroke="#1a2744" tick={{ fill: "#4b6080", fontSize: 11, fontFamily: "JetBrains Mono" }} width={65} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0d1525", border: "1px solid #1a2744", borderRadius: "8px", color: "#e2e8f0", fontFamily: "JetBrains Mono", fontSize: "12px" }}
                        labelStyle={{ color: "#94a3b8" }}
                      />
                      <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorP)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Signal */}
                <div className="signal-card">
                  <div className="signal-label">
                    <div className="signal-label-dot" />
                    QUANTUM VQC SIGNAL
                    <div style={{ marginLeft: "auto", cursor: "pointer", color: "#4b6080" }}>⚙</div>
                  </div>

                  <div className={`signal-direction ${isUp ? "signal-direction-up" : "signal-direction-down"}`}>
                    <div className={`signal-dir-text ${isUp ? "signal-dir-up" : "signal-dir-down"}`}>
                      {isUp ? "UP" : "DOWN"}
                    </div>
                    <div className="signal-prob-row">
                      <div className="signal-forecast-label">DIRECTION FORECAST</div>
                      <div>
                        <div className="signal-prob-value">{data.direction_confidence.toFixed(1)}%</div>
                        <div className="signal-prob-label" style={{ textAlign: "right" }}>PROBABILITY</div>
                      </div>
                    </div>
                  </div>

                  <div className="strength-block">
                    <div className="strength-row">
                      <div className="strength-label">
                        <span>↻</span> STRENGTH SCORE
                      </div>
                      <div className="strength-value">{Math.round(data.direction_confidence)}/100</div>
                    </div>
                    <div className="strength-bar-bg">
                      <div
                        className="strength-bar-fill"
                        style={{
                          width: `${Math.min(data.direction_confidence, 100)}%`,
                          background: getStrengthColor(data.direction_confidence),
                        }}
                      />
                    </div>
                  </div>

                  <button
                    className="advisory-btn"
                    onClick={handleAdvisory}
                    disabled={advisoryLoading}
                  >
                    {advisoryLoading ? "分析中 (ANALYZING)..." : "⚡ REQUEST AI ADVISORY"}
                  </button>

                  {advisory && (
                    <div className="advisory-box">
                      <div className="advisory-box-header" onClick={() => setAdvisoryExpanded(!advisoryExpanded)}>
                        <div className="signal-label" style={{ marginBottom: 0 }}>
                          <span>✨</span> AI INSIGHT SUMMARY
                        </div>
                        <span className={`advisory-toggle-arrow ${advisoryExpanded ? 'open' : ''}`}>▼</span>
                      </div>
                      <div className={`advisory-collapse-content ${advisoryExpanded ? 'open' : ''}`}>
                        <div className="advisory-output" style={{ border: 'none', background: 'transparent', marginTop: 0, padding: 0 }}>
                          {advisory.split('\n').map((line, i) => {
                            if (line.startsWith('### ')) {
                              return <h3 key={i}>{line.replace('### ', '')}</h3>
                            }
                            const parts = line.split('**');
                            return (
                              <div key={i} style={{ marginBottom: i < advisory.split('\n').length - 1 ? '8px' : 0 }}>
                                {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="vqc-info">
                    <div className="vqc-row">
                      <div className="vqc-dot" />
                      <div className="vqc-text">
                        <strong>VQC Architecture:</strong> 3-Qubit Circuit
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Model Cards */}
              <div className="model-grid">
                <div className="model-card">
                  <div className="model-card-header">
                    <div className="model-card-title">Classical Model</div>
                    <div className="model-card-sub">📊 Traditional ML</div>
                  </div>
                  <div className="model-prediction">
                    <div className="model-pred-label">PREDICTION</div>
                    <div className="model-pred-value">₹{data.classical_prediction.toFixed(2)}</div>
                  </div>
                  <div className="model-stats-grid">
                    <div className="model-stat">
                      <div className="model-stat-label">CONFIDENCE</div>
                      <div className="model-stat-value">{data.classical_confidence.toFixed(0)}</div>
                    </div>
                    <div className="model-stat">
                      <div className="model-stat-label">TIME</div>
                      <div className="model-stat-value">{(data.classical_time * 1000).toFixed(0)}ms</div>
                    </div>
                  </div>
                </div>

                <div className="model-card model-card-quantum">
                  <div className="model-card-header">
                    <div className="model-card-title">Quantum Model</div>
                    <div className="model-card-winner">⭐ WINNER</div>
                  </div>
                  <div className="model-prediction">
                    <div className="model-pred-label">PREDICTION</div>
                    <div className="model-pred-value" style={{ color: "#60a5fa" }}>₹{data.quantum_prediction.toFixed(2)}</div>
                  </div>
                  <div className="model-stats-grid">
                    <div className="model-stat">
                      <div className="model-stat-label">CONFIDENCE</div>
                      <div className="model-stat-value">{data.quantum_confidence.toFixed(0)}</div>
                    </div>
                    <div className="model-stat">
                      <div className="model-stat-label">TIME</div>
                      <div className="model-stat-value">{(data.quantum_time * 1000).toFixed(0)}ms</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "comparison" && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "20px", fontFamily: "'JetBrains Mono', monospace" }}>
                Quantum vs Classical Comparison
              </h2>
              <div className="comparison-grid">
                <div className="model-card">
                  <table className="comp-table">
                    <thead>
                      <tr>
                        <th>METRIC</th>
                        <th>CLASSICAL</th>
                        <th>QUANTUM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Current Price", classical: `₹${data.current_price.toFixed(2)}`, quantum: `₹${data.current_price.toFixed(2)}` },
                        { label: "Prediction", classical: `₹${data.classical_prediction.toFixed(2)}`, quantum: `₹${data.quantum_prediction.toFixed(2)}` },
                        { label: "Difference", classical: `${(data.classical_prediction - data.current_price).toFixed(2)}`, quantum: `${(data.quantum_prediction - data.current_price).toFixed(2)}` },
                        { label: "Training Accuracy", classical: `${classicalAccuracy}%`, quantum: `${quantumAccuracy}%` },
                        { label: "Confidence", classical: `${data.classical_confidence.toFixed(0)}`, quantum: `${data.quantum_confidence.toFixed(0)}` },
                        { label: "Processing Time", classical: `${(data.classical_time * 1000).toFixed(1)}ms`, quantum: `${(data.quantum_time * 1000).toFixed(1)}ms` },
                        { label: "Direction", classical: data.market_direction, quantum: data.market_direction },
                      ].map((row, idx) => (
                        <tr key={idx}>
                          <td>{row.label}</td>
                          <td>{row.classical}</td>
                          <td>{row.quantum}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="model-card">
                  <h3 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "20px" }}>📊 Performance Metrics</h3>
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span className="perf-label">Prediction Accuracy</span>
                      <span className="perf-val">Classical: {classicalAccuracy}% | Quantum: {quantumAccuracy}%</span>
                    </div>
                    <div className="perf-bar-bg">
                      <div className="perf-bar-fill" style={{ width: `${Math.min(quantumAccuracy / classicalAccuracy * 50, 100)}%`, background: "#3b82f6" }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span className="perf-label">Speed Performance</span>
                      <span className="perf-val">Quantum: {data.quantum_time < data.classical_time ? "Faster" : "Similar"}</span>
                    </div>
                    <div className="perf-bar-bg">
                      <div className="perf-bar-fill" style={{ width: `${Math.min(data.classical_time / data.quantum_time * 50, 100)}%`, background: "#10b981" }} />
                    </div>
                  </div>
                  <div className="strength-block">
                    <div style={{ color: "#4b6080", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", marginBottom: "8px", letterSpacing: "1px" }}>✨ WINNER</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "24px", fontWeight: "700", color: "#3b82f6" }}>{data.winner}</div>
                    <div style={{ color: "#4b6080", fontSize: "12px", marginTop: "6px" }}>Based on confidence score and training accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}