import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./bottle.css";

function BottlePage({ user, role, setPageCode }) {
  const [messages, setMessages] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Compose form state
  const [characterId, setCharacterId] = useState("");
  const [useCustomName, setUseCustomName] = useState(false);
  const [customName, setCustomName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const isAdmin = role === "admin" || role === "warden";

  if (!user) {
    setPageCode("authxx.000");
    return null;
  }

  useEffect(() => {
    async function load() {
      const [msgRes, charRes] = await Promise.all([
        supabase
          .from("bottle_messages")
          .select("*, characters(name, class)")
          .order("created_at", { ascending: false }),
        supabase
          .from("characters")
          .select("id, name, class")
          .eq("user_id", user.id)
          .eq("is_dead", false)
          .order("name"),
      ]);

      if (msgRes.data) setMessages(msgRes.data);
      if (charRes.data) setCharacters(charRes.data);
      setLoading(false);
    }
    load();
  }, [user.id]);

  function resetForm() {
    setCharacterId("");
    setUseCustomName(false);
    setCustomName("");
    setTitle("");
    setBody("");
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !body.trim()) {
      setError("Title and body are required.");
      return;
    }

    if (useCustomName && isAdmin) {
      if (!customName.trim()) {
        setError("Custom name is required.");
        return;
      }
    } else {
      if (!characterId) {
        setError("Select a character.");
        return;
      }
    }

    setSubmitting(true);

    const row = {
      user_id: user.id,
      title: title.trim(),
      body: body.trim(),
    };

    if (useCustomName && isAdmin) {
      row.custom_name = customName.trim();
      row.character_id = null;
    } else {
      row.character_id = characterId;
      row.custom_name = null;
    }

    const { data, error: insertErr } = await supabase
      .from("bottle_messages")
      .insert(row)
      .select("*, characters(name, class)")
      .single();

    setSubmitting(false);

    if (insertErr) {
      setError(insertErr.message);
      return;
    }

    setMessages((prev) => [data, ...prev]);
    resetForm();
    setComposing(false);
  }

  async function handleDelete(id) {
    const { error: delErr } = await supabase
      .from("bottle_messages")
      .delete()
      .eq("id", id);

    if (delErr) {
      setError(delErr.message);
      return;
    }

    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  function formatTime(ts) {
    return new Date(ts).toLocaleString();
  }

  return (
    <div className="bottle">
      <div className="bottle__title">Message Board</div>

      {!composing ? (
        <button
          className="bottle__compose-btn"
          onClick={() => setComposing(true)}
        >
          + New Message
        </button>
      ) : (
        <form className="bottle__compose" onSubmit={handleSubmit}>
          <div className="bottle__compose-title">New Message</div>

          {isAdmin && (
            <label className="bottle__custom-toggle">
              <input
                type="checkbox"
                checked={useCustomName}
                onChange={(e) => setUseCustomName(e.target.checked)}
              />
              Post as custom name (NPC)
            </label>
          )}

          {useCustomName && isAdmin ? (
            <div className="bottle__field">
              <span>Custom Name</span>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="NPC name..."
              />
            </div>
          ) : (
            <div className="bottle__field">
              <span>Character</span>
              <select
                value={characterId}
                onChange={(e) => setCharacterId(e.target.value)}
              >
                <option value="">-- Select character --</option>
                {characters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.class})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="bottle__field">
            <span>Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Message title..."
            />
          </div>

          <div className="bottle__field">
            <span>Body</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message..."
              rows={4}
            />
          </div>

          {error && <div className="bottle__error">{error}</div>}

          <button
            type="submit"
            className="bottle__submit"
            disabled={submitting}
          >
            {submitting ? "Posting..." : "Post Message"}
          </button>
          <button
            type="button"
            className="bottle__back"
            onClick={() => {
              resetForm();
              setComposing(false);
            }}
          >
            Cancel
          </button>
        </form>
      )}

      {loading ? (
        <div className="bottle__loading">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="bottle__empty">No messages yet.</div>
      ) : (
        <div className="bottle__list">
          {messages.map((m) => (
            <div key={m.id} className="bottle__message">
              <div className="bottle__message-header">
                <div className="bottle__author">
                  {m.characters ? (
                    <>
                      <span className="bottle__author-name">
                        {m.characters.name}
                      </span>{" "}
                      — {m.characters.class}
                    </>
                  ) : (
                    <>
                      <span className="bottle__author-name">
                        {m.custom_name}
                      </span>
                      <span className="bottle__npc-tag">NPC</span>
                    </>
                  )}
                </div>
                {isAdmin && (
                  <button
                    className="bottle__delete"
                    onClick={() => handleDelete(m.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="bottle__message-title">{m.title}</div>
              <div className="bottle__message-body">{m.body}</div>
              <div className="bottle__time">{formatTime(m.created_at)}</div>
            </div>
          ))}
        </div>
      )}

      <button
        className="bottle__back"
        onClick={() => setPageCode("dashbd.000")}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}

export default BottlePage;
