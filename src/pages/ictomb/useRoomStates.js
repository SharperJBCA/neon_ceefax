import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";

function rowsToState(rows) {
  const state = {};
  rows.forEach((row) => {
    state[`${row.floor_key}:${row.room_name}`] = row.is_visible;
  });
  return state;
}

export default function useRoomStates() {
  const [roomStates, setRoomStates] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch initial state
  useEffect(() => {
    async function fetchStates() {
      const { data, error } = await supabase
        .from("ictomb_room_states")
        .select("*");

      if (error) {
        console.error("Failed to fetch ictomb room states:", error);
      } else {
        setRoomStates(rowsToState(data));
      }
      setLoading(false);
    }
    fetchStates();
  }, []);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("ictomb_room_states_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ictomb_room_states" },
        (payload) => {
          const row = payload.new;
          if (row && row.floor_key && row.room_name) {
            setRoomStates((prev) => ({
              ...prev,
              [`${row.floor_key}:${row.room_name}`]: row.is_visible,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Periodic fallback refresh (5 minutes)
  const refreshStates = useCallback(async () => {
    const { data, error } = await supabase
      .from("ictomb_room_states")
      .select("*");
    if (!error && data) {
      setRoomStates(rowsToState(data));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshStates, 300000);
    return () => clearInterval(interval);
  }, [refreshStates]);

  // Toggle a room's visibility
  const toggleRoom = useCallback(async (floorKey, roomName, newValue) => {
    const key = `${floorKey}:${roomName}`;

    // Optimistic update
    setRoomStates((prev) => ({ ...prev, [key]: newValue }));

    const { error } = await supabase
      .from("ictomb_room_states")
      .update({ is_visible: newValue, updated_at: new Date().toISOString() })
      .eq("floor_key", floorKey)
      .eq("room_name", roomName);

    if (error) {
      console.error("Failed to toggle room:", error);
      // Revert on failure
      setRoomStates((prev) => ({ ...prev, [key]: !newValue }));
    }
  }, []);

  const isVisible = useCallback(
    (floorKey, roomName) => roomStates[`${floorKey}:${roomName}`] ?? false,
    [roomStates]
  );

  return { roomStates, toggleRoom, isVisible, loading };
}
