import { useState, useEffect, useRef, useCallback } from "react";

const BASE_URL = import.meta.env.BASE_URL;

function IctombMap({ floor, roomStates, selectedRoom, setSelectedRoom }) {
  // Pan / zoom state
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [zoom, setZoom] = useState(1);

  // Pointer tracking
  const dragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const totalMove = useRef(0);

  // Pinch tracking
  const pinchDist = useRef(null);

  // Reset pan/zoom/selection when floor changes
  useEffect(() => {
    setPanX(0);
    setPanY(0);
    setZoom(1);
    setSelectedRoom(null);
  }, [floor.key, setSelectedRoom]);

  // Pan handlers
  const onPointerDown = useCallback((e) => {
    if (e.pointerType === "touch" && !e.isPrimary) return;
    dragging.current = true;
    totalMove.current = 0;
    startPos.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    totalMove.current += Math.abs(dx) + Math.abs(dy);
    startPos.current = { x: e.clientX, y: e.clientY };
    setPanX((prev) => prev + dx);
    setPanY((prev) => prev + dy);
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  // Zoom via wheel
  const onWheel = useCallback((e) => {
    e.preventDefault();
    setZoom((prev) => Math.min(3, Math.max(0.5, prev - e.deltaY * 0.001)));
  }, []);

  // Pinch zoom
  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchDist.current = Math.hypot(dx, dy);
    }
  }, []);

  const onTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && pinchDist.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const scale = dist / pinchDist.current;
      pinchDist.current = dist;
      setZoom((prev) => Math.min(3, Math.max(0.5, prev * scale)));
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    pinchDist.current = null;
  }, []);

  // Click on a room layer
  const handleRoomClick = useCallback(
    (roomName) => {
      if (totalMove.current > 5) return;
      setSelectedRoom(roomName === selectedRoom ? null : roomName);
    },
    [selectedRoom, setSelectedRoom]
  );

  // Click on empty space to deselect
  const handleBackgroundClick = useCallback(
    (e) => {
      if (totalMove.current > 5) return;
      if (e.target === e.currentTarget || e.target.classList.contains("ictomb-map__transform")) {
        setSelectedRoom(null);
      }
    },
    [setSelectedRoom]
  );

  const roomEntries = Object.entries(floor.rooms);

  return (
    <div
      className="ictomb-map__viewport"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={handleBackgroundClick}
    >
      <div
        className="ictomb-map__transform"
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
        }}
      >
        <div className="ictomb-map__layers">
          {roomEntries.map(([roomName, _room]) => {
            const visible = roomStates[`${floor.key}:${roomName}`] ?? false;
            if (!visible) return null;

            const isSelected = roomName === selectedRoom;
            const src = `./${floor.svgDir}/${roomName}.svg`;
            console.log(src)
            
            return (
              <img
                key={roomName}
                src={src}
                alt={roomName}
                className={`ictomb-map__room ${isSelected ? "is-selected" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoomClick(roomName);
                }}
                draggable={false}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default IctombMap;
// ${BASE_URL}