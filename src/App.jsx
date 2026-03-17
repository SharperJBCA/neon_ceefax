import { useState } from "react";
import "./App.css";
import "./index.css";

import Landing from "./components/Landing";
import Help from "./components/Help";
import NotFound from "./components/NotFound"; 
import Header from "./components/Header"; 
import BasicPage from "./components/BasicPage";
import CosmicVoyage from "./components/CosmicVoyage";
import NeonCannons from "./components/NeonCannons";
import SystemPage from "./components/SystemPage";
import Thread from "./components/Thread";

import page001 from "./content/100000/001.page";

import voyagePages from "./content/voyage/000.page";
import neoncnPages from "./content/neoncn/000.page";
import thread_entries from "./content/threads/thread_entries";

function App() {
  const [pageCode, setPageCode] = useState("system.000");
  const [headerActive, setHeaderActive] = useState(false);

  const register = {
    "100000.000": { Component: Landing, content: null },
    "100000.001": { Component: BasicPage, content: page001 },
    "neoncn.000": { Component: NeonCannons, content: neoncnPages["landing"]},
    "voyage.000": { Component: CosmicVoyage, content: voyagePages["landing"]},
    "100002.001": { Component: CosmicVoyage, content: voyagePages["about"]},
    "100001.000": { Component: Help, content: null },
    "system.000": { Component: SystemPage, content: null },
    "system.aegir": { Component: SystemPage, content: null },
    "system.centis": { Component: SystemPage, content: null },
    "system.lo": { Component: SystemPage, content: null },
    "thread.000": { Component: Thread, content: thread_entries },
    "000000.000": { Component: NotFound, content: null}
  };

  const entry = register[pageCode] ?? register["000000.000"];
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
      />
    <div className="main crt flicker">
    <Component
      pageCode={pageCode}
      setPageCode={setPageCode}
      content={content}
    />
    </div>
    </div>
  );
}

export default App;