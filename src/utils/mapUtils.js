/**
 * Map Utilities
 * =============
 * Pure helper functions for coordinate handling and distance
 * calculations used across map components.
 *
 * These utilities have ZERO external dependencies — they work
 * whether or not mapbox-gl is installed.
 */

/**
 * Validate that a latitude / longitude pair is usable.
 *
 * @param {number|undefined} lat
 * @param {number|undefined} lng
 * @returns {boolean}
 */
export const isValidCoordinate = (lat, lng) => {
  if (lat === undefined || lat === null || lng === undefined || lng === null) return false;
  if (typeof lat !== "number" || typeof lng !== "number") return false;
  if (Number.isNaN(lat) || Number.isNaN(lng)) return false;
  if (lat < -90 || lat > 90) return false;
  if (lng < -180 || lng > 180) return false;
  // Reject the default (0, 0) that the User model uses
  if (lat === 0 && lng === 0) return false;
  return true;
};

/**
 * Convert a Hospital document (from the backend) into the
 * { longitude, latitude } shape that react-map-gl expects.
 *
 * Returns `null` when the hospital has no valid coordinates.
 *
 * @param {{ location?: { latitude: number, longitude: number }, name: string }} hospital
 * @returns {{ longitude: number, latitude: number, name: string, id: string } | null}
 */
export const hospitalToMapPoint = (hospital) => {
  if (!hospital) return null;

  const lat = hospital.location?.latitude;
  const lng = hospital.location?.longitude;

  if (!isValidCoordinate(lat, lng)) return null;

  return {
    id: hospital._id || hospital.id,
    name: hospital.name || "Unknown Hospital",
    latitude: lat,
    longitude: lng,
    address: hospital.address || "",
    isOnline: hospital.isOnline ?? true,
    availableBeds: hospital.availableBeds ?? 0,
    totalBeds: hospital.totalBeds ?? 0,
    availableAmbulances: hospital.availableAmbulances ?? 0,
  };
};

/**
 * Convert an array of hospital documents into map-ready points,
 * filtering out any that lack valid coordinates.
 *
 * @param {Array} hospitals
 * @returns {Array}
 */
export const hospitalsToMapPoints = (hospitals = []) => {
  return hospitals.map(hospitalToMapPoint).filter(Boolean);
};

/**
 * Calculate the Haversine distance (in km) between two points.
 * This is the same formula already present in the backend
 * (`backend/utils/distance.js`) — duplicated here so the frontend
 * can compute distances without a network call.
 *
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} distance in kilometres
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Compute a bounding box that contains all the given points,
 * useful for fitting the map viewport to show all hospitals.
 *
 * @param {Array<{ latitude: number, longitude: number }>} points
 * @returns {[[number, number], [number, number]]} [[swLng, swLat], [neLng, neLat]]
 */
export const getBounds = (points = []) => {
  if (points.length === 0) return null;

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  for (const p of points) {
    if (p.latitude < minLat) minLat = p.latitude;
    if (p.latitude > maxLat) maxLat = p.latitude;
    if (p.longitude < minLng) minLng = p.longitude;
    if (p.longitude > maxLng) maxLng = p.longitude;
  }

  // Add a small padding so markers aren't right at the edge
  const PAD = 0.02;
  return [
    [minLng - PAD, minLat - PAD], // south-west
    [maxLng + PAD, maxLat + PAD], // north-east
  ];
};
