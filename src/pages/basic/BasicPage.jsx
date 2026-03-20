import React from "react";
import Block from "../../components/Block";
import "./basic.css";

function BasicPage({ pageCode, setPageCode, content }) {
  const page = content ?? {
    title: "Untitled",
    updated: "—",
    blocks: [{ type: "p", text: "No content loaded for this page." }],
  };

  return (
    <div className="basic">
      <header className="basic__header">
        <div className="basic__title">{page.title}</div>
        <div className="basic__meta">
          <span>PAGE {pageCode}</span>
          <span>LAST UPDATED {page.updated}</span>
        </div>
      </header>

      <main className="basic__body">
        {page.blocks?.map((b, i) => (
          <Block key={i} block={b} setPageCode={setPageCode} />
        ))}
      </main>

      <footer className="basic__footer">
        <span>© 2001 Prospero Station</span>
        <span>BEST VIEWED 800×600</span>
      </footer>
    </div>
  );
}

export default BasicPage;
