import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

// Builds a state object from Supabase rows: { "roomIndex-systemIndex": boolean }
function rowsToState(rows) {
  const state = {};
  rows.forEach((row) => {
    state[`${row.room_index}-${row.system_index}`] = row.is_active;
  });
  return state;
}

export default function useSystemStates() {
  const [systemStates, setSystemStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [realtimeStatus, setRealtimeStatus] = useState("connecting");

  // Fetch initial state
  useEffect(() => {
    async function fetchStates() {
      const { data, error } = await supabase
        .from("system_states")
        .select("*");

      if (error) {
        console.error("Failed to fetch system states:", error);
      } else {
        setSystemStates(rowsToState(data));
      }
      setLoading(false);
    }
    fetchStates();
  }, []);

  // Subscribe to real-time updates for all CRUD operations
  useEffect(() => {
    setRealtimeStatus("connecting");
    
    const channel = supabase
      .channel("system_states_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "system_states" },
        (payload) => {
          console.log("Received realtime update:", payload);
          const row = payload.new;
          setSystemStates((prev) => ({
            ...prev,
            [`${row.room_index}-${row.system_index}`]: row.is_active,
          }));
        }
      )
      .on("postgres_changes",
        { event: "DELETE", schema: "public", table: "system_states" },
        (payload) => {
          console.log("Received delete update:", payload);
          const row = payload.old;
          setSystemStates((prev) => {
            const newState = { ...prev };
            delete newState[`${row.room_index}-${row.system_index}`];
            return newState;
          });
        }
      )
      .on("channel_error", (error) => {
        console.error("Realtime channel error:", error);
        setRealtimeStatus("error");
      })
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
        setRealtimeStatus(status);
      });

    return () => {
      console.log("Cleaning up realtime channel");
      supabase.removeChannel(channel);
    };
  }, []);

  // Manual refresh function
  const refreshStates = useCallback(async () => {
    console.log("Manually refreshing states...");
    const { data, error } = await supabase
      .from("system_states")
      .select("*");

    if (!error && data) {
      setSystemStates(rowsToState(data));
      console.log("Manual refresh successful");
      return true;
    } else {
      console.error("Manual refresh failed:", error);
      return false;
    }
  }, []);

  // Periodic refresh as fallback (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshStates();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [refreshStates]);

  // Toggle a system in Supabase
  const toggleSystem = useCallback(
    async (roomIndex, systemIndex, newValue) => {
      const key = `${roomIndex}-${systemIndex}`;

      // Optimistic update
      setSystemStates((prev) => ({ ...prev, [key]: newValue }));

      console.log(`Toggling system: room ${roomIndex}, system ${systemIndex}, value: ${newValue}`);

      const { data, error } = await supabase
        .from("system_states")
        .update({ is_active: newValue })
        .eq("room_index", roomIndex)
        .eq("system_index", systemIndex)
        .select();

      if (error) {
        console.error("Failed to toggle system:", error);
        // Revert on failure
        setSystemStates((prev) => ({ ...prev, [key]: !newValue }));
      } else {
        console.log("Update successful:", data);
      }
    },
    []
  );

  return { systemStates, toggleSystem, loading, realtimeStatus, refreshStates };
}
