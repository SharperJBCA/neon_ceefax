import { useState } from "react";
import Typewriter from "../../components/Typewriter";
import "./auth.css";

function ResetPasswordPage({ updatePassword, setPageCode }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    const { error: err } = await updatePassword(password);
    if (err) {
      setError(err.message);
    } else {
      setPageCode("dashbd.000");
    }
    setBusy(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <h1 className="auth-page__title">
          <Typewriter>Set New Password</Typewriter>
        </h1>

        <form className="auth-page__form" onSubmit={handleSubmit}>
          <label className="auth-page__field">
            <span>New Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </label>

          <label className="auth-page__field">
            <span>Confirm Password</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </label>

          {error && <div className="auth-page__error">{error}</div>}

          <button className="auth-page__submit" type="submit" disabled={busy}>
            {busy ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
