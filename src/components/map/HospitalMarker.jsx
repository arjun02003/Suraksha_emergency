/**
 * HospitalMarker
 * ==============
 * Renders a single hospital marker on a Mapbox map instance.
 *
 * This component uses the imperative mapbox-gl Marker API rather
 * than a React-map-gl declarative wrapper, keeping the dependency
 * footprint minimal.
 *
 * Usage:
 *   <MapContainer>
 *     {(map) => hospitals.map(h => (
 *       <HospitalMarker key={h.id} map={map} hospital={h} />
 *     ))}
 *   </MapContainer>
 */

import { useEffect, useRef } from "react";

/**
 * @param {Object} props
 * @param {Object} props.map        — mapbox-gl Map instance (passed by MapContainer)
 * @param {Object} props.hospital   — map-ready hospital point from `hospitalToMapPoint()`
 * @param {Function} [props.onClick] — called with the hospital when the marker is clicked
 */
export default function HospitalMarker({ map, hospital, onClick }) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || !hospital) return;

    const initMarker = async () => {
      try {
        const mapboxgl = await import("mapbox-gl");

        // ── Custom marker element ──────────────────────────────────
        const el = document.createElement("div");
        el.className = "suraksha-hospital-marker";
        el.style.cssText = `
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: ${hospital.isOnline ? "#10b981" : "#64748b"};
          border: 3px solid ${hospital.isOnline ? "#059669" : "#475569"};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: transform 0.2s;
        `;
        el.innerHTML = "🏥";
        el.title = hospital.name;

        // Hover effect
        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.2)";
        });
        el.addEventListener("mouseleave", () => {
          el.style.transform = "scale(1)";
        });

        // Click handler
        if (onClick) {
          el.addEventListener("click", () => onClick(hospital));
        }

        // ── Popup ──────────────────────────────────────────────────
        const popup = new mapboxgl.default.Popup({
          offset: 25,
          closeButton: false,
          maxWidth: "260px",
        }).setHTML(`
          <div style="font-family: system-ui, sans-serif; padding: 4px;">
            <p style="font-weight: 600; font-size: 14px; margin: 0 0 4px;">
              ${hospital.name}
            </p>
            ${hospital.address ? `<p style="color: #94a3b8; font-size: 12px; margin: 0 0 6px;">${hospital.address}</p>` : ""}
            <div style="display: flex; gap: 12px; font-size: 12px; color: #cbd5e1;">
              <span>🛏 ${hospital.availableBeds}/${hospital.totalBeds} beds</span>
              <span>🚑 ${hospital.availableAmbulances}</span>
            </div>
            <span style="
              display: inline-block;
              margin-top: 6px;
              padding: 2px 8px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 500;
              background: ${hospital.isOnline ? "rgba(16,185,129,0.15)" : "rgba(100,116,139,0.15)"};
              color: ${hospital.isOnline ? "#34d399" : "#94a3b8"};
            ">
              ${hospital.isOnline ? "● Online" : "● Offline"}
            </span>
          </div>
        `);

        // ── Marker ─────────────────────────────────────────────────
        const marker = new mapboxgl.default.Marker({ element: el })
          .setLngLat([hospital.longitude, hospital.latitude])
          .setPopup(popup)
          .addTo(map);

        markerRef.current = marker;
      } catch (err) {
        console.error("HospitalMarker: failed to create marker", err);
      }
    };

    initMarker();

    // Cleanup on unmount
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, hospital, onClick]);

  // This component is imperative — it renders nothing into the React tree.
  return null;
}
