import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./games.css";

function GameCreatePage({ user, role, setPageCode }) {
  const [title, setTitle] = useState("");
  const [gameDate, setGameDate] = useState("");
  const [gameTime, setGameTime] = useState("19:00");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [description, setDescription] = useState("");
  const [missionId, setMissionId] = useState("");
  const [missionsList, setMissionsList] = useState([]);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!user) {
    setPageCode("authxx.000");
    return null;
  }

  if (role !== "admin" && role !== "warden") {
    setPageCode("dashbd.000");
    return null;
  }

  useEffect(() => {
    async function loadMissions() {
      const { data } = await supabase
        .from("missions")
        .select("id, title")
        .order("created_at", { ascending: false });
      if (data) setMissionsList(data);
    }
    loadMissions();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const { error: err } = await supabase.from("games").insert({
      created_by: user.id,
      title: title.trim(),
      game_date: gameDate,
      game_time: gameTime,
      max_players: maxPlayers,
      description: description.trim() || null,
      mission_id: missionId || null,
    });

    if (err) {
      setError(err.message);
      setBusy(false);
    } else {
      setPageCode("gamesz.000");
    }
  }

  return (
    <div className="games">
      <div className="games__title">Create Game</div>

      <form className="games__form" onSubmit={handleCreate}>
        <label className="games__field">
          <span>Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label className="games__field">
          <span>Date</span>
          <input
            type="date"
            value={gameDate}
            onChange={(e) => setGameDate(e.target.value)}
            required
          />
        </label>

        <label className="games__field">
          <span>Time</span>
          <input
            type="time"
            value={gameTime}
            onChange={(e) => setGameTime(e.target.value)}
            required
          />
        </label>

        <label className="games__field">
          <span>Max Players</span>
          <input
            type="number"
            min={1}
            max={20}
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(parseInt(e.target.value, 10))}
            required
          />
        </label>

        <label className="games__field">
          <span>Description (optional)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </label>

        <label className="games__field">
          <span>Mission (optional)</span>
          <select
            value={missionId}
            onChange={(e) => setMissionId(e.target.value)}
          >
            <option value="">— No mission —</option>
            {missionsList.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </label>

        {error && <div className="games__error">{error}</div>}

        <button className="games__submit" type="submit" disabled={busy}>
          {busy ? "Creating..." : "Create Game"}
        </button>
      </form>

      <button
        className="games__back"
        onClick={() => setPageCode("gamesz.000")}
      >
        Cancel
      </button>
    </div>
  );
}

export default GameCreatePage;
