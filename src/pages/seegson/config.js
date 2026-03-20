/**
 * Centralized Configuration for Seegson Systems
 * 
 * Define all floors, rooms, systems, and their positions in one place.
 * This makes it easy to add new floors/rooms without editing multiple files.
 */

// Room Types - Define the structure of each room type
const ROOM_TYPES = {
  CARGO_BAY: {
    name: "Cargo Bay",
    systems: [
      { name: "Mag-Locks", power: 1, network: 1 },
      { name: "Freight Lift", power: 2, network: 1 },
      { name: "Cargo Scanner", power: 1, network: 1 },
      { name: "Loading Arms", power: 2, network: 1 },
    ],
    maxPower: 3,
    maxNetwork: 2,
  },
  ENGINEERING: {
    name: "Engineering",
    systems: [
      { name: "Reactor Core", power: 0, network: 1 },
      { name: "Power Grid", power: 2, network: 1 },
      { name: "Coolant Flow", power: 1, network: 1 },
      { name: "Emergency Vents", power: 1, network: 1 },
    ],
    maxPower: 3,
    maxNetwork: 3,
  },
  MEDICAL_WING: {
    name: "Medical Wing",
    systems: [
      { name: "Life Support", power: 2, network: 1 },
      { name: "Cryo Systems", power: 2, network: 1 },
      { name: "Surgical Suite", power: 1, network: 1 },
      { name: "Med Dispensary", power: 1, network: 1 },
    ],
    maxPower: 4,
    maxNetwork: 2,
  },
  COMMAND_DECK: {
    name: "Command Deck",
    systems: [
      { name: "Comms Array", power: 1, network: 1 },
      { name: "Nav Systems", power: 2, network: 1 },
      { name: "Airlock Control", power: 1, network: 1 },
      { name: "Bulkhead Seals", power: 1, network: 1 },
    ],
    maxPower: 3,
    maxNetwork: 2,
  },
  // Add new room types here following the same pattern
};

// Map Positions - Define where systems appear on the SVG map
// Coordinates are in pixels relative to the SVG container
const MAP_POSITIONS = {
  // Room 0 - Cargo Bay
  0: [
    { x: 100, y: 80 },   // Mag-Locks
    { x: 100, y: 120 },  // Freight Lift
    { x: 100, y: 160 },  // Cargo Scanner
    { x: 100, y: 200 },  // Loading Arms
  ],
  // Room 1 - Engineering
  1: [
    { x: 500, y: 80 },   // Reactor Core
    { x: 500, y: 120 },  // Power Grid
    { x: 500, y: 160 },  // Coolant Flow
    { x: 500, y: 200 },  // Emergency Vents
  ],
  // Room 2 - Medical Wing
  2: [
    { x: 100, y: 330 },  // Life Support
    { x: 100, y: 370 },  // Cryo Systems
    { x: 100, y: 410 },  // Surgical Suite
    { x: 100, y: 450 },  // Med Dispensary
  ],
  // Room 3 - Command Deck
  3: [
    { x: 500, y: 330 },  // Comms Array
    { x: 500, y: 370 },  // Nav Systems
    { x: 500, y: 410 },  // Airlock Control
    { x: 500, y: 450 },  // Bulkhead Seals
  ],
  // Add positions for new rooms here
};

// Floor Configuration - Define which rooms are on each floor
const FLOORS_CONFIG = [
  {
    name: "Floor 1 — Operations",
    rooms: [
      ROOM_TYPES.CARGO_BAY,
      ROOM_TYPES.ENGINEERING,
    ],
  },
  {
    name: "Floor 2 — Command",
    rooms: [
      ROOM_TYPES.MEDICAL_WING,
      ROOM_TYPES.COMMAND_DECK,
    ],
  },
  // Add new floors here following the same pattern
];

// Generate the floors array with global room indices
function generateFloors() {
  let globalRoomIndex = 0;
  return FLOORS_CONFIG.map(floor => ({
    name: floor.name,
    rooms: floor.rooms.map(room => ({
      ...room,
      // Store the global room index for reference
      _globalIndex: globalRoomIndex++
    }))
  }));
}

// Get map position for a system
function getSystemMapPosition(roomIndex, systemIndex) {
  return MAP_POSITIONS[roomIndex]?.[systemIndex] || { x: 0, y: 0 };
}

// Calculate global room index (replaces the old globalRoomIndex function)
function calculateGlobalRoomIndex(floorIndex, localRoomIndex) {
  let index = 0;
  for (let f = 0; f < floorIndex; f++) {
    index += FLOORS_CONFIG[f].rooms.length;
  }
  return index + localRoomIndex;
}

// Get all rooms flattened (for Supabase initialization)
function getAllRooms() {
  const rooms = [];
  FLOORS_CONFIG.forEach((floor) => {
    floor.rooms.forEach((room) => {
      rooms.push(room);
    });
  });
  return rooms;
}

export {
  generateFloors,
  getSystemMapPosition,
  calculateGlobalRoomIndex,
  getAllRooms,
  ROOM_TYPES,
  FLOORS_CONFIG,
};

// Backward compatibility export
export function globalRoomIndex(floorIndex, localRoomIndex) {
  return calculateGlobalRoomIndex(floorIndex, localRoomIndex);
}