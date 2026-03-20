import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./admin.css";

function AdminPanel({ user, role, setPageCode }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!user) {
    setPageCode("authxx.000");
    return null;
  }

  if (role !== "admin") {
    setPageCode("dashbd.000");
    return null;
  }

  useEffect(() => {
    async function load() {
      const { data, error: err } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: true });
      if (err) {
        setError(err.message);
      } else {
        setUsers(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function changeRole(userId, newRole) {
    setError(null);
    const { error: err } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (err) {
      setError(err.message);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    }
  }

  return (
    <div className="admin">
      <div className="admin__title">Admin Panel</div>

      {error && <div className="admin__error">{error}</div>}

      {loading ? (
        <div className="admin__loading">Loading...</div>
      ) : (
        <div className="admin__user-list">
          {users.map((u) => (
            <div key={u.id} className="admin__user">
              <div className="admin__user-info">
                <span className="admin__user-name">{u.display_name}</span>
                <span className="admin__user-role">{u.role}</span>
              </div>
              <div className="admin__user-actions">
                {["player", "warden", "admin"].map((r) => (
                  <button
                    key={r}
                    className={`admin__role-btn ${u.role === r ? "is-active" : ""}`}
                    onClick={() => changeRole(u.id, r)}
                    disabled={u.role === r}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="admin__back"
        onClick={() => setPageCode("dashbd.000")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default AdminPanel;
