import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./games.css";

function GameListPage({ user, role, setPageCode }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  if (!user) {
    setPageCode("authxx.000");
    return null;
  }

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("games")
        .select("*, game_signups(count)")
        .gte("game_date", new Date().toISOString().split("T")[0])
        .order("game_date", { ascending: true });
      if (data) setGames(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleDelete(e, gameId, title) {
    e.stopPropagation();
    if (!window.confirm(`Delete game "${title}"? This cannot be undone.`)) return;
    setDeleting(gameId);
    const { error } = await supabase.from("games").delete().eq("id", gameId);
    if (!error) {
      setGames((prev) => prev.filter((g) => g.id !== gameId));
    }
    setDeleting(null);
  }

  return (
    <div className="games">
      <div className="games__title">Upcoming Games</div>

      {(role === "admin" || role === "warden") && (
        <button
          className="games__create-btn"
          onClick={() => setPageCode("gamesz.001")}
        >
          + Create New Game
        </button>
      )}

      {loading ? (
        <div className="games__loading">Loading...</div>
      ) : games.length === 0 ? (
        <div className="games__empty">No upcoming games scheduled.</div>
      ) : (
        <div className="games__list">
          {games.map((g) => {
            const signupCount = g.game_signups?.[0]?.count ?? 0;
            const isFull = signupCount >= g.max_players;
            const canDelete =
              role === "admin" || g.created_by === user.id;
            return (
              <div
                key={g.id}
                className={`games__card ${isFull ? "is-full" : ""}`}
                onClick={() => setPageCode(`gamesz.002.${g.id}`)}
              >
                <div className="games__card-header">
                  <span className="games__card-title">{g.title}</span>
                  <span className="games__card-date">
                    {g.game_date} @ {g.game_time}
                  </span>
                </div>
                <div className="games__card-footer">
                  <span>
                    {signupCount}/{g.max_players} players
                  </span>
                  {isFull && <span className="games__full-tag">FULL</span>}
                  {canDelete && (
                    <button
                      className="games__delete-inline"
                      onClick={(e) => handleDelete(e, g.id, g.title)}
                      disabled={deleting === g.id}
                    >
                      {deleting === g.id ? "..." : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        className="games__back"
        onClick={() => setPageCode("dashbd.000")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default GameListPage;
