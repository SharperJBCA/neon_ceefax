import { useState, useEffect } from "react";
import Typewriter from "../../components/Typewriter"
import "./auth.css";

function AuthPage({ user, signIn, signUp, resetPassword, setPageCode }) {
  const [mode, setMode] = useState("login"); // "login" | "signup" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);

  // Company slogans for cycling display
  const companySlogans = [
    "Capturing tomorrows history",
    "Looking after our heritage",
    "Uncovering Aegirs secrets",
    "Holding power to account",
    "Where truth matters"
  ];

  // Cycle through slogans every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSloganIndex(prev => (prev + 1) % companySlogans.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [companySlogans.length]);

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

    if (mode === "reset") {
      const { error: err } = await resetPassword(email);
      if (err) {
        setError(err.message);
      } else {
        setMessage("Password reset link sent — check your email.");
      }
    } else if (mode === "signup") {
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
      {/* Hyper Media Corp Header — above the login box */}
      {/* <div className="auth-page__company-header">
        <h1 className="auth-page__company-title">
          <Typewriter once>
            Hyper Media Corp
          </Typewriter>
        </h1>
        <p className="auth-page__company-slogan">
          <Typewriter key={currentSloganIndex} speed={30} cursor>
            {companySlogans[currentSloganIndex]}
          </Typewriter>
        </p>
      </div> */}

      <div className="auth-page__container">
        <h1 className="auth-page__title">
          <Typewriter>
          {mode === "login" ? "Crew Login" : mode === "signup" ? "Crew Registration" : "Password Reset"}
          </Typewriter>
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

          {mode !== "reset" && (
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
          )}

          {error && <div className="auth-page__error">{error}</div>}
          {message && <div className="auth-page__message">{message}</div>}

          <button className="auth-page__submit" type="submit" disabled={busy}>
            {busy
              ? "Processing..."
              : mode === "login"
                ? "Sign In"
                : mode === "signup"
                  ? "Create Account"
                  : "Send Reset Link"}
          </button>
        </form>

        {mode === "login" && (
          <button
            className="auth-page__toggle"
            onClick={() => { setMode("reset"); setError(null); setMessage(null); }}
          >
            Forgot password?
          </button>
        )}

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
