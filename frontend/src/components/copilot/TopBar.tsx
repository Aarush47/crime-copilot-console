import { Search } from "lucide-react";
import { useCopilot } from "@/lib/copilot-store";

export function TopBar() {
  const { language, setLanguage } = useCopilot();
  return (
    <div className="fixed top-3 left-[68px] right-3 z-20 flex items-center gap-3">
      <div className="panel-float px-3 py-2 flex items-center gap-2.5">
        <div className="h-7 w-7 rounded bg-[var(--color-bg-3)] border border-[var(--color-amber-dim)] flex items-center justify-center">
          <span className="font-mono text-[11px] font-semibold text-[var(--color-amber)]">KSP</span>
        </div>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold text-[var(--color-text-hi)]">Crime Copilot</div>
          <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--color-text-lo)]">
            Investigator Console · v0.4
          </div>
        </div>
      </div>

      <div className="panel-float flex-1 flex items-center gap-2 px-3 py-2">
        <Search size={14} className="text-[var(--color-text-lo)]" />
        <input
          className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-[var(--color-text-lo)] text-[var(--color-text-hi)]"
          placeholder="Search FIR number, accused name, or ask a question…"
        />
        <span className="hidden md:inline font-mono text-[10px] text-[var(--color-text-lo)] border border-[var(--color-border-default)] rounded px-1.5 py-0.5">
          ⌘K
        </span>
      </div>

      <div className="panel-float px-2 py-1.5 flex items-center gap-1">
        <button
          onClick={() => setLanguage("en")}
          className="px-2 py-1 rounded font-mono text-[11px] uppercase"
          style={{
            backgroundColor: language === "en" ? "var(--color-bg-3)" : "transparent",
            color: language === "en" ? "var(--color-amber)" : "var(--color-text-mid)",
          }}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage("kn")}
          className="px-2 py-1 rounded text-[11px]"
          style={{
            backgroundColor: language === "kn" ? "var(--color-bg-3)" : "transparent",
            color: language === "kn" ? "var(--color-amber)" : "var(--color-text-mid)",
          }}
        >
          ಕನ್ನಡ
        </button>
      </div>

      <div className="panel-float px-3 py-2 flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-[var(--color-bg-3)] border border-[var(--color-border-default)] flex items-center justify-center font-mono text-[10px] text-[var(--color-amber)]">
          IK
        </div>
        <div className="leading-tight">
          <div className="text-[12px] text-[var(--color-text-hi)]">Insp. Kulkarni</div>
          <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-text-lo)]">
            Investigator · Whitefield PS
          </div>
        </div>
      </div>
    </div>
  );
}
