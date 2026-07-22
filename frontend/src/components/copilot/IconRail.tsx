import { useCopilot, type RailTab } from "@/lib/copilot-store";
import {
  LayoutDashboard,
  MessageSquare,
  SlidersHorizontal,
  Network,
  ScrollText,
  FileDown,
  Shield,
} from "lucide-react";

const items: { id: RailTab; icon: typeof Shield; label: string }[] = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  { id: "chat", icon: MessageSquare, label: "Copilot Chat" },
  { id: "filters", icon: SlidersHorizontal, label: "Filters" },
  { id: "network", icon: Network, label: "Network Graph" },
  { id: "audit", icon: ScrollText, label: "Audit Log" },
  { id: "export", icon: FileDown, label: "Export & Reports" },
];

export function IconRail() {
  const { activeTab, setActiveTab } = useCopilot();
  return (
    <div className="fixed left-0 top-0 bottom-0 w-14 bg-[var(--color-bg-1)] border-r border-[var(--color-border-default)] z-30 flex flex-col items-center py-3">
      <div className="h-9 w-9 rounded-md bg-[var(--color-bg-3)] border border-[var(--color-amber-dim)] flex items-center justify-center mb-4">
        <Shield size={16} className="text-[var(--color-amber)]" />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        {items.map((it) => {
          const Icon = it.icon;
          const active = activeTab === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setActiveTab(it.id)}
              className="relative h-10 w-10 rounded-md flex items-center justify-center group"
              style={{ backgroundColor: active ? "var(--color-bg-3)" : "transparent" }}
            >
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r bg-[var(--color-amber)]" />
              )}
              <Icon
                size={17}
                style={{
                  color: active ? "var(--color-amber)" : "var(--color-text-mid)",
                }}
              />
              <span className="absolute left-12 whitespace-nowrap px-2 py-1 rounded bg-[var(--color-bg-3)] border border-[var(--color-border-default)] text-[11px] text-[var(--color-text-hi)] opacity-0 group-hover:opacity-100 pointer-events-none font-mono uppercase tracking-wide">
                {it.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
