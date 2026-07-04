/**
 * Mapbox Configuration
 * ====================
 * Centralized Mapbox config for the SURAKSHA frontend.
 *
 * The access token is read from the VITE_MAPBOX_ACCESS_TOKEN environment
 * variable.  All map components should import from this module rather than
 * reading the env var directly so there is a single place to update.
 *
 * HOW TO ADD YOUR TOKEN
 * ---------------------
 * 1.  Create a free Mapbox account at https://mapbox.com
 * 2.  Copy your Default Public Token from https://account.mapbox.com/access-tokens/
 * 3.  Open the file  /.env  in the project root (or create it from .env.example)
 * 4.  Set:  VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ij...your_token_here
 * 5.  Restart the Vite dev server (`npm run dev`)
 */

// ── Token ────────────────────────────────────────────────────────────────
export const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

/**
 * Returns `true` when a Mapbox token has been configured.
 * Map components should call this before attempting to render a map.
 */
export const isMapboxConfigured = () => {
  return MAPBOX_ACCESS_TOKEN.length > 0;
};

// ── Default map settings ─────────────────────────────────────────────────
export const MAPBOX_DEFAULTS = {
  /** Default map style — streets is the most practical for hospital/emergency use */
  style: "mapbox://styles/mapbox/streets-v12",

  /** Centre of India (good default when no specific location is known) */
  center: {
    longitude: 78.9629,
    latitude: 20.5937,
  },

  /** Country-level zoom */
  zoom: 4.5,

  /** City-level zoom — used when focusing on a single hospital */
  hospitalZoom: 14,

  /** Cluster radius for grouping nearby hospital markers */
  clusterRadius: 50,
};
