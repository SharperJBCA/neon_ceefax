import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import classes from "../../data/classes";
import skills from "../../data/skills";
import "./characters.css";

const STAT_FIELDS = [
  { key: "strength",   label: "Strength" },
  { key: "speed",      label: "Speed" },
  { key: "intellect",  label: "Intellect" },
  { key: "combat",     label: "Combat" },
  { key: "sanity",     label: "Sanity" },
  { key: "fear",       label: "Fear" },
  { key: "body",       label: "Body" },
  { key: "max_health", label: "Max Health" },
  { key: "wounds",     label: "Wounds" },
  { key: "stress",     label: "Stress" },
  { key: "credits",    label: "Credits" },
];

function CharacterEditPage({ user, pageCode, setPageCode }) {
  // If pageCode is "chrctr.edit.<uuid>" we're editing, otherwise creating
  const editId = pageCode.startsWith("chrctr.edit.") ? pageCode.slice(12) : null;
  const isEdit = Boolean(editId);

  const [name, setName] = useState("");
  const [charClass, setCharClass] = useState(classes[0].id);
  const [isDead, setIsDead] = useState(false);
  const [deathDescription, setDeathDescription] = useState("");
  const [stats, setStats] = useState({});
  const [trainedSkills, setTrainedSkills] = useState([]);
  const [expertSkills, setExpertSkills] = useState([]);
  const [masterSkills, setMasterSkills] = useState([]);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loadingChar, setLoadingChar] = useState(isEdit);

  if (!user) {
    setPageCode("authxx.000");
    return null;
  }

  // Load existing character data for edit mode
  useEffect(() => {
    if (!editId) return;
    async function load() {
      const { data, error: err } = await supabase
        .from("characters")
        .select("*")
        .eq("id", editId)
        .single();
      if (err || !data) {
        setError("Character not found.");
        setLoadingChar(false);
        return;
      }
      setName(data.name);
      setCharClass(data.class || classes[0].id);
      setIsDead(data.is_dead);
      setDeathDescription(data.death_description || "");
      setTrainedSkills(data.trained_skills || []);
      setExpertSkills(data.expert_skills || []);
      setMasterSkills(data.master_skills || []);
      const s = {};
      STAT_FIELDS.forEach((f) => {
        if (data[f.key] != null) s[f.key] = data[f.key];
      });
      setStats(s);
      setLoadingChar(false);
    }
    load();
  }, [editId]);

  function toggleSkill(list, setList, skillId) {
    setList((prev) =>
      prev.includes(skillId)
        ? prev.filter((s) => s !== skillId)
        : [...prev, skillId]
    );
  }

  function setStat(key, value) {
    setStats((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : parseInt(value, 10),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    setBusy(true);

    const payload = {
      name: name.trim(),
      class: charClass,
      is_dead: isDead,
      death_description: isDead ? deathDescription.trim() || null : null,
      trained_skills: trainedSkills,
      expert_skills: expertSkills,
      master_skills: masterSkills,
    };

    // Include stats
    STAT_FIELDS.forEach((f) => {
      payload[f.key] = stats[f.key] ?? null;
    });

    let err;
    if (isEdit) {
      ({ error: err } = await supabase
        .from("characters")
        .update(payload)
        .eq("id", editId));
    } else {
      payload.user_id = user.id;
      ({ error: err } = await supabase.from("characters").insert(payload));
    }

    if (err) {
      setError(err.message);
      setBusy(false);
    } else {
      setPageCode("chrctr.000");
    }
  }

  if (loadingChar) {
    return (
      <div className="chars">
        <div className="chars__title">Loading...</div>
      </div>
    );
  }

  return (
    <div className="chars">
      <div className="chars__title">
        {isEdit ? "Edit Character" : "Create Character"}
      </div>

      <form className="chars__form" onSubmit={handleSubmit}>
        <label className="chars__field">
          <span>Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="chars__field">
          <span>Class</span>
          <select
            value={charClass}
            onChange={(e) => setCharClass(e.target.value)}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        {isEdit && (
          <div className="chars__death-section">
            <label className="chars__checkbox-field">
              <input
                type="checkbox"
                checked={isDead}
                onChange={(e) => setIsDead(e.target.checked)}
              />
              <span>Character is Dead</span>
            </label>
            {isDead && (
              <label className="chars__field">
                <span>Cause of Death</span>
                <input
                  type="text"
                  value={deathDescription}
                  onChange={(e) => setDeathDescription(e.target.value)}
                  placeholder="How did they die?"
                />
              </label>
            )}
          </div>
        )}

        <StatsSection stats={stats} setStat={setStat} />

        <SkillPicker
          label="Trained Skills"
          selected={trainedSkills}
          onToggle={(id) => toggleSkill(trainedSkills, setTrainedSkills, id)}
        />

        <SkillPicker
          label="Expert Skills"
          selected={expertSkills}
          onToggle={(id) => toggleSkill(expertSkills, setExpertSkills, id)}
        />

        <SkillPicker
          label="Master Skills"
          selected={masterSkills}
          onToggle={(id) => toggleSkill(masterSkills, setMasterSkills, id)}
        />

        {error && <div className="chars__error">{error}</div>}

        <button className="chars__submit" type="submit" disabled={busy}>
          {busy
            ? isEdit
              ? "Saving..."
              : "Creating..."
            : isEdit
              ? "Save Changes"
              : "Create Character"}
        </button>
      </form>

      <button
        className="chars__back"
        onClick={() => setPageCode("chrctr.000")}
      >
        Cancel
      </button>
    </div>
  );
}

function StatsSection({ stats, setStat }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="chars__skill-picker">
      <button
        type="button"
        className="chars__skill-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        Stats {expanded ? "▾" : "▸"}
      </button>
      {expanded && (
        <div className="chars__stats-grid">
          {STAT_FIELDS.map((f) => (
            <label key={f.key} className="chars__stat-field">
              <span>{f.label}</span>
              <input
                type="number"
                value={stats[f.key] ?? ""}
                onChange={(e) => setStat(f.key, e.target.value)}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function SkillPicker({ label, selected, onToggle }) {
  const [expanded, setExpanded] = useState(false);

  // "Trained Skills" -> "trained_skills", "Expert Skills" -> "expert_skills", etc.
  const skillListId = label.toLowerCase().replace(/ /g, "_");
  const skillList = skills[skillListId] || [];

  return (
    <div className="chars__skill-picker">
      <button
        type="button"
        className="chars__skill-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        {label} ({selected.length}){" "}
        {expanded ? "▾" : "▸"}
      </button>
      {expanded && (
        <div className="chars__skill-grid">
          {skillList.map((s) => (
            <div key={s.id} className="chars__skill-chip-wrapper">
              <button
                type="button"
                className={`chars__skill-chip ${selected.includes(s.id) ? "is-selected" : ""}`}
                onClick={() => onToggle(s.id)}
              >
                {s.name}
              </button>
              {s.hover && (
                <span className="chars__skill-tooltip">{s.hover}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CharacterEditPage;
