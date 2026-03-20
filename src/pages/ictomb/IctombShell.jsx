import { useState } from "react";
import FLOORS from "./floors";
import useRoomStates from "./useRoomStates";
import IctombMap from "./IctombMap";
import IctombPanel from "./IctombPanel";
import IctombAdmin from "./IctombAdmin";
import "./ictomb.css";

function IctombShell({ role }) {
  const [activeFloorIndex, setActiveFloorIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { roomStates, toggleRoom, loading } = useRoomStates();

  const activeFloor = FLOORS[activeFloorIndex];
  const isWarden = role === "admin" || role === "warden";

  function switchFloor(index) {
    setActiveFloorIndex(index);
    setSelectedRoom(null);
  }

  return (
    <div className="ictomb-shell">
      <nav className="ictomb-shell__sidebar">
        <div className="ictomb-shell__sidebar-title">Ictomb Facility</div>
        {FLOORS.map((floor, i) => (
          <button
            key={floor.key}
            className={`ictomb-floor-btn ${i === activeFloorIndex ? "is-active" : ""}`}
            onClick={() => switchFloor(i)}
          >
            {floor.label}
          </button>
        ))}
        {isWarden && (
          <IctombAdmin
            floor={activeFloor}
            roomStates={roomStates}
            toggleRoom={toggleRoom}
          />
        )}
      </nav>

      <main className="ictomb-shell__main">
        {loading ? (
          <div className="ictomb-shell__loading">Connecting...</div>
        ) : (
          <>
            <IctombMap
              floor={activeFloor}
              roomStates={roomStates}
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
            />
            <IctombPanel
              floor={activeFloor}
              selectedRoom={selectedRoom}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default IctombShell;
