import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { _ as FileDown, a as Send, c as Plus, d as Mic, f as MessageSquare, g as FileText, h as GitBranch, i as Shield, l as Network, m as Image, n as Terminal, o as Search, p as LayoutDashboard, r as SlidersHorizontal, s as ScrollText, t as X, u as Minus, v as ChevronRight } from "../_libs/lucide-react.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-kQpGPbAI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var useCopilot = create((set) => ({
	activeTab: "overview",
	selectedCase: null,
	language: "en",
	filters: {
		crimeTypes: [],
		status: []
	},
	setActiveTab: (t) => set({ activeTab: t }),
	selectCase: (c) => set({ selectedCase: c }),
	setLanguage: (l) => set({ language: l }),
	toggleCrimeType: (t) => set((s) => ({ filters: {
		...s.filters,
		crimeTypes: s.filters.crimeTypes.includes(t) ? s.filters.crimeTypes.filter((x) => x !== t) : [...s.filters.crimeTypes, t]
	} })),
	toggleStatus: (st) => set((s) => ({ filters: {
		...s.filters,
		status: s.filters.status.includes(st) ? s.filters.status.filter((x) => x !== st) : [...s.filters.status, st]
	} })),
	openChatForCase: (c) => set({
		selectedCase: c,
		activeTab: "chat"
	})
}));
var items = [
	{
		id: "overview",
		icon: LayoutDashboard,
		label: "Overview"
	},
	{
		id: "chat",
		icon: MessageSquare,
		label: "Copilot Chat"
	},
	{
		id: "filters",
		icon: SlidersHorizontal,
		label: "Filters"
	},
	{
		id: "network",
		icon: Network,
		label: "Network Graph"
	},
	{
		id: "audit",
		icon: ScrollText,
		label: "Audit Log"
	},
	{
		id: "export",
		icon: FileDown,
		label: "Export & Reports"
	}
];
function IconRail() {
	const { activeTab, setActiveTab } = useCopilot();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed left-0 top-0 bottom-0 w-14 bg-[var(--color-bg-1)] border-r border-[var(--color-border-default)] z-30 flex flex-col items-center py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-md bg-[var(--color-bg-3)] border border-[var(--color-amber-dim)] flex items-center justify-center mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
				size: 16,
				className: "text-[var(--color-amber)]"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-1 flex-1",
			children: items.map((it) => {
				const Icon = it.icon;
				const active = activeTab === it.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveTab(it.id),
					className: "relative h-10 w-10 rounded-md flex items-center justify-center group",
					style: { backgroundColor: active ? "var(--color-bg-3)" : "transparent" },
					children: [
						active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r bg-[var(--color-amber)]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							size: 17,
							style: { color: active ? "var(--color-amber)" : "var(--color-text-mid)" }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute left-12 whitespace-nowrap px-2 py-1 rounded bg-[var(--color-bg-3)] border border-[var(--color-border-default)] text-[11px] text-[var(--color-text-hi)] opacity-0 group-hover:opacity-100 pointer-events-none font-mono uppercase tracking-wide",
							children: it.label
						})
					]
				}, it.id);
			})
		})]
	});
}
function TopBar() {
	const { language, setLanguage } = useCopilot();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed top-3 left-[68px] right-3 z-20 flex items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel-float px-3 py-2 flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-7 w-7 rounded bg-[var(--color-bg-3)] border border-[var(--color-amber-dim)] flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[11px] font-semibold text-[var(--color-amber)]",
						children: "KSP"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "leading-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[13px] font-semibold text-[var(--color-text-hi)]",
						children: "Crime Copilot"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--color-text-lo)]",
						children: "Investigator Console · v0.4"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel-float flex-1 flex items-center gap-2 px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						size: 14,
						className: "text-[var(--color-text-lo)]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "flex-1 bg-transparent outline-none text-[13px] placeholder:text-[var(--color-text-lo)] text-[var(--color-text-hi)]",
						placeholder: "Search FIR number, accused name, or ask a question…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden md:inline font-mono text-[10px] text-[var(--color-text-lo)] border border-[var(--color-border-default)] rounded px-1.5 py-0.5",
						children: "⌘K"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel-float px-2 py-1.5 flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setLanguage("en"),
					className: "px-2 py-1 rounded font-mono text-[11px] uppercase",
					style: {
						backgroundColor: language === "en" ? "var(--color-bg-3)" : "transparent",
						color: language === "en" ? "var(--color-amber)" : "var(--color-text-mid)"
					},
					children: "EN"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setLanguage("kn"),
					className: "px-2 py-1 rounded text-[11px]",
					style: {
						backgroundColor: language === "kn" ? "var(--color-bg-3)" : "transparent",
						color: language === "kn" ? "var(--color-amber)" : "var(--color-text-mid)"
					},
					children: "ಕನ್ನಡ"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel-float px-3 py-2 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-6 w-6 rounded-full bg-[var(--color-bg-3)] border border-[var(--color-border-default)] flex items-center justify-center font-mono text-[10px] text-[var(--color-amber)]",
					children: "IK"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "leading-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[12px] text-[var(--color-text-hi)]",
						children: "Insp. Kulkarni"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[9px] uppercase tracking-wider text-[var(--color-text-lo)]",
						children: "Investigator · Whitefield PS"
					})]
				})]
			})
		]
	});
}
var cases = [
	{
		id: "WF-0221",
		district: "Whitefield",
		position: {
			top: "38%",
			left: "62%"
		},
		lat: 12.9698,
		lng: 77.7499,
		severity: "critical",
		caseCount: 7,
		crimeType: "Armed Robbery",
		unit: "Whitefield PS",
		status: "Under Investigation",
		registeredDate: "2026-07-18",
		accused: "Ramesh K. (linked to 3 other cases)",
		briefFacts: "Armed robbery at commercial premises on ITPL Main Rd. Two suspects on motorcycle, modus operandi matches recent cluster in Marathahalli."
	},
	{
		id: "IN-0187",
		district: "Indiranagar",
		position: {
			top: "48%",
			left: "44%"
		},
		lat: 12.9784,
		lng: 77.6408,
		severity: "elevated",
		caseCount: 4,
		crimeType: "Cybercrime",
		unit: "Indiranagar CEN",
		status: "Under Investigation",
		registeredDate: "2026-07-15",
		accused: "Unknown (IP traced to Bengaluru East)",
		briefFacts: "UPI phishing fraud, INR 4.2L. Complainant received fake KYC message. Mule account cluster identified."
	},
	{
		id: "KM-0342",
		district: "Koramangala",
		position: {
			top: "62%",
			left: "40%"
		},
		lat: 12.9352,
		lng: 77.6245,
		severity: "elevated",
		caseCount: 5,
		crimeType: "Chain Snatching",
		unit: "Koramangala PS",
		status: "Under Investigation",
		registeredDate: "2026-07-19",
		accused: "Two unidentified males on Pulsar 150",
		briefFacts: "Chain snatching incidents reported near 5th Block. CCTV pattern consistent across three complaints in past 10 days."
	},
	{
		id: "KR-0098",
		district: "KR Puram",
		position: {
			top: "30%",
			left: "70%"
		},
		lat: 13.0075,
		lng: 77.6961,
		severity: "low",
		caseCount: 2,
		crimeType: "Vehicle Theft",
		unit: "KR Puram PS",
		status: "Chargesheeted",
		registeredDate: "2026-07-02",
		accused: "Suresh D.",
		briefFacts: "Two-wheeler theft near KR Puram railway station. Recovered from Hoskote. Accused chargesheeted."
	},
	{
		id: "MA-0411",
		district: "Marathahalli",
		position: {
			top: "44%",
			left: "58%"
		},
		lat: 12.9591,
		lng: 77.6974,
		severity: "critical",
		caseCount: 6,
		crimeType: "Burglary",
		unit: "Marathahalli PS",
		status: "Under Investigation",
		registeredDate: "2026-07-20",
		accused: "Ramesh K. (suspected)",
		briefFacts: "Night-time house burglary. Entry via balcony. Fingerprint match with Whitefield cluster. Cross-district pattern."
	},
	{
		id: "IN-0192",
		district: "Indiranagar",
		position: {
			top: "54%",
			left: "48%"
		},
		lat: 12.9719,
		lng: 77.6412,
		severity: "low",
		caseCount: 1,
		crimeType: "Theft",
		unit: "Indiranagar PS",
		status: "Closed",
		registeredDate: "2026-06-28",
		accused: "Recovered — accused absconding",
		briefFacts: "Mobile theft at 100ft Road. Device recovered, case closed pending arrest."
	}
];
var alerts = [
	{
		id: "a1",
		severity: "critical",
		title: "Armed Robbery Cluster",
		location: "Whitefield / Marathahalli",
		description: "6 incidents in 14 days with matching MO. Same accused suspected across jurisdictions.",
		timestamp: "12m ago"
	},
	{
		id: "a2",
		severity: "elevated",
		title: "UPI Phishing Spike",
		location: "Indiranagar sub-division",
		description: "42% increase in cyber fraud complaints this week. Mule accounts identified.",
		timestamp: "1h ago"
	},
	{
		id: "a3",
		severity: "warning",
		title: "Chain Snatching Pattern",
		location: "Koramangala 5th Block",
		description: "Three complaints in 10 days, CCTV shows same suspect vehicle.",
		timestamp: "3h ago"
	},
	{
		id: "a4",
		severity: "low",
		title: "Vehicle Recovery",
		location: "KR Puram",
		description: "Stolen two-wheeler recovered from Hoskote checkpoint.",
		timestamp: "6h ago"
	},
	{
		id: "a5",
		severity: "elevated",
		title: "Repeat Offender Flag",
		location: "Cross-district",
		description: "Accused Ramesh K. now linked to 4 open FIRs across 2 sub-divisions.",
		timestamp: "9h ago"
	}
];
var initialChat = [
	{
		role: "agent",
		text: "Copilot ready. Ask a question about FIRs, accused, or patterns across districts.",
		timestamp: "09:12"
	},
	{
		role: "user",
		text: "Show all armed robbery cases in Whitefield in the last 30 days.",
		timestamp: "09:14"
	},
	{
		role: "agent",
		text: "Found 7 armed robbery FIRs in Whitefield PS jurisdiction (Jun 22 – Jul 20). 4 share MO (motorcycle-borne, 2 suspects). Suspected common accused: Ramesh K.",
		timestamp: "09:14",
		query: {
			tables: [
				"fir",
				"accused",
				"crime_type"
			],
			sql: `SELECT f.fir_no, f.registered_at, a.name
FROM fir f
JOIN crime_type c ON f.crime_type_id = c.id
LEFT JOIN accused a ON a.fir_no = f.fir_no
WHERE c.name = 'Armed Robbery'
  AND f.ps_jurisdiction = 'Whitefield'
  AND f.registered_at >= NOW() - INTERVAL '30 days'
ORDER BY f.registered_at DESC;`
		}
	}
];
var sevColor$1 = {
	low: "#4F9B90",
	elevated: "#E0924A",
	critical: "#C1584C"
};
function MapCanvas() {
	const { selectedCase, selectCase } = useCopilot();
	const mapDivRef = (0, import_react.useRef)(null);
	const mapRef = (0, import_react.useRef)(null);
	const markersRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const selectedIdRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!mapDivRef.current || mapRef.current) return;
		let map = null;
		import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t())).then((leaflet) => {
			const L = leaflet.default || leaflet;
			if (!mapDivRef.current) return;
			map = L.map(mapDivRef.current, {
				center: [12.9716, 77.6412],
				zoom: 12,
				zoomControl: false,
				attributionControl: false
			});
			L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
				subdomains: "abcd",
				maxZoom: 20
			}).addTo(map);
			mapRef.current = map;
			const getMarkerOptions = (color, active) => ({
				radius: active ? 10 : 8,
				fillColor: color,
				color: active ? "#D9A441" : "#E9EEF0",
				weight: active ? 3 : 1.5,
				opacity: 1,
				fillOpacity: 1
			});
			cases.forEach((c) => {
				const marker = L.circleMarker([c.lat, c.lng], getMarkerOptions(sevColor$1[c.severity], false)).addTo(map);
				marker.on("click", () => selectCase(c));
				markersRef.current.set(c.id, marker);
			});
			if (selectedCase) {
				const m = markersRef.current.get(selectedCase.id);
				if (m) m.setStyle(getMarkerOptions(sevColor$1[selectedCase.severity], true));
				map.panTo([selectedCase.lat, selectedCase.lng], { animate: false });
			}
		});
		return () => {
			if (map) {
				map.remove();
				mapRef.current = null;
			}
		};
	}, [selectCase]);
	(0, import_react.useEffect)(() => {
		if (!mapRef.current) return;
		const getMarkerOpts = (color, active) => ({
			radius: active ? 10 : 8,
			fillColor: color,
			color: active ? "#D9A441" : "#E9EEF0",
			weight: active ? 3 : 1.5,
			opacity: 1,
			fillOpacity: 1
		});
		const prev = selectedIdRef.current;
		if (prev && prev !== selectedCase?.id) {
			const m = markersRef.current.get(prev);
			const prevCase = cases.find((c) => c.id === prev);
			if (m && prevCase) m.setStyle(getMarkerOpts(sevColor$1[prevCase.severity], false));
		}
		if (selectedCase) {
			const m = markersRef.current.get(selectedCase.id);
			if (m) m.setStyle(getMarkerOpts(sevColor$1[selectedCase.severity], true));
			if (mapRef.current) mapRef.current.panTo([selectedCase.lat, selectedCase.lng], { animate: true });
		}
		selectedIdRef.current = selectedCase?.id ?? null;
	}, [selectedCase]);
	const zoom = (delta) => {
		const m = mapRef.current;
		if (!m) return;
		m.setZoom(m.getZoom() + delta);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 overflow-hidden bg-[var(--color-bg-0)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: mapDivRef,
				className: "absolute inset-0 z-0",
				role: "application",
				"aria-label": "Interactive Crime Map showing case locations",
				tabIndex: 0
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 pointer-events-none z-[1]",
				style: { background: "radial-gradient(ellipse at 50% 50%, rgba(217,164,65,0.04), transparent 55%), linear-gradient(to bottom, rgba(12,16,19,0.35), transparent 20%, transparent 80%, rgba(12,16,19,0.5))" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-4 left-20 panel-float px-3 py-2.5 z-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-lo)] mb-1.5",
					children: "Severity"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-1 text-[11px]",
					children: [
						["Critical", "#C1584C"],
						["Elevated", "#E0924A"],
						["Low", "#4F9B90"]
					].map(([l, c]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-2 w-2 rounded-full",
							style: { backgroundColor: c }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[var(--color-text-mid)]",
							children: l
						})]
					}, l))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-4 left-1/2 -translate-x-1/2 panel-float px-3 py-1.5 z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-mid)]",
					children: "Bengaluru City · Karnataka · IN"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-4 right-4 panel-float flex flex-col z-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => zoom(1),
					className: "h-8 w-8 flex items-center justify-center text-[var(--color-text-mid)] hover:text-[var(--color-amber)] border-b border-[var(--color-border-soft)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 14 })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => zoom(-1),
					className: "h-8 w-8 flex items-center justify-center text-[var(--color-text-mid)] hover:text-[var(--color-amber)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { size: 14 })
				})]
			})
		]
	});
}
var sevPill = {
	low: {
		bg: "rgba(79,155,144,0.15)",
		fg: "var(--color-teal)"
	},
	warning: {
		bg: "rgba(217,164,65,0.15)",
		fg: "var(--color-amber)"
	},
	elevated: {
		bg: "rgba(224,146,74,0.15)",
		fg: "var(--color-orange-el)"
	},
	critical: {
		bg: "rgba(193,88,76,0.18)",
		fg: "var(--color-red-crit)"
	}
};
function LeftPanel() {
	const { activeTab } = useCopilot();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed left-[68px] top-20 bottom-3 w-[380px] z-20 panel-float flex flex-col overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4 py-3 border-b border-[var(--color-border-soft)] flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-lo)]",
				children: tabLabel[activeTab]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "font-mono text-[9px] text-[var(--color-teal)] flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-[var(--color-teal)] animate-pulse" }), "LIVE"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-hidden",
			children: [
				activeTab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overview, {}),
				activeTab === "chat" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chat, {}),
				activeTab === "filters" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filters, {}),
				activeTab === "network" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetworkGraph, {}),
				activeTab === "audit" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuditLog, {}),
				activeTab === "export" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportReports, {})
			]
		})]
	});
}
var tabLabel = {
	overview: "Overview",
	chat: "Copilot Chat",
	filters: "Filters",
	network: "Network Graph",
	audit: "Audit Log",
	export: "Export & Reports"
};
function Overview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "h-full overflow-y-auto scrollbar-thin p-4 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-2.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Active Investigations",
					value: "147"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Critical Cases",
					value: "12",
					trend: "↑ 2 in 24h",
					tone: "red"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "FIRs · 30d",
					value: "418"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Avg Risk Score",
					value: "6.4",
					trend: "predictive index",
					tone: "amber"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-lo)]",
				children: "Recent Alerts"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "font-mono text-[10px] text-[var(--color-amber)] hover:underline",
				children: "VIEW ALL"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: alerts.map((a) => {
				const s = sevPill[a.severity];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-soft)] p-3 hover:border-[var(--color-amber-dim)] transition-colors cursor-pointer",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[9.5px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider",
								style: {
									backgroundColor: s.bg,
									color: s.fg
								},
								children: a.severity
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] text-[var(--color-text-lo)]",
								children: a.timestamp
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12.5px] font-semibold text-[var(--color-text-hi)] mb-0.5",
							children: a.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 text-[11px] text-[var(--color-text-mid)] mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1 w-1 rounded-full bg-[var(--color-text-lo)]" }), a.location]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11.5px] text-[var(--color-text-mid)] leading-snug",
							children: a.description
						})
					]
				}, a.id);
			})
		})] })]
	});
}
function Stat({ label, value, trend, tone }) {
	const color = tone === "red" ? "var(--color-red-crit)" : tone === "amber" ? "var(--color-amber)" : "var(--color-text-hi)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-soft)] p-2.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-mono text-[9.5px] uppercase tracking-wider text-[var(--color-text-lo)] mb-1",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-mono text-[22px] font-semibold leading-none",
				style: { color },
				children: value
			}),
			trend && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 font-mono text-[10px]",
				style: { color },
				children: trend
			})
		]
	});
}
function Chat() {
	const { selectedCase, language } = useCopilot();
	const [messages, setMessages] = (0, import_react.useState)(initialChat);
	const [input, setInput] = (0, import_react.useState)("");
	const [openQuery, setOpenQuery] = (0, import_react.useState)(1);
	const send = (text) => {
		if (!text.trim()) return;
		const now = (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit"
		});
		const userMsg = {
			role: "user",
			text,
			timestamp: now
		};
		const agentMsg = {
			role: "agent",
			text: `Running query across FIR + accused tables… 4 matching records. Common thread: two-wheeler-borne suspects, ITPL corridor.`,
			timestamp: now,
			query: {
				tables: [
					"fir",
					"accused",
					"location"
				],
				sql: `SELECT f.fir_no, f.registered_at, l.district, a.name
FROM fir f
JOIN location l ON l.id = f.location_id
LEFT JOIN accused a ON a.fir_no = f.fir_no
WHERE l.district = 'Whitefield'
  AND f.crime_type = 'Robbery'
ORDER BY f.registered_at DESC
LIMIT 20;`
			}
		};
		setMessages((m) => [
			...m,
			userMsg,
			agentMsg
		]);
		setInput("");
	};
	const suggestion = selectedCase ? `Ask about ${selectedCase.id}` : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "h-full flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3",
			children: messages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `flex ${m.role === "user" ? "justify-end" : "justify-start"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-[85%]",
					children: [
						m.role === "agent" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-[var(--color-amber)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[9.5px] uppercase tracking-wider text-[var(--color-text-lo)]",
								children: ["Copilot · ", m.timestamp]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-md px-3 py-2 text-[12.5px] leading-relaxed",
							style: {
								backgroundColor: m.role === "user" ? "var(--color-bg-3)" : "var(--color-bg-1)",
								border: "1px solid var(--color-border-soft)",
								color: "var(--color-text-hi)"
							},
							children: m.text
						}),
						m.query && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setOpenQuery(openQuery === i ? null : i),
								className: "flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-amber)] border border-[var(--color-amber-dim)] rounded px-2 py-1 hover:bg-[rgba(217,164,65,0.08)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
										size: 11,
										className: "transition-transform",
										style: { transform: openQuery === i ? "rotate(90deg)" : "none" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { size: 11 }),
									openQuery === i ? "Hide query" : "Show query"
								]
							}), openQuery === i && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1.5 rounded bg-[#08.0b.0e] border-l-2 border-[var(--color-amber)] overflow-hidden",
								style: { backgroundColor: "#080b0e" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "px-2.5 py-1 border-b border-[var(--color-border-soft)] flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[9.5px] uppercase tracking-wider text-[var(--color-text-lo)]",
										children: "Tables:"
									}), m.query.tables.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[10px] text-[var(--color-amber)]",
										children: t
									}, t))]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "p-2.5 font-mono text-[11px] text-[var(--color-text-hi)] whitespace-pre-wrap overflow-x-auto",
									children: m.query.sql
								})]
							})]
						})
					]
				})
			}, i))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-[var(--color-border-soft)] p-3",
			children: [suggestion && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => send(`Tell me everything about case ${selectedCase.id}`),
				className: "mb-2 flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-amber)] border border-[var(--color-amber-dim)] rounded px-2 py-1 hover:bg-[rgba(217,164,65,0.08)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-[var(--color-amber)]" }), suggestion]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					send(input);
				},
				className: "flex items-center gap-2 rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-default)] px-2 py-1.5 focus-within:border-[var(--color-amber-dim)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: input,
						onChange: (e) => setInput(e.target.value),
						placeholder: language === "kn" ? "ಒಂದು ಪ್ರಶ್ನೆ ಕೇಳಿ…" : "Ask about FIRs, accused, patterns…",
						className: "flex-1 bg-transparent outline-none text-[12.5px] placeholder:text-[var(--color-text-lo)]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-7 w-7 rounded flex items-center justify-center text-[var(--color-text-mid)] hover:text-[var(--color-amber)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { size: 13 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "h-7 w-7 rounded flex items-center justify-center bg-[var(--color-amber)] text-[#0c1013] hover:brightness-110",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { size: 13 })
					})
				]
			})]
		})]
	});
}
function Filters() {
	const { filters, toggleCrimeType, toggleStatus } = useCopilot();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "h-full flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-y-auto scrollbar-thin p-4 space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					label: "Crime Type",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: [
							"Robbery",
							"Theft",
							"Burglary",
							"Cybercrime",
							"Assault",
							"Missing Person"
						].map((c) => {
							const active = filters.crimeTypes.includes(c);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toggleCrimeType(c),
								className: "px-2.5 py-1 rounded text-[11.5px] transition-colors border",
								style: {
									backgroundColor: active ? "var(--color-amber)" : "var(--color-bg-2)",
									color: active ? "#0c1013" : "var(--color-text-mid)",
									borderColor: active ? "var(--color-amber)" : "var(--color-border-default)",
									fontWeight: active ? 600 : 400
								},
								children: c
							}, c);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					label: "District / Sub-division",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "w-full rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-default)] px-2.5 py-2 text-[12.5px] text-[var(--color-text-hi)] outline-none focus:border-[var(--color-amber-dim)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "All districts" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Whitefield" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Indiranagar" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Koramangala" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "KR Puram" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Marathahalli" })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					label: "Date Range",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							className: "rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-default)] px-2.5 py-2 text-[12px] font-mono text-[var(--color-text-hi)] outline-none focus:border-[var(--color-amber-dim)]",
							defaultValue: "2026-06-22"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							className: "rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-default)] px-2.5 py-2 text-[12px] font-mono text-[var(--color-text-hi)] outline-none focus:border-[var(--color-amber-dim)]",
							defaultValue: "2026-07-22"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					label: "Case Status",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: [
							"Under Investigation",
							"Chargesheeted",
							"Closed"
						].map((s) => {
							const active = filters.status.includes(s);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toggleStatus(s),
								className: "px-2.5 py-1 rounded text-[11.5px] transition-colors border",
								style: {
									backgroundColor: active ? "var(--color-amber)" : "var(--color-bg-2)",
									color: active ? "#0c1013" : "var(--color-text-mid)",
									borderColor: active ? "var(--color-amber)" : "var(--color-border-default)",
									fontWeight: active ? 600 : 400
								},
								children: s
							}, s);
						})
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-3 border-t border-[var(--color-border-soft)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "w-full rounded-md bg-[var(--color-amber)] text-[#0c1013] font-semibold text-[12.5px] py-2.5 hover:brightness-110",
				children: "Apply Filters"
			})
		})]
	});
}
function Section({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-lo)] mb-2",
		children: label
	}), children] });
}
function NetworkGraph() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-full overflow-hidden p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-soft)] h-full flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-3 py-2 border-b border-[var(--color-border-soft)] flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-mid)]",
						children: "Suspect Cluster · Ramesh K."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[10px] text-[var(--color-amber)]",
						children: "4 flagged links"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 340 380",
					className: "flex-1 w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "170",
							y1: "180",
							x2: "70",
							y2: "80",
							stroke: "var(--color-amber)",
							strokeWidth: "1.2",
							strokeDasharray: "4 3"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "170",
							y1: "180",
							x2: "280",
							y2: "90",
							stroke: "var(--color-amber)",
							strokeWidth: "1.2",
							strokeDasharray: "4 3"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "170",
							y1: "180",
							x2: "60",
							y2: "290",
							stroke: "var(--color-amber)",
							strokeWidth: "1.2",
							strokeDasharray: "4 3"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "170",
							y1: "180",
							x2: "280",
							y2: "290",
							stroke: "#4F9B90",
							strokeWidth: "1",
							opacity: "0.6"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "70",
							y1: "80",
							x2: "60",
							y2: "290",
							stroke: "#293138",
							strokeWidth: "1"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "280",
							y1: "90",
							x2: "280",
							y2: "290",
							stroke: "#293138",
							strokeWidth: "1"
						}),
						[
							[
								70,
								80,
								"V-441"
							],
							[
								280,
								90,
								"V-508"
							],
							[
								60,
								290,
								"V-522"
							],
							[
								280,
								290,
								"V-611"
							]
						].map(([x, y, id]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: x,
							cy: y,
							r: "14",
							fill: "var(--color-bg-3)",
							stroke: "#5E6C73",
							strokeWidth: "1.2"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x,
							y: y + 3,
							textAnchor: "middle",
							fontSize: "8",
							fill: "#9DACB3",
							fontFamily: "IBM Plex Mono",
							children: id
						})] }, id)),
						[
							[
								110,
								200,
								"WF-0221"
							],
							[
								230,
								200,
								"MA-0411"
							],
							[
								170,
								300,
								"IN-0187"
							]
						].map(([x, y, id]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: x,
							cy: y,
							r: "16",
							fill: "rgba(79,155,144,0.15)",
							stroke: "#4F9B90",
							strokeWidth: "1.4"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x,
							y: y + 3,
							textAnchor: "middle",
							fontSize: "8",
							fill: "#4F9B90",
							fontFamily: "IBM Plex Mono",
							fontWeight: "600",
							children: id
						})] }, id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "170",
							cy: "180",
							r: "24",
							fill: "rgba(193,88,76,0.15)",
							stroke: "#C1584C",
							strokeWidth: "1.8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: "170",
							y: "177",
							textAnchor: "middle",
							fontSize: "8",
							fill: "#9DACB3",
							fontFamily: "IBM Plex Mono",
							children: "ACCUSED"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: "170",
							y: "188",
							textAnchor: "middle",
							fontSize: "10",
							fill: "#E9EEF0",
							fontWeight: "600",
							fontFamily: "IBM Plex Sans",
							children: "Ramesh K."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-3 py-2 border-t border-[var(--color-border-soft)] flex items-center gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
							color: "#C1584C",
							label: "Accused"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
							color: "#4F9B90",
							label: "Cases"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
							color: "#5E6C73",
							label: "Victims"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
							color: "#D9A441",
							label: "Flagged",
							dashed: true
						})
					]
				})
			]
		})
	});
}
function LegendDot({ color, label, dashed }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1.5",
		children: [dashed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "h-0 w-3 border-t border-dashed",
			style: { borderColor: color }
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "h-2 w-2 rounded-full",
			style: { backgroundColor: color }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-[9.5px] uppercase tracking-wider text-[var(--color-text-mid)]",
			children: label
		})]
	});
}
function AuditLog() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-full overflow-y-auto scrollbar-thin p-4 space-y-3",
		children: [
			{
				q: "Show all armed robbery cases in Whitefield in the last 30 days.",
				tables: ["fir", "crime_type"],
				sql: `SELECT * FROM fir WHERE crime_type='Armed Robbery' AND ps='Whitefield' AND registered_at >= NOW()-INTERVAL '30 days';`,
				t: "09:14:22"
			},
			{
				q: "List accused linked to more than 2 open FIRs.",
				tables: ["accused", "fir"],
				sql: `SELECT a.name, COUNT(*) c FROM accused a JOIN fir f ON f.fir_no=a.fir_no WHERE f.status='Open' GROUP BY a.name HAVING COUNT(*)>2;`,
				t: "09:22:07"
			},
			{
				q: "Any pattern between Marathahalli and Whitefield burglaries?",
				tables: [
					"fir",
					"location",
					"modus_operandi"
				],
				sql: `SELECT f.fir_no, m.pattern FROM fir f JOIN modus_operandi m ON m.fir_no=f.fir_no WHERE f.district IN ('Whitefield','Marathahalli') AND f.crime_type='Burglary';`,
				t: "09:38:51"
			}
		].map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-soft)] overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-3 py-2 border-b border-[var(--color-border-soft)] flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-lo)]",
						children: ["Query ", String(i + 1).padStart(3, "0")]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] text-[var(--color-text-mid)]",
						children: e.t
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-3 py-2 text-[12px] text-[var(--color-text-hi)] italic",
					children: [
						"\"",
						e.q,
						"\""
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-l-2 border-[var(--color-amber)] mx-3 mb-3 rounded-r overflow-hidden",
					style: { backgroundColor: "#080b0e" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-2.5 py-1 flex items-center gap-2 border-b border-[var(--color-border-soft)]",
						children: e.tables.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[9.5px] text-[var(--color-amber)]",
							children: t
						}, t))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "p-2.5 font-mono text-[10.5px] text-[var(--color-text-hi)] whitespace-pre-wrap overflow-x-auto",
						children: e.sql
					})]
				})
			]
		}, i))
	});
}
function ExportReports() {
	const [toast, setToast] = (0, import_react.useState)(null);
	const cards = [
		{
			icon: FileText,
			title: "Conversation History",
			desc: "Export current chat as a signed PDF transcript."
		},
		{
			icon: FileDown,
			title: "Case Bundle",
			desc: "Compile the filtered case set into an investigation report."
		},
		{
			icon: Image,
			title: "Network Graph Snapshot",
			desc: "Export the current graph view as a high-resolution image."
		}
	];
	const trigger = (name) => {
		setToast(`✓ ${name} generated — ready to download`);
		setTimeout(() => setToast(null), 2400);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "h-full overflow-y-auto scrollbar-thin p-4 space-y-3 relative",
		children: [cards.map((c) => {
			const Icon = c.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md bg-[var(--color-bg-2)] border border-[var(--color-border-soft)] p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-8 w-8 rounded bg-[var(--color-bg-3)] border border-[var(--color-amber-dim)] flex items-center justify-center flex-shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							size: 14,
							className: "text-[var(--color-amber)]"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12.5px] font-semibold text-[var(--color-text-hi)]",
							children: c.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11.5px] text-[var(--color-text-mid)] mt-0.5 leading-snug",
							children: c.desc
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => trigger(c.title),
					className: "mt-3 w-full rounded bg-[var(--color-bg-3)] border border-[var(--color-border-default)] hover:border-[var(--color-amber-dim)] hover:text-[var(--color-amber)] text-[11.5px] font-mono uppercase tracking-wider text-[var(--color-text-mid)] py-1.5",
					children: "Export"
				})]
			}, c.title);
		}), toast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute bottom-3 left-3 right-3 rounded-md bg-[var(--color-bg-3)] border border-[var(--color-teal)] text-[var(--color-teal)] px-3 py-2 text-[12px] font-mono",
			children: toast
		})]
	});
}
var sevColor = {
	low: "var(--color-teal)",
	elevated: "var(--color-orange-el)",
	critical: "var(--color-red-crit)"
};
function CaseDrawer() {
	const { selectedCase, selectCase, openChatForCase } = useCopilot();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: selectedCase && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.aside, {
		initial: {
			x: 40,
			opacity: 0
		},
		animate: {
			x: 0,
			opacity: 1
		},
		exit: {
			x: 40,
			opacity: 0
		},
		transition: {
			duration: .22,
			ease: "easeOut"
		},
		className: "fixed right-3 top-20 bottom-3 w-[300px] z-20 panel-float flex flex-col overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between p-4 border-b border-[var(--color-border-soft)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-2 w-2 rounded-full",
							style: { backgroundColor: sevColor[selectedCase.severity] }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-lo)]",
							children: "Case"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-lg font-semibold text-[var(--color-amber)] mt-1",
						children: selectedCase.id
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-[var(--color-text-mid)] mt-0.5",
						children: selectedCase.status
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => selectCase(null),
					className: "h-7 w-7 rounded flex items-center justify-center text-[var(--color-text-mid)] hover:bg-[var(--color-bg-3)] hover:text-[var(--color-text-hi)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 14 })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Crime Type",
						value: selectedCase.crimeType
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "District / Unit",
						value: `${selectedCase.district} · ${selectedCase.unit}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Registered",
						value: selectedCase.registeredDate,
						mono: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Accused",
						value: selectedCase.accused,
						highlight: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-lo)] mb-1.5",
						children: "Brief Facts"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[12.5px] leading-relaxed text-[var(--color-text-hi)]",
						children: selectedCase.briefFacts
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3 border-t border-[var(--color-border-soft)] space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerBtn, {
						icon: GitBranch,
						label: "View in Network Graph"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerBtn, {
						icon: MessageSquare,
						label: `Ask Copilot about ${selectedCase.id}`,
						onClick: () => openChatForCase(selectedCase)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerBtn, {
						icon: FileDown,
						label: "Export Case Bundle",
						primary: true
					})
				]
			})
		]
	}) });
}
function Field({ label, value, mono, highlight }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-lo)] mb-1",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `text-[12.5px] ${mono ? "font-mono" : ""} ${highlight ? "text-[var(--color-amber)]" : "text-[var(--color-text-hi)]"}`,
		children: value
	})] });
}
function DrawerBtn({ icon: Icon, label, primary, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: "w-full flex items-center gap-2 px-3 py-2 rounded-md text-[12px] transition-colors",
		style: {
			backgroundColor: primary ? "var(--color-amber)" : "var(--color-bg-3)",
			color: primary ? "#0c1013" : "var(--color-text-hi)",
			border: primary ? "none" : "1px solid var(--color-border-default)",
			fontWeight: primary ? 600 : 500
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 13 }), label]
	});
}
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 overflow-hidden bg-[var(--color-bg-0)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapCanvas, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconRail, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeftPanel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaseDrawer, {})
		]
	});
}
//#endregion
export { Index as component };
