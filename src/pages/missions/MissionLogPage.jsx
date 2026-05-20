import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./missions.css";

function MissionLogPage({ user, role, setPageCode }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedGame, setExpandedGame] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const [reportText, setReportText] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user) {
    setPageCode("authxx.000");
    return null;
  }

  const isWardenOrAdmin = role === "warden" || role === "admin";

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("games")
        .select(
          "id, title, game_date, game_time, description, after_action_report, missions(title, description, tags), game_signups(position, characters(name, class), profiles(display_name))"
        )
        .lt("game_date", new Date().toISOString().split("T")[0])
        .order("game_date", { ascending: false });

      if (data) setGames(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSaveReport(gameId) {
    setSaving(true);
    const { error } = await supabase
      .from("games")
      .update({ after_action_report: reportText.trim() || null })
      .eq("id", gameId);

    if (!error) {
      setGames((prev) =>
        prev.map((g) =>
          g.id === gameId
            ? { ...g, after_action_report: reportText.trim() || null }
            : g
        )
      );
      setEditingReport(null);
    }
    setSaving(false);
  }

  function toggleExpand(gameId) {
    setExpandedGame((prev) => (prev === gameId ? null : gameId));
    setEditingReport(null);
  }

  return (
    <div className="missions">
      <div className="missions__title">Mission Log</div>

      {loading ? (
        <div className="missions__loading">Loading...</div>
      ) : games.length === 0 ? (
        <div className="missions__empty">No past games recorded yet.</div>
      ) : (
        <div className="missions__list">
          {games.map((g) => {
            const crew = (g.game_signups || [])
              .sort((a, b) => a.position - b.position);
            const isExpanded = expandedGame === g.id;

            return (
              <div key={g.id} className="missions__card">
                <div
                  className="missions__log-header"
                  onClick={() => toggleExpand(g.id)}
                >
                  <div>
                    <div className="missions__card-title">{g.title}</div>
                    <div className="missions__log-date">
                      {g.game_date} @ {g.game_time}
                      {g.missions?.title && (
                        <span className="missions__log-mission">
                          {g.missions.title}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="missions__log-toggle">
                    {isExpanded ? "\u25B2" : "\u25BC"}
                  </span>
                </div>

                {isExpanded && (
                  <div className="missions__log-detail">
                    {g.missions?.description && (
                      <div className="missions__log-mission-desc">
                        {g.missions.description}
                      </div>
                    )}

                    {g.missions?.tags?.length > 0 && (
                      <div className="missions__card-tags">
                        {g.missions.tags.map((tag) => (
                          <span key={tag} className="missions__tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {g.description && (
                      <div className="missions__log-game-desc">
                        {g.description}
                      </div>
                    )}

                    {crew.length > 0 && (
                      <div className="missions__log-crew">
                        <div className="missions__log-crew-title">Crew</div>
                        {crew.map((s, i) => (
                          <div key={i} className="missions__log-crew-row">
                            <span>
                              {s.profiles?.display_name ?? "Unknown"}
                            </span>
                            <span className="missions__log-crew-char">
                              {s.characters?.name} ({s.characters?.class})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {g.after_action_report && editingReport !== g.id && (
                      <div className="missions__log-aar">
                        <div className="missions__log-aar-title">
                          After Action Report
                        </div>
                        <div className="missions__log-aar-text">
                          {g.after_action_report}
                        </div>
                      </div>
                    )}

                    {isWardenOrAdmin && editingReport === g.id ? (
                      <div className="missions__log-aar-edit">
                        <textarea
                          className="missions__log-aar-textarea"
                          rows={5}
                          value={reportText}
                          onChange={(e) => setReportText(e.target.value)}
                          placeholder="Write your after action report..."
                        />
                        <div className="missions__log-aar-actions">
                          <button
                            className="missions__submit"
                            onClick={() => handleSaveReport(g.id)}
                            disabled={saving}
                          >
                            {saving ? "Saving..." : "Save Report"}
                          </button>
                          <button
                            className="missions__back"
                            onClick={() => setEditingReport(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      isWardenOrAdmin && (
                        <button
                          className="missions__log-edit-btn"
                          onClick={() => {
                            setEditingReport(g.id);
                            setReportText(g.after_action_report || "");
                          }}
                        >
                          {g.after_action_report
                            ? "Edit Report"
                            : "Add Report"}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
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
