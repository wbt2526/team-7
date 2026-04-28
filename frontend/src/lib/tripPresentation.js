const FALLBACK_LOCATIONS = [
  "South Ari Atoll, Maldives",
  "Zermatt, Switzerland",
  "Kyoto, Japan",
  "Paris, France",
  "Maasai Mara, Kenya",
  "Santorini, Greece",
  "Reykjavik, Iceland",
  "Ubud, Bali",
  "Tokyo, Japan",
  "Queenstown, New Zealand",
  "Marrakech, Morocco",
  "Patagonia, Argentina",
];

const CATEGORY_LABELS = ["Coastal", "Hiking", "Culture", "City", "Safari", "Escape"];

export function getTripCategory(trip) {
  const text = `${trip.title} ${trip.description}`.toLowerCase();
  if (
    text.includes("coast") ||
    text.includes("island") ||
    text.includes("beach") ||
    text.includes("sea") ||
    text.includes("santorini") ||
    text.includes("amalfi") ||
    text.includes("maldives")
  ) {
    return "Coastal Escapes";
  }
  if (
    text.includes("hiking") ||
    text.includes("alps") ||
    text.includes("glacier") ||
    text.includes("mountain") ||
    text.includes("patagonia") ||
    text.includes("banff")
  ) {
    return "Mountain Hiking";
  }
  return "City Culture";
}

export function getTripMeta(trip, index = 0) {
  return {
    location: FALLBACK_LOCATIONS[index % FALLBACK_LOCATIONS.length],
    categoryBadge: CATEGORY_LABELS[index % CATEGORY_LABELS.length],
    categoryFilter: getTripCategory(trip),
    rating: (4.7 + (index % 4) * 0.1).toFixed(1),
  };
}
