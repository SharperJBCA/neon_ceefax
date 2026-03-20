import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./dashboard.css";

function DashboardPage({ user, profile, role, signOut, setPageCode }) {
  const [characters, setCharacters] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user) {
    setPageCode("authxx.000");
    return null;
  }

  useEffect(() => {
    async function load() {
      const [charRes, signupRes] = await Promise.all([
        supabase
          .from("characters")
          .select("id, name, class, is_dead, games_played")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("game_signups")
          .select("position, games(id, title, game_date, game_time, max_players)")
          .eq("user_id", user.id)
          .gte("games.game_date", new Date().toISOString().split("T")[0])
          .order("created_at", { ascending: true }),
      ]);

      if (charRes.data) setCharacters(charRes.data);
      if (signupRes.data) {
        const games = signupRes.data
          .filter((s) => s.games)
          .map((s) => ({
            ...s.games,
            position: s.position,
            waitlisted: s.position > s.games.max_players,
          }))
          .sort((a, b) => a.game_date.localeCompare(b.game_date));
        setUpcomingGames(games);
      }
      setLoading(false);
    }
    load();
  }, [user.id]);

  const nextGame = upcomingGames.find((g) => !g.waitlisted);

  return (
    <div className="dash">
      <div className="dash__header">
        <div className="dash__welcome">
          Welcome, {profile?.display_name ?? "Crew Member"}
        </div>
        <div className="dash__role">Role: {role ?? "player"}</div>
        <button className="dash__signout" onClick={signOut}>
          Sign Out
        </button>
      </div>

      {loading ? (
        <div className="dash__loading">Loading...</div>
      ) : (
        <>
          {nextGame && (
            <div className="dash__next-game">
              <div className="dash__section-title">Next Game</div>
              <div className="dash__next-game-info">
                {nextGame.title} — {nextGame.game_date} @ {nextGame.game_time}
              </div>
            </div>
          )}

          <div className="dash__section">
            <div className="dash__section-title">
              Your Characters ({characters.length})
            </div>
            {characters.length === 0 ? (
              <div className="dash__empty">No characters yet.</div>
            ) : (
              <div className="dash__char-list">
                {characters.map((c) => (
                  <div
                    key={c.id}
                    className={`dash__char ${c.is_dead ? "is-dead" : ""}`}
                  >
                    <span className="dash__char-name">{c.name}</span>
                    <span className="dash__char-class">{c.class}</span>
                    <span className="dash__char-games">
                      {c.games_played} games
                    </span>
                    {c.is_dead && <span className="dash__char-dead">DEAD</span>}
                  </div>
                ))}
              </div>
            )}
            <button
              className="dash__action"
              onClick={() => setPageCode("chrctr.001")}
            >
              + New Character
            </button>
          </div>

          <div className="dash__section">
            <div className="dash__section-title">
              Upcoming Games ({upcomingGames.length})
            </div>
            {upcomingGames.length === 0 ? (
              <div className="dash__empty">No upcoming games.</div>
            ) : (
              <div className="dash__game-list">
                {upcomingGames.map((g) => (
                  <button
                    key={g.id}
                    className={`dash__game ${g.waitlisted ? "is-waitlisted" : ""}`}
                    onClick={() => setPageCode("gamesz.002")}
                  >
                    <span>{g.title}</span>
                    <span>
                      {g.game_date} @ {g.game_time}
                    </span>
                    {g.waitlisted && <span className="dash__waitlist-tag">WAITLIST</span>}
                  </button>
                ))}
              </div>
            )}
            <button
              className="dash__action"
              onClick={() => setPageCode("gamesz.000")}
            >
              Browse Games
            </button>
          </div>

          <div className="dash__nav">
            <button onClick={() => setPageCode("chrctr.000")}>
              My Characters
            </button>
            <button onClick={() => setPageCode("chrctr.002")}>
              Crew Roster
            </button>
            <button onClick={() => setPageCode("gamesz.000")}>
              All Games
            </button>
            <button onClick={() => setPageCode("missnz.002")}>
              Mission Log
            </button>
            <button onClick={() => setPageCode("bottlx.000")}>
              Message Board
            </button>
            {(role === "admin" || role === "warden") && (
              <button onClick={() => setPageCode("gamesz.001")}>
                Create Game
              </button>
            )}
            {role === "admin" && (
              <button onClick={() => setPageCode("adminx.000")}>
                Admin Panel
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
