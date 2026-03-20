import React from "react";
import Block from "../../components/Block";
import "./neoncn.css";

function NeonCannonsPage({ content, setPageCode }) {
  const blocks = content?.blocks ?? [];

  return (
    <div className="neoncn">
      <div className="neoncn__wrapper">
        {blocks.map((b, i) => (
          <Block key={i} block={b} setPageCode={setPageCode} />
        ))}
      </div>
    </div>
  );
}

export default NeonCannonsPage;
