import { useState } from "react";
import "./auth.css";

function AuthPage({ user, signIn, signUp, setPageCode }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  // If already logged in, redirect to dashboard
  if (user) {
    setPageCode("dashbd.000");
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setBusy(true);

    if (mode === "signup") {
      const { error: err } = await signUp(email, password, displayName);
      if (err) {
        setError(err.message);
      } else {
        setPageCode("dashbd.000");
      }
    } else {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(err.message);
      } else {
        setPageCode("dashbd.000");
      }
    }
    setBusy(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <h1 className="auth-page__title">
          {mode === "login" ? "Crew Login" : "Crew Registration"}
        </h1>

        <form className="auth-page__form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <label className="auth-page__field">
              <span>Display Name</span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                autoComplete="name"
              />
            </label>
          )}

          <label className="auth-page__field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>

          <label className="auth-page__field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </label>

          {error && <div className="auth-page__error">{error}</div>}
          {message && <div className="auth-page__message">{message}</div>}

          <button className="auth-page__submit" type="submit" disabled={busy}>
            {busy
              ? "Processing..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        <button
          className="auth-page__toggle"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
            setMessage(null);
          }}
        >
          {mode === "login"
            ? "Need an account? Register"
            : "Already registered? Sign in"}
        </button>
      </div>
    </div>
  );
}

export default AuthPage;
