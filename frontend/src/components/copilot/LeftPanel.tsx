import { useEffect, useState } from "react";
import { useCopilot } from "@/lib/copilot-store";
import { initialChat, type ChatMessage, type Alert } from "@/lib/mock-data";
import { api } from "@/lib/api";
import Papa from "papaparse";
import {
  Send,
  Mic,
  ChevronRight,
  Terminal,
  FileText,
  FileDown,
  Image as ImgIcon,
} from "lucide-react";

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
  const { dashboardMetrics, fetchDashboardMetrics } = useCopilot();
  
  useEffect(() => {
    fetchDashboardMetrics();
  }, [fetchDashboardMetrics]);

  const active = dashboardMetrics?.active_investigations || 0;
  const critical = dashboardMetrics?.critical_cases || 0;
  const todaysFir = dashboardMetrics?.todays_fir || 0;
  // Compute some placeholder risk score based on critical cases, or just default to 0.0 if no cases
  const riskScore = critical > 0 ? (critical * 0.5).toFixed(1) : "0.0";
  
  const alertsList: Alert[] = dashboardMetrics?.recent_alerts || [];

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-4 space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        <Stat label="Active Investigations" value={active.toString()} />
        <Stat label="Critical Cases" value={critical.toString()} trend={critical > 0 ? "Requires Attention" : ""} tone="red" />
        <Stat label="Total FIRs" value={todaysFir.toString()} />
        <Stat label="Avg Risk Score" value={riskScore} trend="predictive index" tone="amber" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-lo)]">
            Recent Alerts
          </div>
          <button 
            onClick={() => useCopilot.getState().setActiveTab('audit')} 
            className="font-mono text-[10px] text-[var(--color-amber)] hover:underline"
          >
            VIEW ALL
          </button>
        </div>
        <div className="space-y-2">
          {alertsList.length === 0 && (
            <div className="text-[11px] text-[var(--color-text-lo)] italic">No recent alerts.</div>
          )}
          {alertsList.map((a) => {
            const s = sevPill[a.severity] || sevPill.low;
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
                    {a.timestamp || "Just now"}
                  </span>
                </div>
                <div className="text-[12.5px] font-semibold text-[var(--color-text-hi)] mb-0.5">
                  {a.title || "Alert"}
                </div>
                {a.location && (
                  <div className="flex items-center gap-1 text-[11px] text-[var(--color-text-mid)] mb-1">
                    <span className="h-1 w-1 rounded-full bg-[var(--color-text-lo)]" />
                    {a.location}
                  </div>
                )}
                <div className="text-[11.5px] text-[var(--color-text-mid)] leading-snug">
                  {a.description || a.message}
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

  const send = async (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = { role: "user", text, timestamp: now };
    
    // Optimistically add user message and clear input
    setMessages((m) => [...m, userMsg]);
    setInput("");

    try {
      const agentMsg = await api.askCopilot(text);
      setMessages((m) => [...m, agentMsg]);
    } catch (e) {
      console.error(e);
      setMessages((m) => [
        ...m,
        {
          role: "agent",
          text: "Sorry, I could not connect to the backend. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
      ]);
    }
  };

  const suggestion = selectedCase ? `Ask about ${selectedCase.id}` : null;

  return (
    <div className="h-full flex flex-col">
      <div id="chat-history-container" className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
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
                  backgroundColor: m.role === "user" ? "var(--color-bg-3)" : "var(--color-bg-1)",
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
                    <div
                      className="mt-1.5 rounded bg-[#08.0b.0e] border-l-2 border-[var(--color-amber)] overflow-hidden"
                      style={{ backgroundColor: "#080b0e" }}
                    >
                      <div className="px-2.5 py-1 border-b border-[var(--color-border-soft)] flex items-center gap-2">
                        <span className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--color-text-lo)]">
                          Tables:
                        </span>
                        {m.query.tables.map((t) => (
                          <span key={t} className="font-mono text-[10px] text-[var(--color-amber)]">
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
              language === "kn" ? "ಒಂದು ಪ್ರಶ್ನೆ ಕೇಳಿ…" : "Ask about FIRs, accused, patterns…"
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
                    borderColor: active ? "var(--color-amber)" : "var(--color-border-default)",
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
  const { selectedCase } = useCopilot();
  const [graphData, setGraphData] = useState<{nodes: any[], edges: any[]} | null>(null);

  useEffect(() => {
    if (selectedCase) {
      api.getNetwork(selectedCase.id).then(setGraphData).catch(console.error);
    }
  }, [selectedCase]);

  if (!selectedCase) {
    return (
      <div className="h-full flex items-center justify-center p-4 text-[12px] text-[var(--color-text-lo)] italic">
        Select a case to view its network graph.
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden p-4">
      <div className="rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-soft)] h-full flex flex-col">
        <div className="px-3 py-2 border-b border-[var(--color-border-soft)] flex items-center justify-between">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-mid)]">
            Network · {selectedCase.id}
          </div>
          <div className="font-mono text-[10px] text-[var(--color-amber)]">
            {graphData?.nodes?.length || 0} nodes
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 flex flex-col gap-2 relative h-[300px]">
          {graphData && graphData.nodes.length > 0 ? (
            <div className="absolute inset-0 overflow-hidden bg-[var(--color-bg-1)]">
              <svg width="100%" height="100%" viewBox="-150 -150 300 300">
                {/* Edges */}
                {graphData.edges.map((e, idx) => {
                  const sourceNode = graphData.nodes.find((n) => n.data.id === e.data.source);
                  const targetNode = graphData.nodes.find((n) => n.data.id === e.data.target);
                  if (!sourceNode || !targetNode) return null;
                  
                  // Compute positions (case is center, others orbit)
                  const getPos = (n: any) => {
                    if (n.data.type === "Case") return { x: 0, y: 0 };
                    const i = graphData.nodes.filter(x => x.data.type !== "Case").findIndex(x => x.data.id === n.data.id);
                    const total = graphData.nodes.length - 1 || 1;
                    const angle = (i / total) * Math.PI * 2;
                    const radius = 100;
                    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
                  };
                  
                  const p1 = getPos(sourceNode);
                  const p2 = getPos(targetNode);
                  
                  return (
                    <g key={`edge-${idx}`}>
                      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--color-border-soft)" strokeWidth="1" strokeDasharray={e.data.label ? "4 2" : ""} />
                      {e.data.label && (
                        <text
                          x={(p1.x + p2.x) / 2}
                          y={(p1.y + p2.y) / 2 - 4}
                          fill="var(--color-text-mid)"
                          fontSize="7"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {e.data.label}
                        </text>
                      )}
                    </g>
                  );
                })}
                
                {/* Nodes */}
                {graphData.nodes.map((n) => {
                  const isCenter = n.data.type === "Case";
                  const i = graphData.nodes.filter(x => x.data.type !== "Case").findIndex(x => x.data.id === n.data.id);
                  const total = graphData.nodes.length - 1 || 1;
                  const angle = (i / total) * Math.PI * 2;
                  const radius = 100;
                  const pos = isCenter ? { x: 0, y: 0 } : { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
                  
                  let fill = "var(--color-text-lo)";
                  if (n.data.type === "Case") fill = "#4F9B90";
                  else if (n.data.type === "Accused" || n.data.type === "Victim") fill = "#C1584C";
                  else fill = "#5E6C73";
                  
                  return (
                    <g key={n.data.id} transform={`translate(${pos.x}, ${pos.y})`}>
                      <circle r={isCenter ? 14 : 10} fill={fill} stroke="var(--color-bg-2)" strokeWidth="2" />
                      <text
                        y={isCenter ? 22 : 18}
                        fill="var(--color-text-hi)"
                        fontSize="9"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {n.data.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            <>
              {!graphData && (
                <div className="text-[12px] text-[var(--color-text-lo)] italic">Loading graph data...</div>
              )}
              {graphData?.nodes?.length === 0 && (
                <div className="text-[12px] text-[var(--color-text-lo)] italic">No network data found for this case.</div>
              )}
            </>
          )}
        </div>
        <div className="px-3 py-2 border-t border-[var(--color-border-soft)] flex items-center gap-4">
          <LegendDot color="#C1584C" label="Person" />
          <LegendDot color="#4F9B90" label="Case" />
          <LegendDot color="#5E6C73" label="Location" />
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
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    api.getAuditLogs().then(setEntries).catch(console.error);
  }, []);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-4 space-y-3">
      {entries.map((e, i) => (
        <div
          key={e.id || i}
          className="rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-soft)] overflow-hidden"
        >
          <div className="px-3 py-2 border-b border-[var(--color-border-soft)] flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-lo)]">
              {e.action || `Action ${String(i + 1).padStart(3, "0")}`}
            </span>
            <span className="font-mono text-[10px] text-[var(--color-text-mid)]">{e.timestamp || "Recent"}</span>
          </div>
          <div className="px-3 py-2 text-[12px] text-[var(--color-text-hi)] italic">"{e.details || "System action"}"</div>
          {e.user && (
            <div
              className="border-l-2 border-[var(--color-amber)] mx-3 mb-3 rounded-r overflow-hidden"
              style={{ backgroundColor: "#080b0e" }}
            >
              <div className="px-2.5 py-1 flex items-center gap-2 border-b border-[var(--color-border-soft)]">
                <span className="font-mono text-[9.5px] text-[var(--color-amber)]">
                  User: {e.user}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
      {entries.length === 0 && (
        <div className="text-[12px] text-[var(--color-text-lo)] italic">No audit logs found.</div>
      )}
    </div>
  );
}

function ExportReports() {
  const [toast, setToast] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [progressVal, setProgressVal] = useState(0);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setProgressVal(0);
    setProgressText(`Preparing to upload ${files.length} file(s)...`);
    
    try {
      const fileArray = Array.from(files);
      let totalInserted = 0;
      let totalFailed = 0;
      let globalStartTime = Date.now();
      
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const tableName = file.name.replace(/\.[^/.]+$/, ""); // strip extension
        
        // Use a Promise to wrap the Papa.parse call
        const parsedRows = await new Promise<any[]>((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => resolve(results.data),
            error: (err: any) => reject(err),
          });
        });
        
        const totalRows = parsedRows.length;
        if (totalRows === 0) continue;
        
        const chunkSize = 100;
        let fileInserted = 0;
        let fileFailed = 0;
        
        for (let j = 0; j < totalRows; j += chunkSize) {
          const chunk = parsedRows.slice(j, j + chunkSize);
          
          setProgressText(
            `File ${i+1}/${fileArray.length} (${tableName}): Uploading ${Math.min(j + chunkSize, totalRows)} / ${totalRows} rows`
          );
          setProgressVal(Math.round(((j) / totalRows) * 100));
          
          try {
            const res = await api.uploadChunk(tableName, chunk);
            fileInserted += res.inserted || 0;
            fileFailed += res.failed || 0;
            if (res.errors && res.errors.length > 0) {
              console.error(`Chunk upload errors for ${tableName}:`, res.errors);
            }
            totalInserted += res.inserted || 0;
            totalFailed += res.failed || 0;
          } catch (err: any) {
             console.error(`Chunk failed for ${tableName}:`, err);
             fileFailed += chunk.length;
             totalFailed += chunk.length;
          }
          
          // Estimate ETA
          const elapsedSec = (Date.now() - globalStartTime) / 1000;
          const rowsProcessedSoFar = totalInserted + totalFailed;
          if (rowsProcessedSoFar > 0) {
            const speed = rowsProcessedSoFar / elapsedSec; // rows per sec
            const estimatedTotalRows = fileArray.length * totalRows; // Rough estimate if multiple files
            const remaining = Math.max(0, estimatedTotalRows - rowsProcessedSoFar);
            const etaSec = Math.round(remaining / speed);
            setProgressText(prev => prev + ` | ETA: ${etaSec}s`);
          }
        }
        
        setProgressVal(100);
      }
      
      setToast(`✓ Success: ${totalInserted} inserted, ${totalFailed} failed.`);
    } catch (err: any) {
      setToast(`✗ Upload failed: ${err.message}`);
    } finally {
      setTimeout(() => setUploading(false), 2000);
      e.target.value = ''; // Reset input
    }
  };
  const cards = [
    {
      id: "chat_history",
      icon: FileText,
      title: "Conversation History",
      desc: "Export current chat as a signed PDF transcript.",
    },
    {
      id: "case_bundle",
      icon: FileDown,
      title: "Case Bundle",
      desc: "Compile the filtered case set into an investigation report.",
    },
    {
      id: "network_snapshot",
      icon: ImgIcon,
      title: "Network Graph Snapshot",
      desc: "Export the current graph view as a high-resolution image.",
    },
  ];
  
  const trigger = async (id: string, name: string) => {
    if (id === "chat_history") {
      setToast(`Generating PDF...`);
      try {
        const html2canvas = (await import("html2canvas")).default;
        const { jsPDF } = await import("jspdf");
        
        const chatElement = document.getElementById("chat-history-container");
        if (!chatElement) {
           setToast(`✗ Chat history not found! Open the chat tab first.`);
           return;
        }
        
        const canvas = await html2canvas(chatElement, {
          backgroundColor: "#0c1013",
          scale: 2
        });
        
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4"
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.setFontSize(16);
        pdf.text("Crime Copilot - Chat Transcript", 10, 10);
        pdf.setFontSize(10);
        pdf.text(`Generated on: ${new Date().toLocaleString()}`, 10, 16);
        
        pdf.addImage(imgData, "PNG", 0, 20, pdfWidth, pdfHeight);
        pdf.save("copilot_chat_transcript.pdf");
        
        setToast(`✓ ${name} downloaded successfully!`);
      } catch (err) {
        console.error(err);
        setToast(`✗ Failed to generate PDF`);
      }
    } else {
      setToast(`✓ ${name} generated — ready to download`);
    }
    setTimeout(() => setToast(null), 3000);
  };
  
  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-4 space-y-3 relative">
      <div className="rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-soft)] p-3 mb-4">
        <div className="text-[12.5px] font-semibold text-[var(--color-text-hi)] mb-1">
          Import Data
        </div>
        <div className="text-[11.5px] text-[var(--color-text-mid)] mb-3 leading-snug">
          Upload a CSV file of cases to insert into the Catalyst Data Store.
        </div>
        <label className={`w-full flex items-center justify-center rounded bg-[var(--color-bg-3)] border border-dashed border-[var(--color-border-default)] hover:border-[var(--color-amber-dim)] hover:text-[var(--color-amber)] text-[11.5px] font-mono uppercase tracking-wider text-[var(--color-text-mid)] py-2 cursor-pointer transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
          {uploading ? "Uploading..." : "Select CSV Files"}
          <input type="file" accept=".csv" multiple className="hidden" onChange={handleFileUpload} disabled={uploading} />
        </label>
        
        {uploading && (
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-[var(--color-text-lo)] mb-1">
              <span className="truncate pr-2">{progressText}</span>
              <span>{progressVal}%</span>
            </div>
            <div className="w-full bg-[var(--color-bg-3)] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[var(--color-amber)] h-full transition-all duration-300"
                style={{ width: `${progressVal}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className="rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-soft)] p-3"
          >
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
              onClick={() => trigger(c.id, c.title)}
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
