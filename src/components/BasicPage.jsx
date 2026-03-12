import React from "react";
import "./BasicPage.css";

function BasicPage({ pageCode, setPageCode, content }) {
  const page = content ?? {
    title: "Untitled",
    updated: "—",
    blocks: [{ type: "p", text: "No content loaded for this page." }],
  };

  return (
    <div className="page">
      <header className="page__header">
        <div className="page__title">{page.title}</div>
        <div className="page__meta">
          <span>PAGE {pageCode}</span>
          <span>LAST UPDATED {page.updated}</span>
        </div>
      </header>

      <main className="page__body">
        {page.blocks?.map((b, i) => (
          <Block key={i} block={b} setPageCode={setPageCode} />
        ))}
      </main>

      <footer className="page__footer">
        <span>© 2001 Prospero Station</span>
        <span>BEST VIEWED 800×600</span>
      </footer>
    </div>
  );
}

function Block({ block, setPageCode }) {
  switch (block.type) {
    case "h1":
      return <h1 className="r-h1">{block.text}</h1>;
    case "h2":
      return <h2 className="r-h2">{block.text}</h2>;
    case "p":
      return <p className="r-p">{block.text}</p>;
    case "callout":
      return (
        <div className="r-callout">
          {block.label ? <div className="r-callout__label">{block.label}</div> : null}
          <div className="r-callout__text">{block.text}</div>
        </div>
      );
    case "links":
      return (
        <ul className="r-links">
          {(block.items ?? []).map((it, idx) => (
            <li key={idx}>
              <button
                className="r-link"
                onClick={() => it.to && setPageCode(it.to)}
              >
                {it.label}
              </button>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export default BasicPage;