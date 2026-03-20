import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./characters.css";

function CharacterListPage({ user, setPageCode }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  if (!user) {
    setPageCode("authxx.000");
    return null;
  }

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("characters")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setCharacters(data);
      setLoading(false);
    }
    load();
  }, [user.id]);

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    setDeleting(id);
    const { error } = await supabase.from("characters").delete().eq("id", id);
    if (!error) {
      setCharacters((prev) => prev.filter((c) => c.id !== id));
    }
    setDeleting(null);
  }

  return (
    <div className="chars">
      <div className="chars__title">Your Characters</div>

      {loading ? (
        <div className="chars__loading">Loading...</div>
      ) : (
        <>
          <div className="chars__list">
            {characters.map((c) => (
              <div
                key={c.id}
                className={`chars__card ${c.is_dead ? "is-dead" : ""}`}
              >
                <div className="chars__card-header">
                  <span className="chars__card-name">{c.name}</span>
                  <span className="chars__card-class">{c.class}</span>
                </div>
                <div className="chars__card-stats">
                  <span>{c.games_played} games</span>
                  {c.is_dead && (
                    <span className="chars__dead-tag">
                      DEAD{c.death_description ? `: ${c.death_description}` : ""}
                    </span>
                  )}
                </div>
                <div className="chars__card-actions">
                  <button
                    className="chars__edit-btn"
                    onClick={() => setPageCode(`chrctr.edit.${c.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="chars__delete-btn"
                    onClick={() => handleDelete(c.id, c.name)}
                    disabled={deleting === c.id}
                  >
                    {deleting === c.id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            className="chars__create-btn"
            onClick={() => setPageCode("chrctr.001")}
          >
            + Create New Character
          </button>
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

export default CharacterListPage;
