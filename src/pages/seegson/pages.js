const rooms = [
  {
    name: "Cargo Bay",
    maxPower: 3,
    maxNetwork: 2,
    systems: [
      { name: "Mag-Locks",     power: 1, network: 1 },
      { name: "Freight Lift",  power: 2, network: 1 },
      { name: "Cargo Scanner", power: 1, network: 1 },
      { name: "Loading Arms",  power: 2, network: 1 },
    ],
  },
  {
    name: "Medical Wing",
    maxPower: 4,
    maxNetwork: 2,
    systems: [
      { name: "Life Support",   power: 2, network: 1 },
      { name: "Cryo Systems",   power: 2, network: 1 },
      { name: "Surgical Suite", power: 1, network: 1 },
      { name: "Med Dispensary", power: 1, network: 1 },
    ],
  },
  {
    name: "Engineering",
    maxPower: 3,
    maxNetwork: 3,
    systems: [
      { name: "Reactor Core",    power: 0, network: 1 },
      { name: "Power Grid",      power: 2, network: 1 },
      { name: "Coolant Flow",    power: 1, network: 1 },
      { name: "Emergency Vents", power: 1, network: 1 },
    ],
  },
  {
    name: "Command Deck",
    maxPower: 3,
    maxNetwork: 2,
    systems: [
      { name: "Comms Array",     power: 1, network: 1 },
      { name: "Nav Systems",     power: 2, network: 1 },
      { name: "Airlock Control", power: 1, network: 1 },
      { name: "Bulkhead Seals",  power: 1, network: 1 },
    ],
  },
];

export default { rooms };
