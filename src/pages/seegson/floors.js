// Import the centralized configuration
import { generateFloors, calculateGlobalRoomIndex, getAllRooms } from "./config";

// Generate floors from the central configuration
const floors = generateFloors();

// Export the globalRoomIndex function (backward compatibility)
export function globalRoomIndex(floorIndex, localRoomIndex) {
  return calculateGlobalRoomIndex(floorIndex, localRoomIndex);
}

// Export other functions
export { getAllRooms };

export default floors;