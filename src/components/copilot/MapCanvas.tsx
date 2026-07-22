import { useEffect, useRef } from "react";
import { cases } from "@/lib/mock-data";
import { useCopilot } from "@/lib/copilot-store";
import { Plus, Minus } from "lucide-react";
import "leaflet/dist/leaflet.css";

// We import types statically, but load the leaflet JS module dynamically to avoid SSR "window is not defined" errors.
import type L from "leaflet";

const sevColor: Record<string, string> = {
  low: "#4F9B90",
  elevated: "#E0924A",
  critical: "#C1584C",
};

export function MapCanvas() {
  const { selectedCase, selectCase } = useCopilot();
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const selectedIdRef = useRef<string | null>(null);

  // Init map once.
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;

    let map: L.Map | null = null;

    // Dynamically import Leaflet on the client
    import("leaflet").then((leaflet) => {
      const L = leaflet.default || leaflet;

      if (!mapDivRef.current) return;

      map = L.map(mapDivRef.current, {
        center: [12.9716, 77.6412],
        zoom: 12,
        zoomControl: false,
        attributionControl: false, // Hidden to match original console UI
      });

      // Dark Matter tiles by CartoDB (matches the dark console theme nicely)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);

      mapRef.current = map;

      const getMarkerOptions = (color: string, active: boolean): L.CircleMarkerOptions => ({
        radius: active ? 10 : 8,
        fillColor: color,
        color: active ? "#D9A441" : "#E9EEF0",
        weight: active ? 3 : 1.5,
        opacity: 1,
        fillOpacity: 1,
      });

      cases.forEach((c) => {
        const marker = L.circleMarker(
          [c.lat, c.lng],
          getMarkerOptions(sevColor[c.severity], false),
        ).addTo(map!);

        marker.on("click", () => selectCase(c));
        markersRef.current.set(c.id, marker);
      });

      if (selectedCase) {
        const m = markersRef.current.get(selectedCase.id);
        if (m) m.setStyle(getMarkerOptions(sevColor[selectedCase.severity], true));
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

  // Reflect selection in marker styling + recenter.
  useEffect(() => {
    // Prevent errors if Leaflet hasn't finished loading yet
    if (!mapRef.current) return;

    // Helper for marker styles
    const getMarkerOpts = (color: string, active: boolean): L.CircleMarkerOptions => ({
      radius: active ? 10 : 8,
      fillColor: color,
      color: active ? "#D9A441" : "#E9EEF0",
      weight: active ? 3 : 1.5,
      opacity: 1,
      fillOpacity: 1,
    });

    const prev = selectedIdRef.current;
    if (prev && prev !== selectedCase?.id) {
      const m = markersRef.current.get(prev);
      const prevCase = cases.find((c) => c.id === prev);
      if (m && prevCase) m.setStyle(getMarkerOpts(sevColor[prevCase.severity], false));
    }
    if (selectedCase) {
      const m = markersRef.current.get(selectedCase.id);
      if (m) m.setStyle(getMarkerOpts(sevColor[selectedCase.severity], true));
      if (mapRef.current) {
        mapRef.current.panTo([selectedCase.lat, selectedCase.lng], { animate: true });
      }
    }
    selectedIdRef.current = selectedCase?.id ?? null;
  }, [selectedCase]);

  const zoom = (delta: number) => {
    const m = mapRef.current;
    if (!m) return;
    m.setZoom(m.getZoom() + delta);
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-[var(--color-bg-0)]">
      <div
        ref={mapDivRef}
        className="absolute inset-0 z-0"
        role="application"
        aria-label="Interactive Crime Map showing case locations"
        tabIndex={0}
      />

      {/* subtle vignette + amber wash to keep the console mood */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
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
