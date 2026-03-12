export const PLANETS = {
  aegir: {
    id: "aegir",
    name: "Aegir",
    image: "public/planets.svg",
    location: "Inner orbital lane",
    climate: "Cold oceanic super-Earth",
    gravity: "1.14g",
    atmosphere: "Nitrogen-rich with high oxygen bands",
    summary:
      "Aegir is a deep-water world wrapped in reflective cloud belts. The stationing ring above Aegir is known for hydro-mining and long-range communications relay traffic.",
    highlights: [
      "Polar cyclones can persist for months with stable rotational patterns.",
      "Tidal generators in the equatorial trench produce most of the colony's power.",
      "Bioluminescent plankton blooms are visible from orbit during night-side passes.",
    ],
  },
  centis: {
    id: "centis",
    name: "Centis",
    image: "public/planets.svg",
    location: "Primary mid-orbit settlement",
    climate: "Temperate megacontinent world",
    gravity: "0.92g",
    atmosphere: "Dense argon-nitrogen mix",
    summary:
      "Centis is the central logistics world in the system and the largest human settlement node. Most interplanetary trade routes, fuel depots, and customs processing converge here.",
    highlights: [
      "Orbital elevators connect directly to the three major trade arcologies.",
      "Surface rail-lines are shielded against electrostatic dust storms.",
      "The western basin hosts the oldest preserved launch complex in-system.",
    ],
  },
  lo: {
    id: "lo",
    name: "Lo",
    image: "public/planets.svg",
    location: "Outer rocky belt",
    climate: "Dry volcanic moon",
    gravity: "0.38g",
    atmosphere: "Trace sulfur dioxide and neon",
    summary:
      "Lo is a rugged extraction moon dominated by geothermal drilling and experimental materials labs. Outposts are sparse and linked mainly by autonomous cargo hoppers.",
    highlights: [
      "Subsurface magma chambers enable near-constant geothermal output.",
      "Low gravity supports large-span fabrication yards.",
      "Frequent auroral interference disrupts line-of-sight comms during storms.",
    ],
  },
};

export const PLANET_HOTSPOTS = [
  { id: "aegir", cx: "67.5", cy: "175", r: "65", labelImage: "public/aegir_text.svg", labelX: "0", labelY: "40" },
  { id: "centis", cx: "510.5", cy: "250", r: "150", labelImage: "public/centis_text.svg", labelX: "470", labelY: "30" },
  { id: "lo", cx: "755", cy: "230", r: "45", labelImage: "public/lo_text.svg", labelX: "625", labelY: "120" },
];
