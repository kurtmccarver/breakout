"use client";

import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Calculator,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Columns3,
  Edit3,
  FileBarChart,
  Gauge,
  Info,
  LayoutDashboard,
  LineChart,
  Plus,
  Save,
  Search,
  Table2,
  Target,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Direction = "Long" | "Short";
type TradeStatus = "Win" | "Loss" | "Breakeven";
type Section =
  | "overview"
  | "journal"
  | "logs"
  | "reports"
  | "calendar"
  | "calculator";

type Account = { id: string; name: string; capital: number };
type Trade = {
  id: string;
  accountId: string;
  symbol: string;
  direction: Direction;
  tags: string;
  setup: string;
  entryPrice: number;
  exitPrice: number;
  entryTime: string;
  exitTime: string;
  pnl: number;
  rr: number;
  status: TradeStatus;
  notes: string;
};

type TradeForm = {
  symbol: string;
  direction: Direction;
  setup: string;
  tags: string;
  entryPrice: string;
  exitPrice: string;
  entryTime: string;
  exitTime: string;
  pnl: string;
  risk: string;
  notes: string;
};

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "journal", label: "Trade Journal", icon: BookOpen },
  { id: "logs", label: "Trade Logs", icon: Table2 },
  { id: "reports", label: "Reports", icon: FileBarChart },
  { id: "calendar", label: "Economic Calendar", icon: CalendarDays },
  { id: "calculator", label: "Risk Per Trade", icon: Calculator },
] satisfies { id: Section; label: string; icon: React.ElementType }[];

const emptyForm: TradeForm = {
  symbol: "",
  direction: "Long",
  setup: "",
  tags: "",
  entryPrice: "",
  exitPrice: "",
  entryTime: "",
  exitTime: "",
  pnl: "",
  risk: "",
  notes: "",
};

const defaultAccounts: Account[] = [
  { id: "main", name: "Main Account", capital: 10000 },
  { id: "prop", name: "Prop Evaluation", capital: 50000 },
];

const defaultTrades: Trade[] = [
  {
    id: "1",
    accountId: "main",
    symbol: "AAPL",
    direction: "Long",
    tags: "Breakout, Continuation",
    setup: "Opening range break",
    entryPrice: 218.2,
    exitPrice: 221.4,
    entryTime: "2026-08-13T09:42",
    exitTime: "2026-08-13T11:08",
    pnl: 64,
    rr: 2.1,
    status: "Win",
    notes: "Clean retest. Took partials into prior day high.",
  },
  {
    id: "2",
    accountId: "main",
    symbol: "NVDA",
    direction: "Long",
    tags: "Pullback",
    setup: "VWAP reclaim",
    entryPrice: 182.5,
    exitPrice: 180.9,
    entryTime: "2026-08-14T10:15",
    exitTime: "2026-08-14T10:52",
    pnl: -24,
    rr: -0.8,
    status: "Loss",
    notes: "Entry was early. Wait for higher low next time.",
  },
  {
    id: "3",
    accountId: "prop",
    symbol: "EURUSD",
    direction: "Short",
    tags: "Macro, London",
    setup: "Range expansion",
    entryPrice: 1.1122,
    exitPrice: 1.1092,
    entryTime: "2026-08-15T15:10",
    exitTime: "2026-08-15T18:35",
    pnl: 30,
    rr: 1.4,
    status: "Win",
    notes: "Calm hold after news volatility settled.",
  },
  {
    id: "4",
    accountId: "main",
    symbol: "MSFT",
    direction: "Long",
    tags: "Trend, Pullback",
    setup: "20 EMA pullback",
    entryPrice: 513.4,
    exitPrice: 519.2,
    entryTime: "2026-08-04T10:05",
    exitTime: "2026-08-04T13:25",
    pnl: 116,
    rr: 2.4,
    status: "Win",
    notes: "Waited for reclaim and scaled into strength.",
  },
  {
    id: "5",
    accountId: "main",
    symbol: "TSLA",
    direction: "Short",
    tags: "Reversal, Resistance",
    setup: "Failed breakout",
    entryPrice: 361.8,
    exitPrice: 356.1,
    entryTime: "2026-08-05T09:55",
    exitTime: "2026-08-05T11:34",
    pnl: 86,
    rr: 1.8,
    status: "Win",
    notes: "Short worked after rejection at premarket high.",
  },
  {
    id: "6",
    accountId: "main",
    symbol: "AMD",
    direction: "Long",
    tags: "Chop, Mistake",
    setup: "Breakout attempt",
    entryPrice: 181.2,
    exitPrice: 179.9,
    entryTime: "2026-08-06T14:12",
    exitTime: "2026-08-06T14:58",
    pnl: -39,
    rr: -1,
    status: "Loss",
    notes: "Chased late candle and paid for it.",
  },
  {
    id: "7",
    accountId: "prop",
    symbol: "GBPUSD",
    direction: "Long",
    tags: "London, News",
    setup: "Post-news continuation",
    entryPrice: 1.332,
    exitPrice: 1.3364,
    entryTime: "2026-08-10T16:30",
    exitTime: "2026-08-10T19:10",
    pnl: 44,
    rr: 1.6,
    status: "Win",
    notes: "Waited through first spike, entered on structure.",
  },
  {
    id: "8",
    accountId: "prop",
    symbol: "USDJPY",
    direction: "Short",
    tags: "Asia, Reversal",
    setup: "Liquidity sweep",
    entryPrice: 147.4,
    exitPrice: 147.92,
    entryTime: "2026-08-11T08:20",
    exitTime: "2026-08-11T09:05",
    pnl: -52,
    rr: -1,
    status: "Loss",
    notes: "Short thesis invalidated quickly.",
  },
  {
    id: "9",
    accountId: "prop",
    symbol: "XAUUSD",
    direction: "Long",
    tags: "Breakout, New York",
    setup: "Range break",
    entryPrice: 2478.5,
    exitPrice: 2487.2,
    entryTime: "2026-08-12T21:15",
    exitTime: "2026-08-12T23:48",
    pnl: 87,
    rr: 2.2,
    status: "Win",
    notes: "Clean continuation after dollar weakness.",
  },
];

const economicEvents = [
  {
    date: "2026-08-17",
    time: "08:30",
    currency: "USD",
    event: "Retail Sales m/m",
    impact: "High",
    actual: "0.5%",
    forecast: "0.2%",
    previous: "-0.3%",
    source: "TradingView Economic Calendar",
  },
  {
    date: "2026-08-17",
    time: "09:15",
    currency: "USD",
    event: "Industrial Production m/m",
    impact: "Medium",
    actual: "0.1%",
    forecast: "0.0%",
    previous: "0.3%",
    source: "TradingView Economic Calendar",
  },
  {
    date: "2026-08-18",
    time: "14:00",
    currency: "EUR",
    event: "ECB President Speech",
    impact: "High",
    actual: "-",
    forecast: "-",
    previous: "-",
    source: "TradingView Economic Calendar",
  },
  {
    date: "2026-08-19",
    time: "20:30",
    currency: "CAD",
    event: "Core CPI m/m",
    impact: "High",
    actual: "-",
    forecast: "0.4%",
    previous: "0.2%",
    source: "TradingView Economic Calendar",
  },
  {
    date: "2026-08-20",
    time: "07:00",
    currency: "GBP",
    event: "CPI y/y",
    impact: "High",
    actual: "-",
    forecast: "2.1%",
    previous: "2.0%",
    source: "TradingView Economic Calendar",
  },
  {
    date: "2026-08-20",
    time: "22:00",
    currency: "USD",
    event: "NAHB Housing Market Index",
    impact: "Medium",
    actual: "-",
    forecast: "33",
    previous: "34",
    source: "TradingView Economic Calendar",
  },
  {
    date: "2026-08-21",
    time: "09:30",
    currency: "JPY",
    event: "National CPI y/y",
    impact: "Medium",
    actual: "-",
    forecast: "2.8%",
    previous: "2.7%",
    source: "TradingView Economic Calendar",
  },
  {
    date: "2026-08-21",
    time: "16:00",
    currency: "EUR",
    event: "Manufacturing PMI Flash",
    impact: "Medium",
    actual: "-",
    forecast: "50.2",
    previous: "49.8",
    source: "TradingView Economic Calendar",
  },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

function titleCase(value: string) {
  return value
    .split(",")
    .map((tag) =>
      tag
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase()),
    )
    .filter(Boolean)
    .join(", ");
}

function formatMoney(value: number) {
  const sign = value < 0 ? "-" : "";
  return `${sign}${currency.format(Math.abs(value))}`;
}

function formatDateTime(value: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatMonth(month: number, year: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));
}

function holdingHours(trade: Trade) {
  return Math.max(
    0,
    (new Date(trade.exitTime).getTime() - new Date(trade.entryTime).getTime()) /
    36e5,
  );
}

function formatDuration(hours: number) {
  if (!hours) return "0m";
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return wholeHours ? `${wholeHours}h ${minutes}m` : `${minutes}m`;
}

function StatCard({
  label,
  value,
  detail,
  tone = "neutral",
  icon: Icon,
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: "neutral" | "positive" | "negative";
  icon?: React.ElementType;
}) {
  return (
    <section className={`stat-card ${tone}`}>
      <div className="stat-label">
        {Icon ? <Icon size={15} /> : null}
        <span>{label}</span>
        <Info size={13} />
      </div>
      <strong>{value}</strong>
      {detail ? <p>{detail}</p> : null}
    </section>
  );
}

function StatsTable({
  title,
  rows,
}: {
  title: string;
  rows: [string, string][];
}) {
  return (
    <section className="panel stat-table">
      <h2>{title}</h2>
      {rows.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  );
}

function EquityChart({
  trades,
  capital,
}: {
  trades: Trade[];
  capital: number;
}) {
  const points = useMemo(() => {
    let balance = capital;
    const sorted = [...trades].sort(
      (a, b) => new Date(a.exitTime).getTime() - new Date(b.exitTime).getTime(),
    );
    return [
      { label: "Start", value: capital },
      ...sorted.map((trade) => ({
        label: trade.symbol,
        value: (balance += trade.pnl),
      })),
    ];
  }, [capital, trades]);

  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const width = 640;
  const height = 210;
  const coords = points.map((point, index) => {
    const x = points.length === 1 ? 0 : (index / (points.length - 1)) * width;
    const y = height - ((point.value - min) / range) * (height - 24) - 12;
    return `${x},${y}`;
  });

  return (
    <section className="panel chart-panel">
      <div className="panel-title">
        <h2>Equity Curve</h2>
        <span className="badge">{formatMoney(values.at(-1) ?? capital)}</span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Equity curve chart"
      >
        <defs>
          <linearGradient id="equityFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7bdcb5" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#7bdcb5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((line) => (
          <line
            key={line}
            x1="0"
            x2={width}
            y1={(height / 4) * line + 10}
            y2={(height / 4) * line + 10}
          />
        ))}
        <polyline
          className="equity-area"
          points={`0,${height} ${coords.join(" ")} ${width},${height}`}
        />
        <polyline className="equity-line" points={coords.join(" ")} />
        {coords.map((coord, index) => {
          const [x, y] = coord.split(",").map(Number);
          return (
            <circle key={points[index].label + index} cx={x} cy={y} r="4" />
          );
        })}
      </svg>
    </section>
  );
}

export default function Home() {
  const today = new Date();
  const [section, setSection] = useState<Section>("overview");
  const [accounts, setAccounts] = useState<Account[]>(defaultAccounts);
  const [selectedAccountId, setSelectedAccountId] = useState(
    defaultAccounts[0].id,
  );
  const [newAccount, setNewAccount] = useState({ name: "", capital: "" });
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [accountDraft, setAccountDraft] = useState({ name: "", capital: "" });
  const [trades, setTrades] = useState<Trade[]>(defaultTrades);
  const [form, setForm] = useState<TradeForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TradeStatus>("All");
  const [risk, setRisk] = useState({
    riskPercent: "1",
    stopLossPercent: "2",
    leverage: "100",
  });
  const [calendarDate, setCalendarDate] = useState({
    month: today.getMonth(),
    year: today.getFullYear(),
  });
  const [eventWeekStart, setEventWeekStart] = useState("2026-08-17");
  const [currencyFilter, setCurrencyFilter] = useState("All");

  useEffect(() => {
    const savedAccounts = window.localStorage.getItem("breakout-accounts");
    const savedSelected = window.localStorage.getItem(
      "breakout-selected-account",
    );
    const savedTrades = window.localStorage.getItem("breakout-trades");
    if (savedAccounts) setAccounts(JSON.parse(savedAccounts));
    if (savedSelected) setSelectedAccountId(savedSelected);
    if (savedTrades) {
      const parsed = JSON.parse(savedTrades) as Partial<Trade>[];
      setTrades(
        parsed.map((trade) => ({
          ...trade,
          accountId: trade.accountId ?? "main",
          direction: trade.direction ?? "Long",
          tags: titleCase(trade.tags ?? ""),
        })) as Trade[],
      );
    }
  }, []);

  useEffect(
    () =>
      window.localStorage.setItem(
        "breakout-accounts",
        JSON.stringify(accounts),
      ),
    [accounts],
  );
  useEffect(
    () =>
      window.localStorage.setItem(
        "breakout-selected-account",
        selectedAccountId,
      ),
    [selectedAccountId],
  );
  useEffect(
    () =>
      window.localStorage.setItem("breakout-trades", JSON.stringify(trades)),
    [trades],
  );

  const selectedAccount =
    accounts.find((account) => account.id === selectedAccountId) ?? accounts[0];
  const accountTrades = trades.filter(
    (trade) => trade.accountId === selectedAccount?.id,
  );
  const closedTrades = accountTrades;
  const wins = closedTrades.filter((trade) => trade.pnl > 0);
  const losses = closedTrades.filter((trade) => trade.pnl < 0);

  const stats = useMemo(() => {
    const totalPnl = closedTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const grossProfit = wins.reduce((sum, trade) => sum + trade.pnl, 0);
    const grossLoss = Math.abs(
      losses.reduce((sum, trade) => sum + trade.pnl, 0),
    );
    const tradingDays = new Set(
      closedTrades.map((trade) => trade.entryTime.slice(0, 10)),
    ).size;
    const monthly = new Map<string, number>();
    closedTrades.forEach((trade) =>
      monthly.set(
        trade.entryTime.slice(0, 7),
        (monthly.get(trade.entryTime.slice(0, 7)) ?? 0) + trade.pnl,
      ),
    );
    const monthEntries = [...monthly.entries()];
    const maxMonth = [...monthEntries].sort((a, b) => b[1] - a[1])[0];
    const minMonth = [...monthEntries].sort((a, b) => a[1] - b[1])[0];
    const totalHolding = closedTrades.reduce(
      (sum, trade) => sum + holdingHours(trade),
      0,
    );
    const avgWin = wins.length ? grossProfit / wins.length : 0;
    const avgLoss = losses.length ? grossLoss / losses.length : 0;
    return {
      totalPnl,
      winRate: closedTrades.length
        ? (wins.length / closedTrades.length) * 100
        : 0,
      profitFactor: grossLoss
        ? grossProfit / grossLoss
        : grossProfit
          ? grossProfit
          : 0,
      avgWinLoss: avgLoss ? avgWin / avgLoss : avgWin ? avgWin : 0,
      averageRR: closedTrades.length
        ? closedTrades.reduce((sum, trade) => sum + trade.rr, 0) /
        closedTrades.length
        : 0,
      averageHoldingPeriod: closedTrades.length
        ? totalHolding / closedTrades.length
        : 0,
      averageHoldingWin: wins.length
        ? wins.reduce((sum, trade) => sum + holdingHours(trade), 0) /
        wins.length
        : 0,
      averageHoldingLoss: losses.length
        ? losses.reduce((sum, trade) => sum + holdingHours(trade), 0) /
        losses.length
        : 0,
      totalTrades: closedTrades.length,
      averageTradesPerDay: tradingDays ? closedTrades.length / tradingDays : 0,
      tradingDays,
      winningDays: new Set(wins.map((trade) => trade.entryTime.slice(0, 10)))
        .size,
      losingDays: new Set(losses.map((trade) => trade.entryTime.slice(0, 10)))
        .size,
      wins: wins.length,
      losses: losses.length,
      breakeven: closedTrades.filter((trade) => trade.pnl === 0).length,
      largestProfit: Math.max(0, ...closedTrades.map((trade) => trade.pnl)),
      largestLoss: Math.min(0, ...closedTrades.map((trade) => trade.pnl)),
      averageTradePnl: closedTrades.length ? totalPnl / closedTrades.length : 0,
      averageWinningTrade: avgWin,
      averageLosingTrade: avgLoss,
      expectancy: closedTrades.length ? totalPnl / closedTrades.length : 0,
      bestMonth: maxMonth?.[1] ?? 0,
      worstMonth: minMonth?.[1] ?? 0,
      bestMonthName: maxMonth?.[0] ?? "N/A",
      worstMonthName: minMonth?.[0] ?? "N/A",
      averagePerMonth: monthEntries.length ? totalPnl / monthEntries.length : 0,
    };
  }, [closedTrades, losses, wins]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(
      calendarDate.year,
      calendarDate.month,
      1,
    ).getDay();
    const totalDays = new Date(
      calendarDate.year,
      calendarDate.month + 1,
      0,
    ).getDate();
    return Array.from({ length: 42 }, (_, index) => {
      const day = index - firstDay + 1;
      const date = new Date(calendarDate.year, calendarDate.month, day);
      const inMonth = day >= 1 && day <= totalDays;
      const dayTrades = inMonth
        ? closedTrades.filter((trade) => {
          const entry = new Date(trade.entryTime);
          return (
            entry.getFullYear() === date.getFullYear() &&
            entry.getMonth() === date.getMonth() &&
            entry.getDate() === date.getDate()
          );
        })
        : [];
      return {
        date,
        inMonth,
        trades: dayTrades,
        pnl: dayTrades.reduce((sum, trade) => sum + trade.pnl, 0),
      };
    });
  }, [calendarDate, closedTrades]);

  const weeklyPnl = [0, 1, 2, 3, 4, 5].map((week) =>
    calendarDays
      .slice(week * 7, week * 7 + 7)
      .reduce((sum, day) => sum + day.pnl, 0),
  );
  const filteredTrades = accountTrades.filter(
    (trade) =>
      `${trade.symbol} ${trade.tags} ${trade.setup} ${trade.direction}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (statusFilter === "All" || trade.status === statusFilter),
  );
  const recentTrades = [...accountTrades]
    .sort(
      (a, b) => new Date(b.exitTime).getTime() - new Date(a.exitTime).getTime(),
    )
    .slice(0, 6);
  const currencyOptions = [
    ...Array.from(new Set(economicEvents.map((event) => event.currency))),
  ];
  const eventWeekEnd = useMemo(() => {
    const date = new Date(`${eventWeekStart}T00:00`);
    date.setDate(date.getDate() + 6);
    return date.toISOString().slice(0, 10);
  }, [eventWeekStart]);
  const filteredEvents = economicEvents.filter(
    (event) =>
      event.date >= eventWeekStart &&
      event.date <= eventWeekEnd &&
      (currencyFilter === "All" || event.currency === currencyFilter),
  );
  const riskAmount = selectedAccount.capital * (Number(risk.riskPercent) / 100);
  const positionSize = Number(risk.stopLossPercent)
    ? riskAmount / (Number(risk.stopLossPercent) / 100)
    : 0;
  const capitalUsed = positionSize / Number(risk.leverage);

  function moveMonth(delta: number) {
    setCalendarDate((current) => {
      const next = new Date(current.year, current.month + delta, 1);
      return { month: next.getMonth(), year: next.getFullYear() };
    });
  }

  function addAccount() {
    const capital = Number(newAccount.capital);
    if (!newAccount.name.trim() || !capital) return;
    const account = {
      id: crypto.randomUUID(),
      name: newAccount.name.trim(),
      capital,
    };
    setAccounts((current) => [...current, account]);
    setSelectedAccountId(account.id);
    setNewAccount({ name: "", capital: "" });
  }

  function startEditAccount(account: Account) {
    setEditingAccountId(account.id);
    setAccountDraft({ name: account.name, capital: String(account.capital) });
  }

  function saveAccount() {
    const capital = Number(accountDraft.capital);
    if (!editingAccountId || !accountDraft.name.trim() || !capital) return;
    setAccounts((current) =>
      current.map((account) =>
        account.id === editingAccountId
          ? { ...account, name: accountDraft.name.trim(), capital }
          : account,
      ),
    );
    setEditingAccountId(null);
    setAccountDraft({ name: "", capital: "" });
  }

  function moveEventWeek(delta: number) {
    const next = new Date(`${eventWeekStart}T00:00`);
    next.setDate(next.getDate() + delta * 7);
    setEventWeekStart(next.toISOString().slice(0, 10));
  }

  function jumpToCurrentWeek() {
  const today = new Date();
  const day = today.getDay();
  // Adjust so the week starts on Monday (change +1 to -0 if your week starts on Sunday)
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); 
  const startOfWeek = new Date(today.setDate(diff));
  
  setEventWeekStart(startOfWeek.toISOString().slice(0, 10));
}

  function deleteAccount(id: string) {
    if (accounts.length <= 1) return;
    setAccounts((current) => current.filter((account) => account.id !== id));
    setTrades((current) => current.filter((trade) => trade.accountId !== id));
    if (selectedAccountId === id)
      setSelectedAccountId(
        accounts.find((account) => account.id !== id)?.id ?? "main",
      );
  }

  function loadTrade(trade: Trade) {
    setForm({
      symbol: trade.symbol,
      direction: trade.direction,
      setup: trade.setup,
      tags: trade.tags,
      entryPrice: String(trade.entryPrice),
      exitPrice: String(trade.exitPrice),
      entryTime: trade.entryTime,
      exitTime: trade.exitTime,
      pnl: String(trade.pnl),
      risk: trade.rr ? String(Math.abs(trade.pnl / trade.rr)) : "",
      notes: trade.notes,
    });
    setEditingId(trade.id);
    setSection("journal");
  }

  function saveTrade() {
    const entryPrice = Number(form.entryPrice);
    const exitPrice = Number(form.exitPrice);
    const pnl = Number(form.pnl);
    const riskValue = Number(form.risk);
    if (
      !form.symbol ||
      !form.entryTime ||
      !form.exitTime ||
      Number.isNaN(entryPrice) ||
      Number.isNaN(exitPrice) ||
      Number.isNaN(pnl)
    )
      return;
    const nextTrade: Trade = {
      id: editingId ?? crypto.randomUUID(),
      accountId: selectedAccount.id,
      symbol: form.symbol.toUpperCase(),
      direction: form.direction,
      tags: titleCase(form.tags),
      setup: form.setup || "Manual journal entry",
      entryPrice,
      exitPrice,
      entryTime: form.entryTime,
      exitTime: form.exitTime,
      pnl,
      rr: riskValue ? pnl / riskValue : 0,
      status: pnl > 0 ? "Win" : pnl < 0 ? "Loss" : "Breakeven",
      notes: form.notes,
    };
    setTrades((current) =>
      editingId
        ? current.map((trade) => (trade.id === editingId ? nextTrade : trade))
        : [nextTrade, ...current],
    );
    setForm(emptyForm);
    setEditingId(null);
    setSection("logs");
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <LineChart size={24} />
          </div>
          <div>
            <span>Breakout</span>
            <small>Trading Journal</small>
          </div>
        </div>
        <div className="account-switcher">
          <label>
            Trading Account
            <select
              value={selectedAccountId}
              onChange={(event) => setSelectedAccountId(event.target.value)}
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </label>
          <small>{formatMoney(selectedAccount.capital)} starting capital</small>
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={section === item.id ? "active" : ""}
                onClick={() => setSection(item.id)}
                type="button"
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-policies">
          <Link href="/terms" className="sidebar-link">
            Terms & Conditions
          </Link>
          <span className="sidebar-separator">·</span>
          <Link href="/privacy" className="sidebar-link">
            Privacy Policy
          </Link>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p>{selectedAccount.name}</p>
            <h1>{navItems.find((item) => item.id === section)?.label}</h1>
          </div>
          <button
            className="primary-action compact"
            type="button"
            onClick={() => setSection("journal")}
          >
            <Plus size={16} /> New Trade
          </button>
        </header>

        {section === "overview" && (
          <div className="content-stack">
            <div className="stats-grid overview">
              <StatCard
                label="Net P&L"
                value={formatMoney(stats.totalPnl)}
                icon={CircleDollarSign}
                tone={stats.totalPnl >= 0 ? "positive" : "negative"}
              />
              <StatCard
                label="Trade Win"
                value={`${numberFormat.format(stats.winRate)}%`}
                detail={`${stats.wins} wins / ${stats.losses} losses`}
                icon={Gauge}
              />
              <StatCard
                label="Profit Factor"
                value={numberFormat.format(stats.profitFactor)}
                icon={BarChart3}
              />
              <StatCard
                label="Average RR"
                value={numberFormat.format(stats.averageRR)}
                icon={Target}
              />
              <StatCard
                label="Average Holding Period"
                value={formatDuration(stats.averageHoldingPeriod)}
                icon={Clock3}
              />
              <StatCard
                label="Total Number of Trades"
                value={String(stats.totalTrades)}
                icon={Table2}
              />
              <StatCard
                label="Average Trades per Day"
                value={numberFormat.format(stats.averageTradesPerDay)}
                icon={CalendarDays}
              />
              <StatCard
                label="Account Equity"
                value={formatMoney(selectedAccount.capital + stats.totalPnl)}
                icon={LineChart}
              />
            </div>
            <div className="dashboard-grid">
              <section className="panel calendar-panel">
                <div className="panel-title">
                  <h2>P&L Calendar</h2>
                  <div className="mini-controls">
                    <button type="button" onClick={() => moveMonth(-1)}>
                      <ChevronLeft size={14} />
                    </button>
                    <strong>
                      {formatMonth(calendarDate.month, calendarDate.year)}
                    </strong>
                    <button type="button" onClick={() => moveMonth(1)}>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
                <div className="calendar-with-weekly">
                  <div className="calendar-grid">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <span className="day-name" key={day}>
                          {day}
                        </span>
                      ),
                    )}
                    {calendarDays.map((day, index) => (
                      <div
                        className={`day-cell ${!day.inMonth ? "muted-day" : ""} ${day.pnl > 0 ? "gain" : day.pnl < 0 ? "loss" : ""}`}
                        key={index}
                      >
                        <span>{day.date.getDate()}</span>
                        {day.trades.length ? (
                          <strong>{formatMoney(day.pnl)}</strong>
                        ) : null}
                        {day.trades.length ? (
                          <small>{day.trades.length} trades</small>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  <div className="weekly-column">
                    <span>Weekly</span>
                    {weeklyPnl.map((pnl, index) => (
                      <div
                        className={`weekly-box ${pnl > 0 ? "gain" : pnl < 0 ? "loss" : ""}`}
                        key={index}
                      >
                        <strong>{formatMoney(pnl)}</strong>
                        <small>Week {index + 1}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              <section className="panel trades-panel">
                <div className="panel-title">
                  <h2>Most Recent Trades</h2>
                  <span className="badge">{recentTrades.length} shown</span>
                </div>
                <div className="recent-list">
                  {recentTrades.map((trade) => (
                    <article key={trade.id}>
                      <div>
                        <strong>{trade.symbol}</strong>
                        <span
                          className={`direction ${trade.direction.toLowerCase()}`}
                        >
                          {trade.direction}
                        </span>
                      </div>
                      <p
                        className={
                          trade.pnl >= 0 ? "money-positive" : "money-negative"
                        }
                      >
                        {formatMoney(trade.pnl)}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
            <EquityChart
              trades={closedTrades}
              capital={selectedAccount.capital}
            />
          </div>
        )}

        {section === "journal" && (
          <section className="panel journal-panel">
            <div className="panel-title">
              <div>
                <h2>{editingId ? "Edit Trade" : "Journal A Trade"}</h2>
                <p className="panel-subtitle">
                  Saved to {selectedAccount.name}. Tags are automatically title
                  case.
                </p>
              </div>
              {editingId ? (
                <button
                  className="ghost-action"
                  type="button"
                  onClick={() => {
                    setForm(emptyForm);
                    setEditingId(null);
                  }}
                >
                  <X size={15} /> Cancel Edit
                </button>
              ) : null}
            </div>
            <div className="journal-grid">
              <label>
                Account
                <select
                  value={selectedAccountId}
                  onChange={(event) => setSelectedAccountId(event.target.value)}
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Symbol
                <input
                  value={form.symbol}
                  onChange={(event) =>
                    setForm({ ...form, symbol: event.target.value })
                  }
                  placeholder="AAPL"
                />
              </label>
              <label>
                Direction
                <select
                  value={form.direction}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      direction: event.target.value as Direction,
                    })
                  }
                >
                  <option>Long</option>
                  <option>Short</option>
                </select>
              </label>
              <label>
                Setup
                <input
                  value={form.setup}
                  onChange={(event) =>
                    setForm({ ...form, setup: event.target.value })
                  }
                  placeholder="Opening range break"
                />
              </label>
              <label>
                Tags
                <input
                  value={form.tags}
                  onChange={(event) =>
                    setForm({ ...form, tags: titleCase(event.target.value) })
                  }
                  placeholder="Breakout, Discipline"
                />
              </label>
              <label>
                Entry Price
                <input
                  type="number"
                  value={form.entryPrice}
                  onChange={(event) =>
                    setForm({ ...form, entryPrice: event.target.value })
                  }
                />
              </label>
              <label>
                Exit Price
                <input
                  type="number"
                  value={form.exitPrice}
                  onChange={(event) =>
                    setForm({ ...form, exitPrice: event.target.value })
                  }
                />
              </label>
              <label>
                Net P&L
                <input
                  type="number"
                  value={form.pnl}
                  onChange={(event) =>
                    setForm({ ...form, pnl: event.target.value })
                  }
                />
              </label>
              <label>
                Risk Amount
                <input
                  type="number"
                  value={form.risk}
                  onChange={(event) =>
                    setForm({ ...form, risk: event.target.value })
                  }
                />
              </label>
              <label>
                Entry Time
                <input
                  type="datetime-local"
                  value={form.entryTime}
                  onChange={(event) =>
                    setForm({ ...form, entryTime: event.target.value })
                  }
                />
              </label>
              <label>
                Exit Time
                <input
                  type="datetime-local"
                  value={form.exitTime}
                  onChange={(event) =>
                    setForm({ ...form, exitTime: event.target.value })
                  }
                />
              </label>
              <label className="wide">
                Notes
                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm({ ...form, notes: event.target.value })
                  }
                />
              </label>
            </div>
            <button
              className="primary-action"
              type="button"
              onClick={saveTrade}
            >
              <Save size={16} /> {editingId ? "Update Trade" : "Save Trade"}
            </button>
          </section>
        )}

        {section === "logs" && (
          <section className="panel logs-panel">
            <div className="panel-title">
              <h2>Your Logs</h2>
              <div className="log-tools">
                <label className="search-box">
                  <Search size={15} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search symbol, setup, tag"
                  />
                </label>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as "All" | TradeStatus)
                  }
                >
                  <option>All</option>
                  <option>Win</option>
                  <option>Loss</option>
                  <option>Breakeven</option>
                </select>
                <button type="button">
                  <Columns3 size={15} /> Columns
                </button>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" aria-label="Select all trades" />
                    </th>
                    <th>Symbol</th>
                    <th>Account</th>
                    <th>Tags</th>
                    <th>Entry Price</th>
                    <th>Exit Price</th>
                    <th>Entry Time</th>
                    <th>Exit Time</th>
                    <th>Net P&L</th>
                    <th>Direction</th>
                    <th>Duration</th>
                    <th>RR</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrades.map((trade) => (
                    <tr key={trade.id}>
                      <td>
                        <input
                          type="checkbox"
                          aria-label={`Select ${trade.symbol}`}
                        />
                      </td>
                      <td>
                        <strong>{trade.symbol}</strong>
                        <small>{trade.setup}</small>
                      </td>
                      <td>{selectedAccount.name}</td>
                      <td>{trade.tags || "-"}</td>
                      <td>{numberFormat.format(trade.entryPrice)}</td>
                      <td>{numberFormat.format(trade.exitPrice)}</td>
                      <td>{formatDateTime(trade.entryTime)}</td>
                      <td>{formatDateTime(trade.exitTime)}</td>
                      <td
                        className={
                          trade.pnl >= 0 ? "money-positive" : "money-negative"
                        }
                      >
                        {formatMoney(trade.pnl)}
                      </td>
                      <td>
                        <span
                          className={`direction ${trade.direction.toLowerCase()}`}
                        >
                          {trade.direction}
                        </span>
                      </td>
                      <td>{formatDuration(holdingHours(trade))}</td>
                      <td>{numberFormat.format(trade.rr)}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            onClick={() => loadTrade(trade)}
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setTrades((current) =>
                                current.filter((item) => item.id !== trade.id),
                              )
                            }
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filteredTrades.length ? (
                <div className="empty-state">
                  <p>Waiting for journal logs...</p>
                </div>
              ) : null}
            </div>
          </section>
        )}

        {section === "reports" && (
          <div className="content-stack">
            <div className="report-hero">
              <div>
                <p>{selectedAccount.name}</p>
                <h2>Find the habits behind your equity curve.</h2>
              </div>
              <FileBarChart size={42} />
            </div>
            <div className="reports-grid">
              <StatsTable
                title="All Time Stats"
                rows={[
                  ["Starting Capital", formatMoney(selectedAccount.capital)],
                  [
                    "Current Equity",
                    formatMoney(selectedAccount.capital + stats.totalPnl),
                  ],
                  ["Total P&L", formatMoney(stats.totalPnl)],
                  ["Total Trades", String(stats.totalTrades)],
                  [
                    "Average Winning Trade",
                    formatMoney(stats.averageWinningTrade),
                  ],
                  [
                    "Average Losing Trade",
                    formatMoney(stats.averageLosingTrade),
                  ],
                  ["Largest Profit", formatMoney(stats.largestProfit)],
                  ["Largest Loss", formatMoney(stats.largestLoss)],
                  ["Average Trade P&L", formatMoney(stats.averageTradePnl)],
                  ["Profit Factor", numberFormat.format(stats.profitFactor)],
                ]}
              />
              <StatsTable
                title="Time And Consistency"
                rows={[
                  ["Total Trading Days", String(stats.tradingDays)],
                  ["Winning Days", String(stats.winningDays)],
                  ["Losing Days", String(stats.losingDays)],
                  [
                    "Average Daily P&L",
                    formatMoney(
                      stats.tradingDays
                        ? stats.totalPnl / stats.tradingDays
                        : 0,
                    ),
                  ],
                  ["Month with Max P&L", stats.bestMonthName],
                  ["Max P&L Value", formatMoney(stats.bestMonth)],
                  ["Month with Min P&L", stats.worstMonthName],
                  ["Min P&L Value", formatMoney(stats.worstMonth)],
                  [
                    "Avg Hold Time (All)",
                    formatDuration(stats.averageHoldingPeriod),
                  ],
                  [
                    "Avg Hold Time (Winning)",
                    formatDuration(stats.averageHoldingWin),
                  ],
                  [
                    "Avg Hold Time (Losing)",
                    formatDuration(stats.averageHoldingLoss),
                  ],
                ]}
              />
            </div>
            <EquityChart
              trades={closedTrades}
              capital={selectedAccount.capital}
            />
          </div>
        )}

        {section === "calendar" && (
  <section className="panel economic-panel">
    <div className="panel-title">
      <div>
        <h2>Economic Calendar</h2>
        <p className="panel-subtitle">
          Source: TradingView Economic Calendar. Forex Factory has no official public API available for this app.
        </p>
      </div>
      <span className="badge">Weekly View</span>
    </div>

    {/* TOOLBAR: Added "This Week" button between Previous and Next controls */}
    <div className="calendar-toolbar">
      <div className="mini-controls calendar-nav">
        <button type="button" onClick={() => moveEventWeek(-1)}>
          <ChevronLeft size={14} /> Previous
        </button>
        <button
          type="button"
          className="week-pill"
          onClick={() => jumpToCurrentWeek?.()}
          title="Jump to current week"
        >
          This Week
        </button>
        <strong className="calendar-range">
          {eventWeekStart} to {eventWeekEnd}
        </strong>
        <button type="button" onClick={() => moveEventWeek(1)}>
          Next <ChevronRight size={14} />
        </button>
      </div>

      <label className="filter-label">
        <span>Currency</span>
        <select
          value={currencyFilter}
          onChange={(event) => setCurrencyFilter(event.target.value)}
        >
          <option value="All">All</option>
          {currencyOptions.map((currencyCode) => (
            <option key={currencyCode}>{currencyCode}</option>
          ))}
        </select>
      </label>
    </div>

    <div className="event-list">
      <div className="event-head">
        <span>Time</span>
        <span>Currency</span>
        <span>Event</span>
        <span>Actual</span>
        <span>Forecast</span>
        <span>Previous</span>
      </div>

      {filteredEvents.map((event) => (
        <article
          className={`event-row ${event.impact.toLowerCase()}`}
          key={`${event.date}-${event.time}-${event.event}`}
        >
          <span className="event-time">
            <span>
              {new Intl.DateTimeFormat("en-US", {
                weekday: "short",
                month: "short",
                day: "2-digit",
              }).format(new Date(`${event.date}T00:00`))}
            </span>
            <small>{event.time}</small>
          </span>

          <span className="country-dot">{event.currency}</span>
          
          <div className="event-meta">
            <strong>{event.event}</strong>
            <p className="event-source">
              {event.impact} impact · {event.source}
            </p>
          </div>

          <span>{event.actual || "-"}</span>
          <span>{event.forecast || "-"}</span>
          <span>{event.previous || "-"}</span>
        </article>
      ))}

      {!filteredEvents.length ? (
        <div className="empty-state">
          <p>No events for this filter.</p>
        </div>
      ) : null}
    </div>
  </section>
)}

        {section === "calculator" && (
          <section className="panel calculator-panel">
            <div className="calculator-hero">
              <div>
                <p>{selectedAccount.name}</p>
                <h2>Position size without adrenaline math.</h2>
              </div>
              <Calculator size={34} />
            </div>
            <div className="accounts-panel">
              <div>
  <h2>Accounts</h2>
  <p className="panel-subtitle">
    Create, select, edit, and delete local trading accounts.
  </p>
</div>

<div className="account-form">
  <input
    value={newAccount.name}
    onChange={(event) =>
      setNewAccount({ ...newAccount, name: event.target.value })
    }
    placeholder="Account name"
  />
  <input
    type="number"
    value={newAccount.capital}
    onChange={(event) =>
      setNewAccount({
        ...newAccount,
        capital: event.target.value,
      })
    }
    placeholder="Capital"
  />
  <button type="button" onClick={addAccount}>
    <Plus size={15} /> Add Account
  </button>
</div>

<div className="account-list">
  {accounts.map((account) => (
    <article
      key={account.id}
      className={account.id === selectedAccountId ? "selected" : ""}
    >
      {editingAccountId === account.id ? (
        <div className="account-edit-row">
          <input
            className="account-name-input"
            value={accountDraft.name}
            onChange={(event) =>
              setAccountDraft({
                ...accountDraft,
                name: event.target.value,
              })
            }
          />
          <input
            className="account-capital-input"
            type="number"
            value={accountDraft.capital}
            onChange={(event) =>
              setAccountDraft({
                ...accountDraft,
                capital: event.target.value,
              })
            }
          />
          <button
            className="icon-button"
            type="button"
            onClick={saveAccount}
            aria-label={`Save ${account.name}`}
          >
            <Save size={15} />
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={() => setEditingAccountId(null)}
            aria-label="Cancel account edit"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <div className="account-card">
          <button
            type="button"
            className="account-card-main"
            onClick={() => setSelectedAccountId(account.id)}
          >
            <div className="account-copy">
              <strong>{account.name}</strong>
              <span>{formatMoney(account.capital)}</span>
            </div>
          </button>

          <div className="account-actions">
            <button
              className="icon-button"
              type="button"
              title="Edit Account"
              aria-label={`Edit ${account.name}`}
              onClick={() => startEditAccount(account)}
            >
              <Edit3 size={15} />
            </button>
            <button
              className="icon-button danger"
              type="button"
              title="Delete Account"
              aria-label={`Delete ${account.name}`}
              onClick={() => deleteAccount(account.id)}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      )}
    </article>
  ))}
</div>
            </div>
            <div className="calc-grid">
              <label>
                Account Capital
                <input
                  type="number"
                  value={selectedAccount.capital}
                  onChange={(event) =>
                    setAccounts((current) =>
                      current.map((account) =>
                        account.id === selectedAccount.id
                          ? { ...account, capital: Number(event.target.value) }
                          : account,
                      ),
                    )
                  }
                />
              </label>
              <label>
                Risk %
                <input
                  type="number"
                  value={risk.riskPercent}
                  onChange={(event) =>
                    setRisk({ ...risk, riskPercent: event.target.value })
                  }
                />
              </label>
              <label>
                Stop Loss %
                <input
                  type="number"
                  value={risk.stopLossPercent}
                  onChange={(event) =>
                    setRisk({ ...risk, stopLossPercent: event.target.value })
                  }
                />
              </label>
              <label>
                Leverage
                <input
                  type="number"
                  value={risk.leverage}
                  onChange={(event) =>
                    setRisk({ ...risk, leverage: event.target.value })
                  }
                />
              </label>
            </div>
            <div className="formula-strip">
              <span>( Portfolio Risk Amt.</span>
              <strong>/</strong>
              <span>SL % )</span>
              <strong>/</strong>
              <span>Leverage</span>
              <strong>=</strong>
              <span>Position Size</span>
            </div>
            <div className="stats-grid">
              <StatCard
                label="Risk Amount"
                value={formatMoney(riskAmount)}
                icon={Target}
              />
              <StatCard
                label="Position Size"
                value={formatMoney(positionSize)}
                icon={CircleDollarSign}
                tone="positive"
              />
              <StatCard
                label="Capital Used"
                value={formatMoney(capitalUsed)}
                icon={Gauge}
              />
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
