import { cases } from "@/lib/mock-data";
import { useCopilot } from "@/lib/copilot-store";
import { Plus, Minus } from "lucide-react";

const sevColor: Record<string, string> = {
  low: "var(--color-teal)",
  elevated: "var(--color-orange-el)",
  critical: "var(--color-red-crit)",
};

export function MapCanvas() {
  const { selectedCase, selectCase } = useCopilot();

  return (
    <div className="absolute inset-0 map-grid-bg overflow-hidden">
      {/* faint district outlines */}
      <svg className="absolute inset-0 h-full w-full opacity-30" preserveAspectRatio="none">
        <defs>
          <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill="#293138" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* markers */}
      {cases.map((c) => {
        const active = selectedCase?.id === c.id;
        const color = sevColor[c.severity];
        return (
          <button
            key={c.id}
            onClick={() => selectCase(c)}
            style={{ top: c.position.top, left: c.position.left }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
          >
            <div className="relative flex flex-col items-center">
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  backgroundColor: color,
                  opacity: c.severity === "critical" ? 0.25 : 0.15,
                  width: 28,
                  height: 28,
                  left: -14,
                  top: -14,
                }}
              />
              <div
                className="relative h-4 w-4 rounded-full border-2 transition-transform group-hover:scale-125"
                style={{
                  backgroundColor: color,
                  borderColor: active ? "var(--color-amber)" : "rgba(233,238,240,0.9)",
                  boxShadow: active
                    ? "0 0 0 3px rgba(217,164,65,0.35)"
                    : "0 0 0 2px rgba(12,16,19,0.9)",
                }}
              />
              <div className="mt-1.5 px-1.5 py-0.5 rounded-sm bg-[var(--color-bg-1)]/90 border border-[var(--color-border-default)] font-mono text-[10px] text-[var(--color-text-hi)] whitespace-nowrap">
                {c.id} · {c.caseCount}
              </div>
            </div>
          </button>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-20 panel-float px-3 py-2.5">
        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-lo)] mb-1.5">
          Severity
        </div>
        <div className="flex flex-col gap-1 text-[11px]">
          {[
            ["Critical", "var(--color-red-crit)"],
            ["Elevated", "var(--color-orange-el)"],
            ["Low", "var(--color-teal)"],
          ].map(([l, c]) => (
            <div key={l} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c }} />
              <span className="text-[var(--color-text-mid)]">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Zoom */}
      <div className="absolute bottom-4 right-4 panel-float flex flex-col">
        <button className="h-8 w-8 flex items-center justify-center text-[var(--color-text-mid)] hover:text-[var(--color-amber)] border-b border-[var(--color-border-soft)]">
          <Plus size={14} />
        </button>
        <button className="h-8 w-8 flex items-center justify-center text-[var(--color-text-mid)] hover:text-[var(--color-amber)]">
          <Minus size={14} />
        </button>
      </div>

      {/* District labels */}
      {[
        ["Whitefield", "36%", "62%"],
        ["Indiranagar", "50%", "44%"],
        ["Koramangala", "64%", "40%"],
        ["KR Puram", "28%", "70%"],
        ["Marathahalli", "42%", "58%"],
      ].map(([n, t, l]) => (
        <div
          key={n}
          style={{ top: t, left: l }}
          className="absolute -translate-x-1/2 translate-y-6 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-lo)] pointer-events-none"
        >
          {n}
        </div>
      ))}
    </div>
  );
}
