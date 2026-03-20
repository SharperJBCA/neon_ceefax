import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./missions.css";

function MissionLogPage({ user, setPageCode }) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user) {
    setPageCode("authxx.000");
    return null;
  }

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("game_signups")
        .select("games(mission_id, missions(id, title, description, tags, page_codes))")
        .eq("user_id", user.id);

      if (data) {
        const seen = new Set();
        const uniqueMissions = [];
        for (const signup of data) {
          const mission = signup.games?.missions;
          if (mission && !seen.has(mission.id)) {
            seen.add(mission.id);
            uniqueMissions.push(mission);
          }
        }
        setMissions(uniqueMissions);
      }
      setLoading(false);
    }
    load();
  }, [user.id]);

  return (
    <div className="missions">
      <div className="missions__title">Mission Log</div>

      {loading ? (
        <div className="missions__loading">Loading...</div>
      ) : missions.length === 0 ? (
        <div className="missions__empty">No missions in your log yet.</div>
      ) : (
        <div className="missions__list">
          {missions.map((m) => (
            <div key={m.id} className="missions__card">
              <div className="missions__card-title">{m.title}</div>
              {m.description && (
                <div className="missions__card-desc">{m.description}</div>
              )}
              {m.tags && m.tags.length > 0 && (
                <div className="missions__card-tags">
                  {m.tags.map((tag) => (
                    <span key={tag} className="missions__tag">{tag}</span>
                  ))}
                </div>
              )}
              {m.page_codes && m.page_codes.length > 0 && (
                <div className="missions__card-pages">
                  {m.page_codes.map((code) => (
                    <button
                      key={code}
                      className="missions__page-link"
                      onClick={() => setPageCode(code)}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        className="missions__back"
        onClick={() => setPageCode("dashbd.000")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default MissionLogPage;
