import { useState } from "react";
import "./App.css";
import "./index.css";

import Header from "./components/Header";
import registry from "./pages/registry";
import useAuth from "./lib/useAuth";

function App() {
  const [pageCode, setPageCode] = useState("system.000");
  const [headerActive, setHeaderActive] = useState(false);
  const { user, profile, role, loading, signIn, signUp, signOut } = useAuth();

  // Support dynamic routes like "chrctr.edit.<uuid>"
  let entry = registry[pageCode];
  if (!entry && pageCode.startsWith("chrctr.edit.")) {
    entry = registry["chrctr.001"]; // reuse edit page component
  }
  entry = entry ?? registry["000000.000"];
  const Component = entry.Component;
  const content = entry.content;

  return (
    <div className="app">
      <Header
        pageCode={pageCode}
        setPageCode={setPageCode}
        content={content}
        active={headerActive}
        onToggle={() => setHeaderActive((a) => !a)}
        user={user}
        profile={profile}
        role={role}
      />
    <div className="main crt flicker">
    {loading ? null : (
      <Component
        pageCode={pageCode}
        setPageCode={setPageCode}
        content={content}
        user={user}
        profile={profile}
        role={role}
        signIn={signIn}
        signUp={signUp}
        signOut={signOut}
      />
    )}
    </div>
    </div>
  );
}

export default App;
