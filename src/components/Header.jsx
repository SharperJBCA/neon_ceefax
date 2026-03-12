import {React, useState} from "react";

function Header({pageCode, setPageCode, content, onToggle, active}) {

    const [partialCode, setPartialCode] = useState("ENTER PAGE ▶")
    const [buffer, setBuffer] = useState("")

    function handleChange(e) {
        const digitsOnly = e.target.value //.replace(/D/g,"").slice(0,6)
        setBuffer(digitsOnly) 
        if (digitsOnly.length === 6) {
            const fullPath = digitsOnly + '.000' // go to head page
            setPageCode(fullPath)
            setBuffer("")
        }
    }

    const subPageCode = pageCode.substring(0, pageCode.lastIndexOf('.'));

    return (
    <header className={`tt-header ${active ? "is-active" : ""}`} onClick={onToggle}>
        <div className="tt-header__left">PAGE {subPageCode}</div>
        <div className="tt-header__right" onClick={(e) => e.stopPropagation()}>
            {active ? ( 
                <>
                    <span className="tt-prompt">ENTER PAGE ▶</span>
                    <span className="tt-buffer">{buffer.padEnd(6, "•")}</span>
                    <input 
                        className="tt-input"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={buffer}
                        onChange={handleChange}
                    />
                </>
            ) : (
                "TAP TO TYPE"
            )}
        </div>
    </header>
    )
}
export default Header