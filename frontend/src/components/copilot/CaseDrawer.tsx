import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useCopilot } from "@/lib/copilot-store";
import { X, GitBranch, MessageSquare, FileDown } from "lucide-react";

const sevColor: Record<string, string> = {
  low: "var(--color-teal)",
  elevated: "var(--color-orange-el)",
  critical: "var(--color-red-crit)",
};

export function CaseDrawer() {
  const { selectedCase, selectCase, openChatForCase } = useCopilot();
  const [caseDetails, setCaseDetails] = useState<any>(null);

  useEffect(() => {
    if (selectedCase) {
      api.getCaseDetails(selectedCase.id).then(setCaseDetails).catch(console.error);
    } else {
      setCaseDetails(null);
    }
  }, [selectedCase]);

  return (
    <AnimatePresence>
      {selectedCase && (
        <motion.aside
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed right-3 top-20 bottom-3 w-[300px] z-20 panel-float flex flex-col overflow-hidden"
        >
          <div className="flex items-start justify-between p-4 border-b border-[var(--color-border-soft)]">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: sevColor[selectedCase.severity || "low"] }}
                />
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-lo)]">
                  Case
                </span>
              </div>
              <div className="font-mono text-lg font-semibold text-[var(--color-amber)] mt-1">
                {selectedCase.id}
              </div>
              <div className="text-[11px] text-[var(--color-text-mid)] mt-0.5">
                {caseDetails ? caseDetails.status : selectedCase.status}
              </div>
            </div>
            <button
              onClick={() => selectCase(null)}
              className="h-7 w-7 rounded flex items-center justify-center text-[var(--color-text-mid)] hover:bg-[var(--color-bg-3)] hover:text-[var(--color-text-hi)]"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
            {!caseDetails ? (
              <div className="text-[12px] text-[var(--color-text-lo)] italic">Loading details...</div>
            ) : (
              <>
                <Field label="Crime Type" value={caseDetails.crime_head || selectedCase.crimeType} />
                <Field
                  label="District / Unit"
                  value={`${caseDetails.district || selectedCase.district} · ${caseDetails.police_station || selectedCase.unit}`}
                />
                <Field label="Registered" value={caseDetails.date || selectedCase.registeredDate} mono />
                <Field label="Accused" value={
                  caseDetails.accused?.length 
                    ? caseDetails.accused.map((a: any) => a.name).join(", ") 
                    : selectedCase.accused
                } highlight />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-lo)] mb-1.5">
                    Brief Facts
                  </div>
                  <p className="text-[12.5px] leading-relaxed text-[var(--color-text-hi)]">
                    {caseDetails.description || selectedCase.briefFacts}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="p-3 border-t border-[var(--color-border-soft)] space-y-2">
            <DrawerBtn icon={GitBranch} label="View in Network Graph" />
            <DrawerBtn
              icon={MessageSquare}
              label={`Ask Copilot about ${selectedCase.id}`}
              onClick={() => openChatForCase(selectedCase)}
            />
            <DrawerBtn icon={FileDown} label="Export Case Bundle" primary />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-lo)] mb-1">
        {label}
      </div>
      <div
        className={`text-[12.5px] ${mono ? "font-mono" : ""} ${
          highlight ? "text-[var(--color-amber)]" : "text-[var(--color-text-hi)]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function DrawerBtn({
  icon: Icon,
  label,
  primary,
  onClick,
}: {
  icon: typeof GitBranch;
  label: string;
  primary?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[12px] transition-colors"
      style={{
        backgroundColor: primary ? "var(--color-amber)" : "var(--color-bg-3)",
        color: primary ? "#0c1013" : "var(--color-text-hi)",
        border: primary ? "none" : "1px solid var(--color-border-default)",
        fontWeight: primary ? 600 : 500,
      }}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}
