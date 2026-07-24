import { create } from "zustand";
import type { CaseMarker } from "./mock-data";
import { api } from "./api";

export type RailTab = "overview" | "chat" | "filters" | "network" | "audit" | "export";

interface CopilotState {
  activeTab: RailTab;
  selectedCase: CaseMarker | null;
  cases: CaseMarker[];
  dashboardMetrics: any | null;
  loadingCases: boolean;
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
  fetchCases: () => Promise<void>;
  fetchDashboardMetrics: () => Promise<void>;
}

export const useCopilot = create<CopilotState>((set) => ({
  activeTab: "overview",
  selectedCase: null,
  cases: [],
  dashboardMetrics: null,
  loadingCases: false,
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
  fetchCases: async () => {
    set({ loadingCases: true });
    try {
      const cases = await api.getCases();
      set({ cases, loadingCases: false });
    } catch (e) {
      console.error(e);
      set({ loadingCases: false });
    }
  },
  fetchDashboardMetrics: async () => {
    try {
      const metrics = await api.getDashboardMetrics();
      set({ dashboardMetrics: metrics });
    } catch (e) {
      console.error(e);
    }
  },
}));
