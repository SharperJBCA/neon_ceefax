import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./characters.css";

function CrewRosterPage({ user, setPageCode }) {
  const [living, setLiving] = useState([]);
  const [dead, setDead] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user) {
    setPageCode("authxx.000");
    return null;
  }

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("characters")
        .select("id, name, class, games_played, is_dead, death_description, profiles(display_name)")
        .order("games_played", { ascending: false });

      if (data) {
        setLiving(data.filter((c) => !c.is_dead));
        setDead(data.filter((c) => c.is_dead));
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="chars">
      <div className="chars__title">Crew Roster</div>

      {loading ? (
        <div className="chars__loading">Loading...</div>
      ) : (
        <>
          <div className="chars__roster-section">
            <div className="chars__roster-heading">
              Active Crew ({living.length})
            </div>
            {living.length === 0 ? (
              <div className="chars__roster-empty">No active crew members.</div>
            ) : (
              <div className="chars__list">
                {living.map((c) => (
                  <div key={c.id} className="chars__card">
                    <div className="chars__card-header">
                      <span className="chars__card-name">{c.name}</span>
                      <span className="chars__card-class">{c.class}</span>
                    </div>
                    <div className="chars__card-stats">
                      <span>{c.games_played} games</span>
                      <span className="chars__card-owner">
                        {c.profiles?.display_name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="chars__roster-section">
            <div className="chars__roster-heading chars__roster-heading--dead">
              Fallen Crew ({dead.length})
            </div>
            {dead.length === 0 ? (
              <div className="chars__roster-empty">No casualties yet.</div>
            ) : (
              <div className="chars__list">
                {dead.map((c) => (
                  <div key={c.id} className="chars__card is-dead">
                    <div className="chars__card-header">
                      <span className="chars__card-name">{c.name}</span>
                      <span className="chars__card-class">{c.class}</span>
                    </div>
                    <div className="chars__card-stats">
                      <span>{c.games_played} games</span>
                      <span className="chars__card-owner">
                        {c.profiles?.display_name}
                      </span>
                      {c.death_description && (
                        <span className="chars__dead-tag">
                          {c.death_description}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <button
        className="chars__back"
        onClick={() => setPageCode("dashbd.000")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default CrewRosterPage;
