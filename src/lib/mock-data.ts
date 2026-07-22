export type Severity = "low" | "elevated" | "critical";
export type AlertSeverity = "low" | "warning" | "elevated" | "critical";

export interface CaseMarker {
  id: string;
  district: string;
  position: { top: string; left: string };
  severity: Severity;
  caseCount: number;
  crimeType: string;
  unit: string;
  status: string;
  registeredDate: string;
  accused: string;
  briefFacts: string;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  location: string;
  description: string;
  timestamp: string;
}

export interface ChatMessage {
  role: "user" | "agent";
  text: string;
  timestamp: string;
  query?: { tables: string[]; sql: string };
}

export const cases: CaseMarker[] = [
  {
    id: "WF-0221",
    district: "Whitefield",
    position: { top: "38%", left: "62%" },
    severity: "critical",
    caseCount: 7,
    crimeType: "Armed Robbery",
    unit: "Whitefield PS",
    status: "Under Investigation",
    registeredDate: "2026-07-18",
    accused: "Ramesh K. (linked to 3 other cases)",
    briefFacts:
      "Armed robbery at commercial premises on ITPL Main Rd. Two suspects on motorcycle, modus operandi matches recent cluster in Marathahalli.",
  },
  {
    id: "IN-0187",
    district: "Indiranagar",
    position: { top: "48%", left: "44%" },
    severity: "elevated",
    caseCount: 4,
    crimeType: "Cybercrime",
    unit: "Indiranagar CEN",
    status: "Under Investigation",
    registeredDate: "2026-07-15",
    accused: "Unknown (IP traced to Bengaluru East)",
    briefFacts:
      "UPI phishing fraud, INR 4.2L. Complainant received fake KYC message. Mule account cluster identified.",
  },
  {
    id: "KM-0342",
    district: "Koramangala",
    position: { top: "62%", left: "40%" },
    severity: "elevated",
    caseCount: 5,
    crimeType: "Chain Snatching",
    unit: "Koramangala PS",
    status: "Under Investigation",
    registeredDate: "2026-07-19",
    accused: "Two unidentified males on Pulsar 150",
    briefFacts:
      "Chain snatching incidents reported near 5th Block. CCTV pattern consistent across three complaints in past 10 days.",
  },
  {
    id: "KR-0098",
    district: "KR Puram",
    position: { top: "30%", left: "70%" },
    severity: "low",
    caseCount: 2,
    crimeType: "Vehicle Theft",
    unit: "KR Puram PS",
    status: "Chargesheeted",
    registeredDate: "2026-07-02",
    accused: "Suresh D.",
    briefFacts:
      "Two-wheeler theft near KR Puram railway station. Recovered from Hoskote. Accused chargesheeted.",
  },
  {
    id: "MA-0411",
    district: "Marathahalli",
    position: { top: "44%", left: "58%" },
    severity: "critical",
    caseCount: 6,
    crimeType: "Burglary",
    unit: "Marathahalli PS",
    status: "Under Investigation",
    registeredDate: "2026-07-20",
    accused: "Ramesh K. (suspected)",
    briefFacts:
      "Night-time house burglary. Entry via balcony. Fingerprint match with Whitefield cluster. Cross-district pattern.",
  },
  {
    id: "IN-0192",
    district: "Indiranagar",
    position: { top: "54%", left: "48%" },
    severity: "low",
    caseCount: 1,
    crimeType: "Theft",
    unit: "Indiranagar PS",
    status: "Closed",
    registeredDate: "2026-06-28",
    accused: "Recovered — accused absconding",
    briefFacts: "Mobile theft at 100ft Road. Device recovered, case closed pending arrest.",
  },
];

export const alerts: Alert[] = [
  {
    id: "a1",
    severity: "critical",
    title: "Armed Robbery Cluster",
    location: "Whitefield / Marathahalli",
    description:
      "6 incidents in 14 days with matching MO. Same accused suspected across jurisdictions.",
    timestamp: "12m ago",
  },
  {
    id: "a2",
    severity: "elevated",
    title: "UPI Phishing Spike",
    location: "Indiranagar sub-division",
    description: "42% increase in cyber fraud complaints this week. Mule accounts identified.",
    timestamp: "1h ago",
  },
  {
    id: "a3",
    severity: "warning",
    title: "Chain Snatching Pattern",
    location: "Koramangala 5th Block",
    description: "Three complaints in 10 days, CCTV shows same suspect vehicle.",
    timestamp: "3h ago",
  },
  {
    id: "a4",
    severity: "low",
    title: "Vehicle Recovery",
    location: "KR Puram",
    description: "Stolen two-wheeler recovered from Hoskote checkpoint.",
    timestamp: "6h ago",
  },
  {
    id: "a5",
    severity: "elevated",
    title: "Repeat Offender Flag",
    location: "Cross-district",
    description: "Accused Ramesh K. now linked to 4 open FIRs across 2 sub-divisions.",
    timestamp: "9h ago",
  },
];

export const initialChat: ChatMessage[] = [
  {
    role: "agent",
    text: "Copilot ready. Ask a question about FIRs, accused, or patterns across districts.",
    timestamp: "09:12",
  },
  {
    role: "user",
    text: "Show all armed robbery cases in Whitefield in the last 30 days.",
    timestamp: "09:14",
  },
  {
    role: "agent",
    text: "Found 7 armed robbery FIRs in Whitefield PS jurisdiction (Jun 22 – Jul 20). 4 share MO (motorcycle-borne, 2 suspects). Suspected common accused: Ramesh K.",
    timestamp: "09:14",
    query: {
      tables: ["fir", "accused", "crime_type"],
      sql: `SELECT f.fir_no, f.registered_at, a.name
FROM fir f
JOIN crime_type c ON f.crime_type_id = c.id
LEFT JOIN accused a ON a.fir_no = f.fir_no
WHERE c.name = 'Armed Robbery'
  AND f.ps_jurisdiction = 'Whitefield'
  AND f.registered_at >= NOW() - INTERVAL '30 days'
ORDER BY f.registered_at DESC;`,
    },
  },
];
