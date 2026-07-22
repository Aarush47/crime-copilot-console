import { useState } from "react";
import { useCopilot } from "@/lib/copilot-store";
import { alerts, initialChat, type ChatMessage } from "@/lib/mock-data";
import { Send, Mic, ChevronRight, Terminal, FileText, FileDown, Image as ImgIcon } from "lucide-react";

const sevPill: Record<string, { bg: string; fg: string }> = {
  low: { bg: "rgba(79,155,144,0.15)", fg: "var(--color-teal)" },
  warning: { bg: "rgba(217,164,65,0.15)", fg: "var(--color-amber)" },
  elevated: { bg: "rgba(224,146,74,0.15)", fg: "var(--color-orange-el)" },
  critical: { bg: "rgba(193,88,76,0.18)", fg: "var(--color-red-crit)" },
};

export function LeftPanel() {
  const { activeTab } = useCopilot();
  return (
    <div className="fixed left-[68px] top-20 bottom-3 w-[380px] z-20 panel-float flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--color-border-soft)] flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-lo)]">
          {tabLabel[activeTab]}
        </div>
        <div className="font-mono text-[9px] text-[var(--color-teal)] flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-teal)] animate-pulse" />
          LIVE
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {activeTab === "overview" && <Overview />}
        {activeTab === "chat" && <Chat />}
        {activeTab === "filters" && <Filters />}
        {activeTab === "network" && <NetworkGraph />}
        {activeTab === "audit" && <AuditLog />}
        {activeTab === "export" && <ExportReports />}
      </div>
    </div>
  );
}

const tabLabel = {
  overview: "Overview",
  chat: "Copilot Chat",
  filters: "Filters",
  network: "Network Graph",
  audit: "Audit Log",
  export: "Export & Reports",
} as const;

function Overview() {
  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-4 space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        <Stat label="Active Investigations" value="147" />
        <Stat label="Critical Cases" value="12" trend="↑ 2 in 24h" tone="red" />
        <Stat label="FIRs · 30d" value="418" />
        <Stat label="Avg Risk Score" value="6.4" trend="predictive index" tone="amber" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-lo)]">
            Recent Alerts
          </div>
          <button className="font-mono text-[10px] text-[var(--color-amber)] hover:underline">
            VIEW ALL
          </button>
        </div>
        <div className="space-y-2">
          {alerts.map((a) => {
            const s = sevPill[a.severity];
            return (
              <div
                key={a.id}
                className="rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-soft)] p-3 hover:border-[var(--color-amber-dim)] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="font-mono text-[9.5px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider"
                    style={{ backgroundColor: s.bg, color: s.fg }}
                  >
                    {a.severity}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--color-text-lo)]">
                    {a.timestamp}
                  </span>
                </div>
                <div className="text-[12.5px] font-semibold text-[var(--color-text-hi)] mb-0.5">
                  {a.title}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[var(--color-text-mid)] mb-1">
                  <span className="h-1 w-1 rounded-full bg-[var(--color-text-lo)]" />
                  {a.location}
                </div>
                <div className="text-[11.5px] text-[var(--color-text-mid)] leading-snug">
                  {a.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  trend,
  tone,
}: {
  label: string;
  value: string;
  trend?: string;
  tone?: "red" | "amber";
}) {
  const color =
    tone === "red"
      ? "var(--color-red-crit)"
      : tone === "amber"
        ? "var(--color-amber)"
        : "var(--color-text-hi)";
  return (
    <div className="rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-soft)] p-2.5">
      <div className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--color-text-lo)] mb-1">
        {label}
      </div>
      <div className="font-mono text-[22px] font-semibold leading-none" style={{ color }}>
        {value}
      </div>
      {trend && (
        <div className="mt-1 font-mono text-[10px]" style={{ color }}>
          {trend}
        </div>
      )}
    </div>
  );
}

function Chat() {
  const { selectedCase, language } = useCopilot();
  const [messages, setMessages] = useState<ChatMessage[]>(initialChat);
  const [input, setInput] = useState("");
  const [openQuery, setOpenQuery] = useState<number | null>(1);

  const send = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = { role: "user", text, timestamp: now };
    const agentMsg: ChatMessage = {
      role: "agent",
      text: `Running query across FIR + accused tables… 4 matching records. Common thread: two-wheeler-borne suspects, ITPL corridor.`,
      timestamp: now,
      query: {
        tables: ["fir", "accused", "location"],
        sql: `SELECT f.fir_no, f.registered_at, l.district, a.name
FROM fir f
JOIN location l ON l.id = f.location_id
LEFT JOIN accused a ON a.fir_no = f.fir_no
WHERE l.district = 'Whitefield'
  AND f.crime_type = 'Robbery'
ORDER BY f.registered_at DESC
LIMIT 20;`,
      },
    };
    setMessages((m) => [...m, userMsg, agentMsg]);
    setInput("");
  };

  const suggestion = selectedCase ? `Ask about ${selectedCase.id}` : null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[85%]">
              {m.role === "agent" && (
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-amber)]" />
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--color-text-lo)]">
                    Copilot · {m.timestamp}
                  </span>
                </div>
              )}
              <div
                className="rounded-md px-3 py-2 text-[12.5px] leading-relaxed"
                style={{
                  backgroundColor:
                    m.role === "user" ? "var(--color-bg-3)" : "var(--color-bg-1)",
                  border: "1px solid var(--color-border-soft)",
                  color: "var(--color-text-hi)",
                }}
              >
                {m.text}
              </div>
              {m.query && (
                <div className="mt-1.5">
                  <button
                    onClick={() => setOpenQuery(openQuery === i ? null : i)}
                    className="flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-amber)] border border-[var(--color-amber-dim)] rounded px-2 py-1 hover:bg-[rgba(217,164,65,0.08)]"
                  >
                    <ChevronRight
                      size={11}
                      className="transition-transform"
                      style={{
                        transform: openQuery === i ? "rotate(90deg)" : "none",
                      }}
                    />
                    <Terminal size={11} />
                    {openQuery === i ? "Hide query" : "Show query"}
                  </button>
                  {openQuery === i && (
                    <div className="mt-1.5 rounded bg-[#08.0b.0e] border-l-2 border-[var(--color-amber)] overflow-hidden"
                      style={{ backgroundColor: "#080b0e" }}
                    >
                      <div className="px-2.5 py-1 border-b border-[var(--color-border-soft)] flex items-center gap-2">
                        <span className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--color-text-lo)]">
                          Tables:
                        </span>
                        {m.query.tables.map((t) => (
                          <span
                            key={t}
                            className="font-mono text-[10px] text-[var(--color-amber)]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <pre className="p-2.5 font-mono text-[11px] text-[var(--color-text-hi)] whitespace-pre-wrap overflow-x-auto">
                        {m.query.sql}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--color-border-soft)] p-3">
        {suggestion && (
          <button
            onClick={() => send(`Tell me everything about case ${selectedCase!.id}`)}
            className="mb-2 flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-amber)] border border-[var(--color-amber-dim)] rounded px-2 py-1 hover:bg-[rgba(217,164,65,0.08)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-amber)]" />
            {suggestion}
          </button>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-default)] px-2 py-1.5 focus-within:border-[var(--color-amber-dim)]"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === "kn"
                ? "ಒಂದು ಪ್ರಶ್ನೆ ಕೇಳಿ…"
                : "Ask about FIRs, accused, patterns…"
            }
            className="flex-1 bg-transparent outline-none text-[12.5px] placeholder:text-[var(--color-text-lo)]"
          />
          <button
            type="button"
            className="h-7 w-7 rounded flex items-center justify-center text-[var(--color-text-mid)] hover:text-[var(--color-amber)]"
          >
            <Mic size={13} />
          </button>
          <button
            type="submit"
            className="h-7 w-7 rounded flex items-center justify-center bg-[var(--color-amber)] text-[#0c1013] hover:brightness-110"
          >
            <Send size={13} />
          </button>
        </form>
      </div>
    </div>
  );
}

function Filters() {
  const { filters, toggleCrimeType, toggleStatus } = useCopilot();
  const crimeTypes = ["Robbery", "Theft", "Burglary", "Cybercrime", "Assault", "Missing Person"];
  const statuses = ["Under Investigation", "Chargesheeted", "Closed"];
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-5">
        <Section label="Crime Type">
          <div className="flex flex-wrap gap-1.5">
            {crimeTypes.map((c) => {
              const active = filters.crimeTypes.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => toggleCrimeType(c)}
                  className="px-2.5 py-1 rounded text-[11.5px] transition-colors border"
                  style={{
                    backgroundColor: active ? "var(--color-amber)" : "var(--color-bg-2)",
                    color: active ? "#0c1013" : "var(--color-text-mid)",
                    borderColor: active
                      ? "var(--color-amber)"
                      : "var(--color-border-default)",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </Section>
        <Section label="District / Sub-division">
          <select className="w-full rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-default)] px-2.5 py-2 text-[12.5px] text-[var(--color-text-hi)] outline-none focus:border-[var(--color-amber-dim)]">
            <option>All districts</option>
            <option>Whitefield</option>
            <option>Indiranagar</option>
            <option>Koramangala</option>
            <option>KR Puram</option>
            <option>Marathahalli</option>
          </select>
        </Section>
        <Section label="Date Range">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              className="rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-default)] px-2.5 py-2 text-[12px] font-mono text-[var(--color-text-hi)] outline-none focus:border-[var(--color-amber-dim)]"
              defaultValue="2026-06-22"
            />
            <input
              type="date"
              className="rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-default)] px-2.5 py-2 text-[12px] font-mono text-[var(--color-text-hi)] outline-none focus:border-[var(--color-amber-dim)]"
              defaultValue="2026-07-22"
            />
          </div>
        </Section>
        <Section label="Case Status">
          <div className="flex flex-wrap gap-1.5">
            {statuses.map((s) => {
              const active = filters.status.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleStatus(s)}
                  className="px-2.5 py-1 rounded text-[11.5px] transition-colors border"
                  style={{
                    backgroundColor: active ? "var(--color-amber)" : "var(--color-bg-2)",
                    color: active ? "#0c1013" : "var(--color-text-mid)",
                    borderColor: active ? "var(--color-amber)" : "var(--color-border-default)",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </Section>
      </div>
      <div className="p-3 border-t border-[var(--color-border-soft)]">
        <button className="w-full rounded-md bg-[var(--color-amber)] text-[#0c1013] font-semibold text-[12.5px] py-2.5 hover:brightness-110">
          Apply Filters
        </button>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-lo)] mb-2">
        {label}
      </div>
      {children}
    </div>
  );
}

function NetworkGraph() {
  return (
    <div className="h-full overflow-hidden p-4">
      <div className="rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-soft)] h-full flex flex-col">
        <div className="px-3 py-2 border-b border-[var(--color-border-soft)] flex items-center justify-between">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-mid)]">
            Suspect Cluster · Ramesh K.
          </div>
          <div className="font-mono text-[10px] text-[var(--color-amber)]">4 flagged links</div>
        </div>
        <svg viewBox="0 0 340 380" className="flex-1 w-full">
          {/* dashed flagged edges */}
          <line x1="170" y1="180" x2="70" y2="80" stroke="var(--color-amber)" strokeWidth="1.2" strokeDasharray="4 3" />
          <line x1="170" y1="180" x2="280" y2="90" stroke="var(--color-amber)" strokeWidth="1.2" strokeDasharray="4 3" />
          <line x1="170" y1="180" x2="60" y2="290" stroke="var(--color-amber)" strokeWidth="1.2" strokeDasharray="4 3" />
          {/* solid edges */}
          <line x1="170" y1="180" x2="280" y2="290" stroke="#4F9B90" strokeWidth="1" opacity="0.6" />
          <line x1="70" y1="80" x2="60" y2="290" stroke="#293138" strokeWidth="1" />
          <line x1="280" y1="90" x2="280" y2="290" stroke="#293138" strokeWidth="1" />

          {/* victim nodes */}
          {[
            [70, 80, "V-441"],
            [280, 90, "V-508"],
            [60, 290, "V-522"],
            [280, 290, "V-611"],
          ].map(([x, y, id]) => (
            <g key={id as string}>
              <circle cx={x as number} cy={y as number} r="14" fill="var(--color-bg-3)" stroke="#5E6C73" strokeWidth="1.2" />
              <text x={x as number} y={(y as number) + 3} textAnchor="middle" fontSize="8" fill="#9DACB3" fontFamily="IBM Plex Mono">
                {id}
              </text>
            </g>
          ))}

          {/* case nodes (teal) */}
          {[
            [110, 200, "WF-0221"],
            [230, 200, "MA-0411"],
            [170, 300, "IN-0187"],
          ].map(([x, y, id]) => (
            <g key={id as string}>
              <circle cx={x as number} cy={y as number} r="16" fill="rgba(79,155,144,0.15)" stroke="#4F9B90" strokeWidth="1.4" />
              <text x={x as number} y={(y as number) + 3} textAnchor="middle" fontSize="8" fill="#4F9B90" fontFamily="IBM Plex Mono" fontWeight="600">
                {id}
              </text>
            </g>
          ))}

          {/* central accused */}
          <circle cx="170" cy="180" r="24" fill="rgba(193,88,76,0.15)" stroke="#C1584C" strokeWidth="1.8" />
          <text x="170" y="177" textAnchor="middle" fontSize="8" fill="#9DACB3" fontFamily="IBM Plex Mono">
            ACCUSED
          </text>
          <text x="170" y="188" textAnchor="middle" fontSize="10" fill="#E9EEF0" fontWeight="600" fontFamily="IBM Plex Sans">
            Ramesh K.
          </text>
        </svg>
        <div className="px-3 py-2 border-t border-[var(--color-border-soft)] flex items-center gap-4">
          <LegendDot color="#C1584C" label="Accused" />
          <LegendDot color="#4F9B90" label="Cases" />
          <LegendDot color="#5E6C73" label="Victims" />
          <LegendDot color="#D9A441" label="Flagged" dashed />
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {dashed ? (
        <span className="h-0 w-3 border-t border-dashed" style={{ borderColor: color }} />
      ) : (
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      )}
      <span className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--color-text-mid)]">
        {label}
      </span>
    </div>
  );
}

function AuditLog() {
  const entries = [
    {
      q: "Show all armed robbery cases in Whitefield in the last 30 days.",
      tables: ["fir", "crime_type"],
      sql: `SELECT * FROM fir WHERE crime_type='Armed Robbery' AND ps='Whitefield' AND registered_at >= NOW()-INTERVAL '30 days';`,
      t: "09:14:22",
    },
    {
      q: "List accused linked to more than 2 open FIRs.",
      tables: ["accused", "fir"],
      sql: `SELECT a.name, COUNT(*) c FROM accused a JOIN fir f ON f.fir_no=a.fir_no WHERE f.status='Open' GROUP BY a.name HAVING COUNT(*)>2;`,
      t: "09:22:07",
    },
    {
      q: "Any pattern between Marathahalli and Whitefield burglaries?",
      tables: ["fir", "location", "modus_operandi"],
      sql: `SELECT f.fir_no, m.pattern FROM fir f JOIN modus_operandi m ON m.fir_no=f.fir_no WHERE f.district IN ('Whitefield','Marathahalli') AND f.crime_type='Burglary';`,
      t: "09:38:51",
    },
  ];
  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-4 space-y-3">
      {entries.map((e, i) => (
        <div key={i} className="rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-soft)] overflow-hidden">
          <div className="px-3 py-2 border-b border-[var(--color-border-soft)] flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-lo)]">
              Query {String(i + 1).padStart(3, "0")}
            </span>
            <span className="font-mono text-[10px] text-[var(--color-text-mid)]">{e.t}</span>
          </div>
          <div className="px-3 py-2 text-[12px] text-[var(--color-text-hi)] italic">"{e.q}"</div>
          <div className="border-l-2 border-[var(--color-amber)] mx-3 mb-3 rounded-r overflow-hidden" style={{ backgroundColor: "#080b0e" }}>
            <div className="px-2.5 py-1 flex items-center gap-2 border-b border-[var(--color-border-soft)]">
              {e.tables.map((t) => (
                <span key={t} className="font-mono text-[9.5px] text-[var(--color-amber)]">
                  {t}
                </span>
              ))}
            </div>
            <pre className="p-2.5 font-mono text-[10.5px] text-[var(--color-text-hi)] whitespace-pre-wrap overflow-x-auto">
              {e.sql}
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
}

function ExportReports() {
  const [toast, setToast] = useState<string | null>(null);
  const cards = [
    { icon: FileText, title: "Conversation History", desc: "Export current chat as a signed PDF transcript." },
    { icon: FileDown as any, title: "Case Bundle", desc: "Compile the filtered case set into an investigation report." },
    { icon: ImgIcon, title: "Network Graph Snapshot", desc: "Export the current graph view as a high-resolution image." },
  ];
  const trigger = (name: string) => {
    setToast(`✓ ${name} generated — ready to download`);
    setTimeout(() => setToast(null), 2400);
  };
  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-4 space-y-3 relative">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.title} className="rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-soft)] p-3">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded bg-[var(--color-bg-3)] border border-[var(--color-amber-dim)] flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-[var(--color-amber)]" />
              </div>
              <div className="flex-1">
                <div className="text-[12.5px] font-semibold text-[var(--color-text-hi)]">
                  {c.title}
                </div>
                <div className="text-[11.5px] text-[var(--color-text-mid)] mt-0.5 leading-snug">
                  {c.desc}
                </div>
              </div>
            </div>
            <button
              onClick={() => trigger(c.title)}
              className="mt-3 w-full rounded bg-[var(--color-bg-3)] border border-[var(--color-border-default)] hover:border-[var(--color-amber-dim)] hover:text-[var(--color-amber)] text-[11.5px] font-mono uppercase tracking-wider text-[var(--color-text-mid)] py-1.5"
            >
              Export
            </button>
          </div>
        );
      })}
      {toast && (
        <div className="absolute bottom-3 left-3 right-3 rounded-md bg-[var(--color-bg-3)] border border-[var(--color-teal)] text-[var(--color-teal)] px-3 py-2 text-[12px] font-mono">
          {toast}
        </div>
      )}
    </div>
  );
}
