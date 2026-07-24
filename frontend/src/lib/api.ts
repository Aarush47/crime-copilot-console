import { type ChatMessage, type CaseMarker } from "./mock-data";

const API_BASE = import.meta.env.DEV 
  ? "" // uses Vite proxy locally
  : "https://crime-copilot-50044254740.development.catalystappsail.in";

export const api = {
  async getDashboardMetrics() {
    const res = await fetch(`${API_BASE}/api/dashboard`);
    if (!res.ok) throw new Error("Failed to fetch dashboard metrics");
    return res.json();
  },

  async getCases(): Promise<CaseMarker[]> {
    const res = await fetch(`${API_BASE}/api/cases`);
    if (!res.ok) throw new Error("Failed to fetch cases");
    const data = await res.json();
    
    return data.map((c: any) => ({
      id: c.case_id,
      district: c.district,
      position: { top: "50%", left: "50%" }, // Not heavily used if we use real map lat/lng
      lat: c.latitude,
      lng: c.longitude,
      severity: c.severity,
      caseCount: 1,
      crimeType: c.crime_head,
      unit: c.police_station,
      status: c.status,
      registeredDate: c.date,
      accused: "Unknown",
      briefFacts: c.description,
    }));
  },

  async askCopilot(question: string): Promise<ChatMessage> {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error("Failed to ask copilot");
    const data = await res.json();
    
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return {
      role: "agent",
      text: data.answer,
      timestamp: now,
      query: data.query ? { tables: ["crimes"], sql: data.query } : undefined,
    };
  },

  async uploadCases(files: FileList | File[]): Promise<{ message: string; inserted: number }> {
    const formData = new FormData();
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      formData.append("files", file);
    }

    const res = await fetch(`${API_BASE}/api/upload/cases`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Failed to upload cases");
    }
    return res.json();
  },

  async getCaseDetails(caseId: string) {
    const res = await fetch(`${API_BASE}/api/case/${caseId}`);
    if (!res.ok) throw new Error("Failed to fetch case details");
    return res.json();
  },

  async getNetwork(caseId: string) {
    const res = await fetch(`${API_BASE}/api/network/${caseId}`);
    if (!res.ok) throw new Error("Failed to fetch network graph");
    return res.json();
  },

  async getAnalytics() {
    const res = await fetch(`${API_BASE}/api/analytics`);
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return res.json();
  },

  async getAuditLogs() {
    const res = await fetch(`${API_BASE}/api/audit`);
    if (!res.ok) throw new Error("Failed to fetch audit logs");
    return res.json();
  }
};
