import { useState } from "react";

function IctombAdmin({ floor, roomStates, toggleRoom }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="ictomb-admin">
      <button
        className="ictomb-admin__toggle"
        onClick={() => setOpen(!open)}
      >
        {open ? "Hide Rooms" : "Room Control"}
      </button>

      {open && (
        <div className="ictomb-admin__list">
          {Object.entries(floor.rooms).map(([name, room]) => {
            const visible = roomStates[`${floor.key}:${name}`] ?? false;
            return (
              <button
                key={name}
                className={`ictomb-admin__room ${visible ? "is-visible" : ""}`}
                onClick={() => toggleRoom(floor.key, name, !visible)}
              >
                <span className="ictomb-admin__indicator" />
                {room.displayName}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default IctombAdmin;
