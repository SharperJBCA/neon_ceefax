import { motion } from "framer-motion";
import { globalRoomIndex, getSystemMapPosition } from "./config";

// Import SVG files as URLs
import dullMapUrl from "../../../public/seegson_maps/dull_map_01.svg?url";
import brightRoom0Url from "../../../public/seegson_maps/bright_map_01_room_01.svg?url";
import brightRoom1Url from "../../../public/seegson_maps/bright_map_01_room_02.svg?url";
import brightRoom2Url from "../../../public/seegson_maps/bright_map_01_room_03.svg?url";
import brightRoom3Url from "../../../public/seegson_maps/bright_map_01_room_04.svg?url";

// Array of bright room SVG URLs mapped to global room indices
const BrightRoomSVGs = [brightRoom0Url, brightRoom1Url, brightRoom2Url, brightRoom3Url];

function SeegsonMap({ floor, floorIndex, systemStates, activeRoom, setActiveRoom }) {
  const rooms = floor?.rooms ?? [];
  
  // Calculate global room index for the active room
  const globalActiveRoomIndex = globalRoomIndex(floorIndex, activeRoom);
  
  // Get the bright SVG for the currently active room
  const brightRoomSVG = BrightRoomSVGs[globalActiveRoomIndex] || null;

  function getUsage(room, roomIdx) {
    let power = 0;
    let network = 0;
    room.systems.forEach((sys, si) => {
      if (systemStates[`${roomIdx}-${si}`]) {
        power += sys.power;
        network += sys.network;
      }
    });
    return { power, network };
  }

  // Use centralized map position configuration
  const getSystemLabelPosition = getSystemMapPosition;

  return (
    <div className="seegson">
      <div className="seegson__titlebar">System Map — {floor.name}</div>

      <div className="seegson-map__container">
        {/* Base dull map - always visible */}
        <div className="seegson-map__base">
          <img src={dullMapUrl} alt="Facility Map" className="seegson-map__svg" />
        </div>

        {/* Bright room overlay with motion transition */}
        {brightRoomSVG && (
          <motion.div
            className="seegson-map__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img src={brightRoomSVG} alt="Highlighted Room" className="seegson-map__svg" />
          </motion.div>
        )}

        {/* System labels */}
        {rooms.map((room, ri) => {
          const roomIdx = globalRoomIndex(floorIndex, ri);
          const usage = getUsage(room, roomIdx);

          return (
            <div key={ri} className="seegson-map__room-labels">
              {room.systems.map((sys, si) => {
                const isActive = systemStates[`${roomIdx}-${si}`] ?? false;
                const position = getSystemLabelPosition(roomIdx, si);
                
                return (
                  <motion.div
                    key={si}
                    className={`seegson-map__system-label ${isActive ? "is-active" : ""}`}
                    style={{ 
                      left: `${position.x}px`, 
                      top: `${position.y}px`
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + (si * 0.05), duration: 0.2 }}
                  >
                    <span className="seegson-map__label-text">{sys.name}</span>
                    <div className="seegson-map__label-resources">
                      <span>PWR {sys.power}</span>
                      <span>NWK {sys.network}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          );
        })}

        {/* Room navigation buttons */}
        <div className="seegson-map__room-nav">
          {rooms.map((room, ri) => (
            <button
              key={ri}
              className={`seegson-map__room-btn ${ri === activeRoom ? "is-active" : ""}`}
              onClick={() => setActiveRoom(ri)}
            >
              {room.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SeegsonMap;