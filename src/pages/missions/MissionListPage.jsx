import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./missions.css";

function MissionListPage({ user, role, setPageCode }) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  if (!user) {
    setPageCode("authxx.000");
    return null;
  }

  if (role !== "admin" && role !== "warden") {
    setPageCode("dashbd.000");
    return null;
  }

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("missions")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setMissions(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleDelete(e, missionId, title) {
    e.stopPropagation();
    if (!window.confirm(`Delete mission "${title}"? This cannot be undone.`)) return;
    setDeleting(missionId);
    const { error } = await supabase.from("missions").delete().eq("id", missionId);
    if (!error) {
      setMissions((prev) => prev.filter((m) => m.id !== missionId));
    }
    setDeleting(null);
  }

  return (
    <div className="missions">
      <div className="missions__title">Missions</div>

      <button
        className="missions__create-btn"
        onClick={() => setPageCode("missnz.001")}
      >
        + Create New Mission
      </button>

      {loading ? (
        <div className="missions__loading">Loading...</div>
      ) : missions.length === 0 ? (
        <div className="missions__empty">No missions created yet.</div>
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
              <div className="missions__card-footer">
                <button
                  className="missions__delete-inline"
                  onClick={(e) => handleDelete(e, m.id, m.title)}
                  disabled={deleting === m.id}
                >
                  {deleting === m.id ? "..." : "Delete"}
                </button>
              </div>
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

export default MissionListPage;
