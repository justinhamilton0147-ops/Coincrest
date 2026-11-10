import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  ChevronDown,
  CircleHelp,
  Command,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";

const holdings = [
  { name: "Bitcoin", symbol: "BTC", color: "#f7931a", icon: "₿", price: 67420.15, change: 3.82, quantity: 1.825, allocation: 43.2, category: "Layer 1" },
  { name: "Ethereum", symbol: "ETH", color: "#8b9cff", icon: "◆", price: 3520.48, change: 2.14, quantity: 18.42, allocation: 30.1, category: "Layer 1" },
  { name: "Solana", symbol: "SOL", color: "#a881ff", icon: "≋", price: 148.32, change: -0.74, quantity: 126.8, allocation: 8.9, category: "Layer 1" },
  { name: "USD Coin", symbol: "USDC", color: "#2775ca", icon: "$", price: 1, change: 0.02, quantity: 17842, allocation: 7.6, category: "Stablecoin" },
  { name: "Chainlink", symbol: "LINK", color: "#527be8", icon: "⬡", price: 18.64, change: 5.31, quantity: 418.6, allocation: 5.2, category: "Oracle" },
  { name: "Avalanche", symbol: "AVAX", color: "#e84142", icon: "▲", price: 36.82, change: -1.26, quantity: 403.2, allocation: 5.0, category: "Layer 1" },
];

const periods = ["1D", "1W", "1M", "3M", "1Y", "ALL"];
const filters = ["All assets", "Layer 1", "Stablecoin", "Oracle"];
const balances = {
  "1D": "$123,845.22", "1W": "$121,904.68", "1M": "$116,230.45",
  "3M": "$108,502.19", "1Y": "$96,412.70", ALL: "$84,205.00",
};
const changes = { "1D": "+$1,284.50", "1W": "+$3,225.18", "1M": "+$8,570.92", "3M": "+$16,118.35", "1Y": "+$27,906.08", ALL: "+$39,640.22" };

const chartSets = {
  "1D": [22, 27, 24, 34, 30, 40, 35, 44, 37, 46, 42, 51, 45, 54, 49, 61, 58, 67, 60, 72, 64, 75, 69, 82],
  "1W": [20, 26, 23, 36, 31, 40, 35, 33, 47, 42, 53, 48, 62, 58, 68, 61, 72, 67, 76, 72, 84, 78, 89, 84],
  "1M": [16, 22, 19, 30, 26, 23, 37, 32, 40, 36, 49, 43, 40, 55, 50, 62, 56, 61, 72, 68, 77, 71, 86, 82],
  "3M": [12, 19, 16, 28, 23, 35, 29, 26, 41, 36, 48, 43, 55, 51, 47, 63, 58, 71, 65, 75, 70, 82, 77, 90],
  "1Y": [10, 15, 13, 23, 18, 30, 25, 36, 30, 27, 43, 38, 51, 45, 59, 54, 62, 56, 72, 67, 79, 74, 87, 92],
  ALL: [8, 14, 11, 20, 17, 28, 23, 34, 29, 41, 36, 32, 47, 43, 56, 50, 61, 57, 69, 64, 77, 72, 84, 92],
};

function formatCurrency(value, digits = 2) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
}

function Sparkline({ color, down = false }) {
  const points = down ? "0,9 8,7 16,10 24,5 32,8 40,3 48,6" : "0,10 8,8 16,9 24,4 32,6 40,2 48,3";
  return <svg className="sparkline" viewBox="0 0 48 14" aria-hidden="true"><polyline points={points} fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function PortfolioChart({ period }) {
  const values = chartSets[period];
  const width = 760;
  const height = 220;
  const coords = values.map((value, index) => `${(index / (values.length - 1)) * width},${height - (value / 100) * (height - 18) - 8}`).join(" ");
  const first = coords.split(" ")[0];
  const last = coords.split(" ").at(-1);
  const area = `${first} ${coords} ${width},${height} 0,${height}`;
  return (
    <svg className="portfolio-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label={`Portfolio value chart for ${period}`}>
      <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#b7f36b" stopOpacity=".23" /><stop offset="100%" stopColor="#b7f36b" stopOpacity="0" /></linearGradient></defs>
      {[0, 1, 2, 3].map((line) => <line key={line} x1="0" x2={width} y1={line * 58 + 12} y2={line * 58 + 12} stroke="rgba(255,255,255,.07)" strokeDasharray="3 5" />)}
      <polygon points={area} fill="url(#chartFill)" />
      <polyline points={coords} fill="none" stroke="#b7f36b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx={last.split(",")[0]} cy={last.split(")[1]} r="4" fill="#b7f36b" stroke="#10140e" strokeWidth="3" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function AssetIcon({ asset }) {
  return <span className="asset-icon" style={{ "--asset-color": asset.color }}>{asset.icon}</span>;
}

export default function App() {
  const [period, setPeriod] = useState("1M");
  const [category, setCategory] = useState("All assets");
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [sortDescending, setSortDescending] = useState(true);

  const visibleHoldings = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return holdings
      .filter((asset) => category === "All assets" || asset.category === category)
      .filter((asset) => !normalized || `${asset.name} ${asset.symbol}`.toLowerCase().includes(normalized))
      .sort((a, b) => sortDescending ? b.allocation - a.allocation : a.allocation - b.allocation);
  }, [category, query, sortDescending]);

  const announce = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  return (
    <div className="app-shell">
      {mobileOpen && <button className="scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <a className="brand" href="#overview" aria-label="Coincrest home"><span className="brand-symbol">c</span><span>coincrest</span></a>
        <div className="workspace-switch"><span className="workspace-avatar">J</span><span className="workspace-copy"><b>Justin's workspace</b><small>Personal account</small></span><ChevronDown size={15} /></div>
        <div className="side-label">Workspace</div>
        <nav className="side-nav" aria-label="Dashboard navigation">
          <a className="side-link active" href="#overview" onClick={() => setMobileOpen(false)}><LayoutDashboard size={17} /> Overview</a>
          <a className="side-link" href="#assets" onClick={() => setMobileOpen(false)}><Wallet size={17} /> My assets</a>
          <button className="side-link" onClick={() => announce("Watchlist view is coming soon.")}><Sparkles size={17} /> Watchlist <span className="nav-count">4</span></button>
        </nav>
        <div className="side-label markets-label">Markets</div>
        <nav className="side-nav" aria-label="Market navigation">
          <button className="side-link" onClick={() => announce("Market explorer is coming soon.")}><SlidersHorizontal size={17} /> Explore</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><CircleHelp size={17} /></div><b>Need a hand?</b><p>Visit our help center to get started.</p><button onClick={() => announce("Help center link is not configured yet.")}>Open help center <ArrowUpRight size={13} /></button></div>
          <button className="side-link" onClick={() => announce("Settings are coming soon.")}><Settings2 size={17} /> Settings</button>
          <button className="profile-row" onClick={() => announce("Account menu is coming soon.")}><span className="profile-avatar">JH</span><span className="profile-copy"><b>Justin Hamilton</b><small>Free plan</small></span><MoreHorizontal size={18} /></button>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><b>Overview</b></div>
          <div className="topbar-actions"><button className="search-shortcut" onClick={() => document.getElementById("asset-search")?.focus()}><Search size={15} /><span>Search assets...</span><kbd><Command size={11} /> K</kbd></button><button className="icon-button notification-button" aria-label="Notifications" onClick={() => announce("You're all caught up.")}><Bell size={17} /><i /></button><span className="top-avatar">JH</span></div>
        </header>

        <div className="page-content">
          <section className="welcome-row"><div><div className="overline">MONDAY, OCTOBER 21, 2024</div><h1>Good morning, Justin <span>✦</span></h1><p>Here’s what’s happening with your portfolio today.</p></div><button className="outline-button" onClick={() => announce("Your portfolio report is ready to export.")}><ArrowDownRight size={16} /> Export report</button></section>

          <section className="summary-grid" aria-label="Portfolio summary">
            <article className="summary-card balance-card"><div className="summary-top"><span>Total balance</span><button aria-label="Balance options" onClick={() => announce("Balance options are not configured yet.")}><MoreHorizontal size={19} /></button></div><div className="balance-value">{balances[period]}</div><div className="balance-change"><span className="change-pill"><ArrowUpRight size={14} /> 7.96%</span><span>{changes[period]} this month</span></div><div className="balance-foot"><span><i className="legend-dot lime" /> Invested <b>$116,325.22</b></span><span><i className="legend-dot gray" /> Cash <b>$7,520.00</b></span></div></article>
            <article className="summary-card"><div className="summary-top"><span>24h profit / loss</span><span className="small-icon lime-icon"><ArrowUpRight size={16} /></span></div><div className="metric-value positive-text">+$2,845.68</div><div className="metric-sub"><span className="positive-text">+2.35%</span><span>compared to yesterday</span></div><div className="mini-bars" aria-label="24 hour profit trend">{[32, 44, 38, 59, 48, 67, 52, 74, 61, 86, 70, 95, 78, 100, 84, 73].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div></article>
            <article className="summary-card"><div className="summary-top"><span>Assets held</span><span className="small-icon purple-icon"><Wallet size={15} /></span></div><div className="metric-value">06 <span className="asset-inline-icons">{holdings.slice(0, 3).map((asset) => <AssetIcon key={asset.symbol} asset={asset} />)}</span></div><div className="metric-sub"><span>Across</span><b>4 categories</b><span className="dot-separator">·</span><span>Top asset</span><b>BTC</b></div><div className="allocation-bar"><i /><i /><i /><i /><i /><i /></div><div className="allocation-caption"><span>Portfolio diversity</span><b>Good</b></div></article>
          </section>

          <section className="panel performance-panel"><div className="panel-heading"><div><h2>Portfolio performance</h2><p>Track how your portfolio is performing over time.</p></div><button className="select-button" onClick={() => announce("Portfolio: all assets selected.")}>All assets <ChevronDown size={14} /></button></div><div className="chart-summary"><span className="chart-total">{balances[period]}</span><span className="chart-change"><ArrowUpRight size={14} /> {changes[period]} (7.96%)</span></div><div className="chart-layout"><div className="y-axis"><span>$130k</span><span>$120k</span><span>$110k</span><span>$100k</span></div><div className="chart-wrap"><PortfolioChart period={period} /><div className="x-axis"><span>Sep 22</span><span>Sep 28</span><span>Oct 04</span><span>Oct 10</span><span>Oct 16</span><span>Oct 21</span></div></div></div><div className="chart-footer"><div className="chart-legend"><i className="legend-dot lime" /> Portfolio value</div><div className="period-tabs" role="group" aria-label="Chart time period">{periods.map((option) => <button key={option} className={period === option ? "selected" : ""} onClick={() => setPeriod(option)} aria-pressed={period === option}>{option}</button>)}</div></div></section>

          <section className="panel assets-panel" id="assets"><div className="assets-heading"><div><h2>Your assets <span className="count-badge">{visibleHoldings.length}</span></h2><p>A breakdown of your portfolio holdings.</p></div><button className="add-button" onClick={() => announce("Connect a wallet to add a real asset.")}><Plus size={15} /> Add asset</button></div><div className="asset-toolbar"><div className="filter-tabs" role="group" aria-label="Filter assets by category">{filters.map((filter) => <button key={filter} className={category === filter ? "filter-active" : ""} onClick={() => setCategory(filter)}>{filter}</button>)}</div><label className="asset-search"><Search size={15} /><input id="asset-search" type="search" placeholder="Search assets..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd><Command size={10} /> K</kbd></label></div><div className="table-scroll"><table><thead><tr><th>Asset</th><th>Price</th><th>24h change</th><th>Holdings</th><th>Allocation <button className="sort-button" aria-label="Sort by allocation" onClick={() => setSortDescending((value) => !value)}><ChevronDown size={13} className={sortDescending ? "" : "sort-up"} /></button></th><th>Last 7 days</th><th aria-label="Actions"></th></tr></thead><tbody>{visibleHoldings.map((asset) => <tr key={asset.symbol}><td><div className="asset-name"><AssetIcon asset={asset} /><span><b>{asset.name}</b><small>{asset.symbol}</small></span></div></td><td className="numeric">{formatCurrency(asset.price, asset.price < 10 ? 2 : 2)}</td><td><span className={`table-change ${asset.change >= 0 ? "positive-text" : "negative-text"}`}>{asset.change >= 0 ? "+" : ""}{asset.change.toFixed(2)}%</span></td><td className="numeric">{formatCurrency(asset.price * asset.quantity)}<small className="quantity">{asset.quantity.toLocaleString("en-US", { maximumFractionDigits: 3 })} {asset.symbol}</small></td><td><div className="allocation-cell"><span className="allocation-track"><i style={{ width: `${asset.allocation * 1.65}%`, background: asset.color }} /></span><b>{asset.allocation.toFixed(1)}%</b></div></td><td><Sparkline color={asset.change >= 0 ? "#b7f36b" : "#fa7f82"} down={asset.change < 0} /></td><td><button className="row-more" aria-label={`More options for ${asset.name}`} onClick={() => announce(`${asset.name} options are not configured yet.`)}><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table>{visibleHoldings.length === 0 && <div className="empty-state">No assets match “{query}”. Try another search or category.</div>}</div><div className="table-foot"><span>Showing <b>{visibleHoldings.length}</b> of <b>6</b> assets</span><button onClick={() => { setCategory("All assets"); setQuery(""); }}>View all assets <ArrowUpRight size={13} /></button></div></section>

          <footer className="page-footer"><span>© 2024 Coincrest. Dashboard data is illustrative.</span><span><i className="status-dot" /> All systems operational</span></footer>
        </div>
      </main>
      {notice && <div className="toast" role="status"><span>{notice}</span><button aria-label="Dismiss message" onClick={() => setNotice("")}><X size={15} /></button></div>}
    </div>
  );
}
