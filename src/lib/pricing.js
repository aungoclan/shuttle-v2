// src/lib/pricing.js

// ===== CONFIG =====
const AIRPORT_KEYWORDS = ["smf", "sacramento airport", "sac intl", "airport"];

const ZONES = [
  {
    name: "Elk Grove",
    keywords: ["elk grove"],
    min: 75,
    max: 95,
  },
  {
    name: "Davis",
    keywords: ["davis", "uc davis"],
    min: 80,
    max: 100,
  },
  {
    name: "Roseville / Rocklin",
    keywords: ["roseville", "rocklin"],
    min: 85,
    max: 110,
  },
  {
    name: "Folsom / Rancho Cordova",
    keywords: ["folsom", "rancho cordova"],
    min: 95,
    max: 120,
  },
  {
    name: "Woodland / West Sacramento",
    keywords: ["woodland", "west sacramento"],
    min: 70,
    max: 90,
  },
];

// default Sacramento
const DEFAULT_ZONE = {
  name: "Sacramento",
  min: 65,
  max: 85,
};

// ===== HELPERS =====
function normalize(text = "") {
  return text.toLowerCase();
}

function includesAny(text, keywords) {
  return keywords.some(k => text.includes(k));
}

// ===== MAIN FUNCTION =====
export function estimatePrice({
  pickup = "",
  dropoff = "",
  passengers = 1,
  luggage = 0,
  serviceType = "airport",
}) {
  let min = 0;
  let max = 0;

  const combined = normalize(`${pickup} ${dropoff}`);

  const isAirportRide = includesAny(combined, AIRPORT_KEYWORDS);

  // ===== AIRPORT PRICING =====
  if (isAirportRide) {
    let matchedZone = ZONES.find(zone =>
      includesAny(combined, zone.keywords)
    );

    if (matchedZone) {
      min = matchedZone.min;
      max = matchedZone.max;
    } else {
      min = DEFAULT_ZONE.min;
      max = DEFAULT_ZONE.max;
    }
  }

  // ===== NON-AIRPORT (local/hourly/event) =====
  else {
    // bạn có thể chỉnh lại phần này sau
    min = 60;
    max = 120;
  }

  // ===== SURCHARGES =====
  const passengerCount = Number(passengers) || 1;
  const luggageCount = Number(luggage) || 0;

  // nhiều khách
  if (passengerCount >= 4) {
    min += 10;
    max += 10;
  }

  // nhiều hành lý
  if (luggageCount >= 4) {
    min += 10;
    max += 10;
  }

  // ===== FINAL =====
  return {
    min,
    max,
    text: `$${min} - $${max}`,
    isAirportRide,
  };
}