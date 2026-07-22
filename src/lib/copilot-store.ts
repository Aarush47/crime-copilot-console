import { create } from "zustand";
import type { CaseMarker } from "./mock-data";

export type RailTab = "overview" | "chat" | "filters" | "network" | "audit" | "export";

interface CopilotState {
  activeTab: RailTab;
  selectedCase: CaseMarker | null;
  language: "en" | "kn";
  filters: {
    crimeTypes: string[];
    status: string[];
  };
  setActiveTab: (t: RailTab) => void;
  selectCase: (c: CaseMarker | null) => void;
  setLanguage: (l: "en" | "kn") => void;
  toggleCrimeType: (t: string) => void;
  toggleStatus: (s: string) => void;
  openChatForCase: (c: CaseMarker) => void;
}

export const useCopilot = create<CopilotState>((set) => ({
  activeTab: "overview",
  selectedCase: null,
  language: "en",
  filters: { crimeTypes: [], status: [] },
  setActiveTab: (t) => set({ activeTab: t }),
  selectCase: (c) => set({ selectedCase: c }),
  setLanguage: (l) => set({ language: l }),
  toggleCrimeType: (t) =>
    set((s) => ({
      filters: {
        ...s.filters,
        crimeTypes: s.filters.crimeTypes.includes(t)
          ? s.filters.crimeTypes.filter((x) => x !== t)
          : [...s.filters.crimeTypes, t],
      },
    })),
  toggleStatus: (st) =>
    set((s) => ({
      filters: {
        ...s.filters,
        status: s.filters.status.includes(st)
          ? s.filters.status.filter((x) => x !== st)
          : [...s.filters.status, st],
      },
    })),
  openChatForCase: (c) => set({ selectedCase: c, activeTab: "chat" }),
}));
