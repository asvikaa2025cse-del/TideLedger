export type GeoPoint = { lat: number; lng: number };

export function distanceBetween(a: GeoPoint, b: GeoPoint) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const hav =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(hav), Math.sqrt(1 - hav));
  return R * c;
}

export function pointInPolygon(point: GeoPoint, polygon: GeoPoint[]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat;
    const yi = polygon[i].lng;
    const xj = polygon[j].lat;
    const yj = polygon[j].lng;

    const intersect = yi > point.lng !== yj > point.lng &&
      point.lat < ((xj - xi) * (point.lng - yi)) / (yj - yi + Number.EPSILON) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
}

export function buildZoneLookup(zone: { name: string; polygon?: any }) {
  const polygon = zone.polygon as GeoPoint[] | undefined;
  return { name: zone.name, polygon: Array.isArray(polygon) ? polygon : [] };
}
