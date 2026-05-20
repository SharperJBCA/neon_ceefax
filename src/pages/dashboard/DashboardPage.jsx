import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import Typewriter from "../../components/Typewriter"
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
      const [charRes, gamesRes, signupRes] = await Promise.all([
        supabase
          .from("characters")
          .select("id, name, class, is_dead, games_played")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("games")
          .select("id, title, game_date, game_time, max_players, game_signups(count)")
          .gte("game_date", new Date().toISOString().split("T")[0])
          .order("game_date", { ascending: true }),
        supabase
          .from("game_signups")
          .select("position, game_id, games(id, max_players)")
          .eq("user_id", user.id),
      ]);

      if (charRes.data) setCharacters(charRes.data);
      if (gamesRes.data) {
        // Build a map of the user's signups by game_id
        const mySignups = {};
        if (signupRes.data) {
          for (const s of signupRes.data) {
            if (s.games) mySignups[s.game_id] = s;
          }
        }

        const games = gamesRes.data.map((g) => {
          const signup = mySignups[g.id];
          return {
            ...g,
            signedUp: !!signup,
            waitlisted: signup ? signup.position > g.max_players : false,
          };
        });
        setUpcomingGames(games);
      }
      setLoading(false);
    }
    load();
  }, [user.id]);

  const nextGame = upcomingGames.find((g) => g.signedUp && !g.waitlisted);

  return (
    <div className="dash">
      <div className="dash__header">
        <div className="dash__welcome">
          <Typewriter>
          Welcome, {profile?.display_name ?? "Crew Member"}
          </Typewriter>
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
                {upcomingGames.map((g) => {
                  const signupCount = g.game_signups?.[0]?.count ?? 0;
                  return (
                    <button
                      key={g.id}
                      className={`dash__game ${g.waitlisted ? "is-waitlisted" : ""}`}
                      onClick={() => setPageCode(`gamesz.002.${g.id}`)}
                    >
                      <span>{g.title}</span>
                      <span>
                        {g.game_date} @ {g.game_time}
                      </span>
                      <span>{signupCount}/{g.max_players}</span>
                      {g.signedUp && !g.waitlisted && <span className="dash__signed-up-tag">SIGNED UP</span>}
                      {g.waitlisted && <span className="dash__waitlist-tag">WAITLIST</span>}
                    </button>
                  );
                })}
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
            {(role === "admin" || role === "warden") && (
              <button onClick={() => setPageCode("missnz.001")}>
                Create Mission
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
