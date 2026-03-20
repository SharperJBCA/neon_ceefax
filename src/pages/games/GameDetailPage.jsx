import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./games.css";

function GameDetailPage({ user, setPageCode }) {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [signups, setSignups] = useState([]);
  const [myChars, setMyChars] = useState([]);
  const [selectedChar, setSelectedChar] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    setPageCode("authxx.000");
    return null;
  }

  // Load upcoming games for selection
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("games")
        .select("*, missions(title, description, tags, page_codes)")
        .gte("game_date", new Date().toISOString().split("T")[0])
        .order("game_date", { ascending: true });
      if (data) {
        setGames(data);
        if (data.length > 0) setSelectedGame(data[0]);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Load signups + user's characters when game selected
  useEffect(() => {
    if (!selectedGame) return;

    async function loadDetail() {
      const [signupRes, charRes] = await Promise.all([
        supabase
          .from("game_signups")
          .select("*, profiles(display_name), characters(name, class)")
          .eq("game_id", selectedGame.id)
          .order("position", { ascending: true }),
        supabase
          .from("characters")
          .select("id, name, class")
          .eq("user_id", user.id)
          .eq("is_dead", false),
      ]);

      if (signupRes.data) setSignups(signupRes.data);
      if (charRes.data) {
        setMyChars(charRes.data);
        if (charRes.data.length > 0) setSelectedChar(charRes.data[0].id);
      }
    }
    loadDetail();
  }, [selectedGame, user.id]);

  const mySignup = signups.find((s) => s.user_id === user.id);
  const roster = signups.filter((s) => s.position <= (selectedGame?.max_players ?? 0));
  const waitlist = signups.filter((s) => s.position > (selectedGame?.max_players ?? 0));

  async function handleSignup() {
    if (!selectedChar || !selectedGame) return;
    setError(null);
    setActionBusy(true);

    const { error: err } = await supabase.rpc("signup_for_game", {
      p_game_id: selectedGame.id,
      p_character_id: selectedChar,
    });

    if (err) {
      setError(err.message);
    } else {
      // Refresh signups
      const { data } = await supabase
        .from("game_signups")
        .select("*, profiles(display_name), characters(name, class)")
        .eq("game_id", selectedGame.id)
        .order("position", { ascending: true });
      if (data) setSignups(data);
    }
    setActionBusy(false);
  }

  async function handleCancel() {
    if (!selectedGame) return;
    setError(null);
    setActionBusy(true);

    const { error: err } = await supabase.rpc("cancel_signup", {
      p_game_id: selectedGame.id,
    });

    if (err) {
      setError(err.message);
    } else {
      const { data } = await supabase
        .from("game_signups")
        .select("*, profiles(display_name), characters(name, class)")
        .eq("game_id", selectedGame.id)
        .order("position", { ascending: true });
      if (data) setSignups(data);
    }
    setActionBusy(false);
  }

  if (loading) {
    return (
      <div className="games">
        <div className="games__loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="games">
      <div className="games__title">Game Detail</div>

      {games.length === 0 ? (
        <div className="games__empty">No upcoming games.</div>
      ) : (
        <>
          <label className="games__field">
            <span>Select Game</span>
            <select
              value={selectedGame?.id ?? ""}
              onChange={(e) =>
                setSelectedGame(games.find((g) => g.id === e.target.value))
              }
            >
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title} — {g.game_date}
                </option>
              ))}
            </select>
          </label>

          {selectedGame && (
            <div className="games__detail">
              <div className="games__detail-info">
                <h2>{selectedGame.title}</h2>
                <div>
                  {selectedGame.game_date} @ {selectedGame.game_time}
                </div>
                <div>Max players: {selectedGame.max_players}</div>
                {selectedGame.description && (
                  <div className="games__detail-desc">
                    {selectedGame.description}
                  </div>
                )}
                {selectedGame.missions && (
                  <div style={{ marginTop: 12, borderTop: "1px solid rgba(255,195,0,0.3)", paddingTop: 10 }}>
                    <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7, marginBottom: 4 }}>
                      Mission: {selectedGame.missions.title}
                    </div>
                    {selectedGame.missions.description && (
                      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 6 }}>
                        {selectedGame.missions.description}
                      </div>
                    )}
                    {selectedGame.missions.tags?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
                        {selectedGame.missions.tags.map((tag) => (
                          <span key={tag} style={{ fontSize: 11, padding: "2px 8px", border: "1px solid rgba(255,195,0,0.4)", color: "rgb(255,195,0)" }}>{tag}</span>
                        ))}
                      </div>
                    )}
                    {selectedGame.missions.page_codes?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {selectedGame.missions.page_codes.map((code) => (
                          <button
                            key={code}
                            style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "#c8c8c8", font: "inherit", fontSize: 11, padding: "2px 8px", cursor: "pointer", textDecoration: "underline" }}
                            onClick={() => setPageCode(code)}
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="games__roster">
                <div className="games__roster-title">
                  Roster ({roster.length}/{selectedGame.max_players})
                </div>
                {roster.map((s) => (
                  <div key={s.id} className="games__roster-row">
                    <span>{s.profiles?.display_name ?? "Unknown"}</span>
                    <span className="games__roster-char">
                      {s.characters?.name} ({s.characters?.class})
                    </span>
                  </div>
                ))}
              </div>

              {waitlist.length > 0 && (
                <div className="games__roster games__waitlist">
                  <div className="games__roster-title">
                    Waitlist ({waitlist.length})
                  </div>
                  {waitlist.map((s) => (
                    <div key={s.id} className="games__roster-row">
                      <span>{s.profiles?.display_name ?? "Unknown"}</span>
                      <span className="games__roster-char">
                        {s.characters?.name} ({s.characters?.class})
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {error && <div className="games__error">{error}</div>}

              {mySignup ? (
                <button
                  className="games__cancel-btn"
                  onClick={handleCancel}
                  disabled={actionBusy}
                >
                  {actionBusy ? "Cancelling..." : "Cancel Signup"}
                </button>
              ) : (
                <div className="games__signup-section">
                  {myChars.length === 0 ? (
                    <div className="games__empty">
                      No living characters.{" "}
                      <button
                        className="games__link-btn"
                        onClick={() => setPageCode("chrctr.001")}
                      >
                        Create one
                      </button>
                    </div>
                  ) : (
                    <>
                      <label className="games__field">
                        <span>Sign up with character</span>
                        <select
                          value={selectedChar}
                          onChange={(e) => setSelectedChar(e.target.value)}
                        >
                          {myChars.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.class})
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        className="games__signup-btn"
                        onClick={handleSignup}
                        disabled={actionBusy}
                      >
                        {actionBusy ? "Signing up..." : "Sign Up"}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      <button
        className="games__back"
        onClick={() => setPageCode("gamesz.000")}
      >
        Back to Games
      </button>
    </div>
  );
}

export default GameDetailPage;
