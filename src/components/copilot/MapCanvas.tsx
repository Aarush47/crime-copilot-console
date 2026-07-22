import { useEffect, useRef } from "react";
import { cases } from "@/lib/mock-data";
import { useCopilot } from "@/lib/copilot-store";
import { Plus, Minus } from "lucide-react";

const sevColor: Record<string, string> = {
  low: "#4F9B90",
  elevated: "#E0924A",
  critical: "#C1584C",
};

// Dark map style tuned to match the console tokens.
const darkStyle: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0c1013" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0c1013" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5E6C73" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#293138" }] },
  { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#8A6C33" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#9DACB3" }] },
  { featureType: "administrative.neighborhood", elementType: "labels.text.fill", stylers: [{ color: "#5E6C73" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#181f24" }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#20272d" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#293138" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0a0d10" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4F9B90" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#12171b" }] },
];

let scriptPromise: Promise<void> | null = null;

function loadMapsScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).google?.maps) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
    if (!key) {
      reject(new Error("Google Maps browser key missing"));
      return;
    }
    (window as any).__kspInitMap = () => resolve();
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__kspInitMap${channel ? `&channel=${channel}` : ""}`;
    s.async = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

function markerIcon(color: string, active: boolean): google.maps.Symbol {
  return {
    path: (window as any).google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: active ? "#D9A441" : "#E9EEF0",
    strokeWeight: active ? 3 : 1.5,
    scale: active ? 10 : 8,
  };
}

export function MapCanvas() {
  const { selectedCase, selectCase } = useCopilot();
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const selectedIdRef = useRef<string | null>(null);

  // Init map once.
  useEffect(() => {
    let cancelled = false;
    loadMapsScript()
      .then(() => {
        if (cancelled || !mapDivRef.current || mapRef.current) return;
        const g = (window as any).google;
        const map = new g.maps.Map(mapDivRef.current, {
          center: { lat: 12.9716, lng: 77.6412 },
          zoom: 12,
          disableDefaultUI: true,
          gestureHandling: "greedy",
          backgroundColor: "#0c1013",
          styles: darkStyle,
        });
        mapRef.current = map;

        cases.forEach((c) => {
          const marker = new g.maps.Marker({
            position: { lat: c.lat, lng: c.lng },
            map,
            icon: markerIcon(sevColor[c.severity], false),
            title: `${c.id} · ${c.district}`,
            optimized: false,
          });
          marker.addListener("click", () => selectCase(c));
          markersRef.current.set(c.id, marker);
        });
      })
      .catch((err) => console.error("Maps load failed:", err));
    return () => {
      cancelled = true;
    };
  }, [selectCase]);

  // Reflect selection in marker styling + recenter.
  useEffect(() => {
    const prev = selectedIdRef.current;
    if (prev && prev !== selectedCase?.id) {
      const m = markersRef.current.get(prev);
      const prevCase = cases.find((c) => c.id === prev);
      if (m && prevCase) m.setIcon(markerIcon(sevColor[prevCase.severity], false));
    }
    if (selectedCase) {
      const m = markersRef.current.get(selectedCase.id);
      if (m) m.setIcon(markerIcon(sevColor[selectedCase.severity], true));
      if (mapRef.current) {
        mapRef.current.panTo({ lat: selectedCase.lat, lng: selectedCase.lng });
      }
    }
    selectedIdRef.current = selectedCase?.id ?? null;
  }, [selectedCase]);

  const zoom = (delta: number) => {
    const m = mapRef.current;
    if (!m) return;
    m.setZoom((m.getZoom() ?? 12) + delta);
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-[var(--color-bg-0)]">
      <div ref={mapDivRef} className="absolute inset-0" />

      {/* subtle vignette + amber wash to keep the console mood */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(217,164,65,0.04), transparent 55%), linear-gradient(to bottom, rgba(12,16,19,0.35), transparent 20%, transparent 80%, rgba(12,16,19,0.5))",
        }}
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-20 panel-float px-3 py-2.5 z-10">
        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-lo)] mb-1.5">
          Severity
        </div>
        <div className="flex flex-col gap-1 text-[11px]">
          {[
            ["Critical", "#C1584C"],
            ["Elevated", "#E0924A"],
            ["Low", "#4F9B90"],
          ].map(([l, c]) => (
            <div key={l} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c }} />
              <span className="text-[var(--color-text-mid)]">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Attribution / region badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 panel-float px-3 py-1.5 z-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-mid)]">
          Bengaluru City · Karnataka · IN
        </div>
      </div>

      {/* Zoom */}
      <div className="absolute bottom-4 right-4 panel-float flex flex-col z-10">
        <button
          onClick={() => zoom(1)}
          className="h-8 w-8 flex items-center justify-center text-[var(--color-text-mid)] hover:text-[var(--color-amber)] border-b border-[var(--color-border-soft)]"
        >
          <Plus size={14} />
        </button>
        <button
          onClick={() => zoom(-1)}
          className="h-8 w-8 flex items-center justify-center text-[var(--color-text-mid)] hover:text-[var(--color-amber)]"
        >
          <Minus size={14} />
        </button>
      </div>
    </div>
  );
}
