import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./missions.css";

function MissionCreatePage({ user, role, setPageCode }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [pageCodesInput, setPageCodesInput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!user) {
    setPageCode("authxx.000");
    return null;
  }

  if (role !== "admin" && role !== "warden") {
    setPageCode("dashbd.000");
    return null;
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const tags = tagsInput
      .trim()
      .split(/\s+/)
      .filter((t) => t.length > 0);

    const pageCodes = pageCodesInput
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const { error: err } = await supabase.from("missions").insert({
      title: title.trim(),
      description: description.trim() || null,
      tags,
      page_codes: pageCodes,
    });

    if (err) {
      setError(err.message);
      setBusy(false);
    } else {
      setPageCode("missnz.000");
    }
  }

  return (
    <div className="missions">
      <div className="missions__title">Create Mission</div>

      <form className="missions__form" onSubmit={handleCreate}>
        <label className="missions__field">
          <span>Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label className="missions__field">
          <span>Description (optional)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </label>

        <label className="missions__field">
          <span>Tags (space-separated, e.g. //deepspace //alien)</span>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="//deepspace //alien"
          />
        </label>

        <label className="missions__field">
          <span>Page Codes (comma-separated, optional)</span>
          <input
            type="text"
            value={pageCodesInput}
            onChange={(e) => setPageCodesInput(e.target.value)}
            placeholder="voyage.000, system.aegir"
          />
        </label>

        {error && <div className="missions__error">{error}</div>}

        <button className="missions__submit" type="submit" disabled={busy}>
          {busy ? "Creating..." : "Create Mission"}
        </button>
      </form>

      <button
        className="missions__back"
        onClick={() => setPageCode("missnz.000")}
      >
        Cancel
      </button>
    </div>
  );
}

export default MissionCreatePage;
