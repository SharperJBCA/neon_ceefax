import { useState, useRef, useCallback } from "react";
import { globalRoomIndex } from "./floors";

function SeegsonPage({ floor, floorIndex, systemStates, toggleSystem, activeRoom, setActiveRoom }) {
  const rooms = floor?.rooms ?? [];

  // Use provided activeRoom state from parent if available, otherwise use local state
  const [localActiveRoom, setLocalActiveRoom] = useState(0);
  const currentActiveRoom = activeRoom !== undefined ? activeRoom : localActiveRoom;
  const currentSetActiveRoom = setActiveRoom !== undefined ? setActiveRoom : setLocalActiveRoom;
  const [flashPower, setFlashPower] = useState(false);
  const [flashNetwork, setFlashNetwork] = useState(false);

  const powerTimer = useRef(null);
  const networkTimer = useRef(null);

  const currentRoom = rooms[currentActiveRoom];
  const roomIdx = globalRoomIndex(floorIndex, currentActiveRoom);

  const getUsage = useCallback(
    (localRoomIndex) => {
      const room = rooms[localRoomIndex];
      if (!room) return { power: 0, network: 0 };
      const rIdx = globalRoomIndex(floorIndex, localRoomIndex);
      let power = 0;
      let network = 0;
      room.systems.forEach((sys, si) => {
        if (systemStates[`${rIdx}-${si}`]) {
          power += sys.power;
          network += sys.network;
        }
      });
      return { power, network };
    },
    [rooms, floorIndex, systemStates]
  );

  const usage = getUsage(currentActiveRoom);
  const remainingPower = (currentRoom?.maxPower ?? 0) - usage.power;
  const remainingNetwork = (currentRoom?.maxNetwork ?? 0) - usage.network;

  function triggerFlash(target) {
    if (target === "power" || target === "both") {
      setFlashPower(true);
      clearTimeout(powerTimer.current);
      powerTimer.current = setTimeout(() => setFlashPower(false), 800);
    }
    if (target === "network" || target === "both") {
      setFlashNetwork(true);
      clearTimeout(networkTimer.current);
      networkTimer.current = setTimeout(() => setFlashNetwork(false), 800);
    }
  }

  function handleToggle(systemIndex) {
    const key = `${roomIdx}-${systemIndex}`;
    const isCurrentlyOn = systemStates[key] ?? false;

    if (isCurrentlyOn) {
      toggleSystem(roomIdx, systemIndex, false);
      return;
    }

    // Turning on — check capacity
    const sys = currentRoom.systems[systemIndex];
    const currentUsage = getUsage(activeRoom);
    const wouldExceedPower =
      currentUsage.power + sys.power > currentRoom.maxPower;
    const wouldExceedNetwork =
      currentUsage.network + sys.network > currentRoom.maxNetwork;

    if (wouldExceedPower || wouldExceedNetwork) {
      if (wouldExceedPower && wouldExceedNetwork) {
        triggerFlash("both");
      } else if (wouldExceedPower) {
        triggerFlash("power");
      } else {
        triggerFlash("network");
      }
      return;
    }

    toggleSystem(roomIdx, systemIndex, true);
  }

  return (
    <div className="seegson">
      <div className="seegson__titlebar">Rewire System Control</div>

      <nav className="seegson__rooms">
        {rooms.map((room, i) => (
          <button
            key={i}
            className={`seegson__room-btn ${i === currentActiveRoom ? "is-active" : ""}`}
            onClick={() => currentSetActiveRoom(i)}
          >
            {room.name}
          </button>
        ))}
      </nav>

      <div className="seegson__room-name">{currentRoom?.name}</div>

      <div className="seegson__systems">
        {currentRoom?.systems.map((sys, si) => {
          const key = `${roomIdx}-${si}`;
          const isActive = systemStates[key] ?? false;
          return (
            <div key={si} className="seegson__system">
              <button
                className="seegson__system-btn"
                onClick={() => handleToggle(si)}
              >
                {sys.name}
              </button>
              <div className={`seegson__status ${isActive ? "is-active" : ""}`}>
                {isActive ? "Active" : "Inactive"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="seegson__divider" />

      <div className="seegson__resources">
        <div
          className={`seegson__resource ${flashPower ? "is-flashing" : ""}`}
        >
          <div className="seegson__resource-lines" />
          <span>
            Available Power: {remainingPower} / {currentRoom?.maxPower ?? 0}
          </span>
          <div className="seegson__resource-lines" />
        </div>

        <div
          className={`seegson__resource ${flashNetwork ? "is-flashing" : ""}`}
        >
          <div className="seegson__resource-lines" />
          <span>
            Available Network: {remainingNetwork} /{" "}
            {currentRoom?.maxNetwork ?? 0}
          </span>
          <div className="seegson__resource-lines" />
        </div>
      </div>
    </div>
  );
}

export default SeegsonPage;
