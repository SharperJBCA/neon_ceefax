import React from "react";
import "./NeonCannons.css";

function NeonCannons({ content, setPageCode }) {
    const blocks = content?.blocks ?? [];
  
    return (
      <div className="page-wrapper">
        {blocks.map((b, i) => (
          <Block key={i} block={b} setPageCode={setPageCode} />
        ))}
      </div>
    );
  }

function Block({ block, setPageCode }) {
    switch (block.type) {
      case "image":
        return <img src={block.filename}></img>
      case "h1":
        return <h1 className="r-h1">{block.text}</h1>;
      case "h2":
        return <h2 className="r-h2">{block.text}</h2>;
      case "p":
        return <p className="r-p">{block.text}</p>;
      case "pre":
        return <pre>{block.text}</pre>;
      case "feed":
        return <div className={block.className}>
            {(block.items ?? []).map((it, idx) => (
                <Block key={idx} block={it} setPageCode={setPageCode} />
            ))}
        </div>
      case "callout":
        return (
          <div className="r-callout">
            {block.label ? <div className="r-callout__label">{block.label}</div> : null}
            <div className="r-callout__text">{block.text}</div>
          </div>
        );
        case "menu":
            return (
              <ul className="menu">
                {(block.items ?? []).map((it, idx) => (
                  <li className="menu-item" key={idx}>
                    <img src={it.filename} alt={it.title} />
                    <div className="menu-item-body">
                      <div className="menu-item-title">{it.title}</div>
                      <div className="menu-item-description">
                        {it.description}
                      </div>
                    </div>
                    <div className="menu-item-cost">{it.cost}</div>
                  </li>
                ))}
              </ul>
            );      
      case "links":
        return (
            <ul className='list-links'>
                {(block.items ?? []).map((it, idx) => (
                    <li key={idx}>
                <a
                href="#"
                onClick={() => it.to && setPageCode(it.to)}
                >
                <span className="dim">&gt;&gt;</span>{it.label}
                </a>
                </li>
                ))}
            </ul>
        );
      default:
        return null;
    }
}

export default NeonCannons;