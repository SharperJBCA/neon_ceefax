import { useState, useEffect, useRef } from "react";

function Header({ pageCode, setPageCode, content, onToggle, active }) {

    const [buffer, setBuffer] = useState("")
    const inputRef = useRef(null)

    useEffect(() => {
        if (active) {
            inputRef.current?.focus()
        } else {
            setBuffer("")
        }
    }, [active])

    function handleChange(e) {
        const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 6)
        setBuffer(digitsOnly)
        if (digitsOnly.length === 6) {
            const fullPath = digitsOnly + '.000'
            setPageCode(fullPath)
            setBuffer("")
            onToggle()
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && buffer.length === 6) {
            const fullPath = buffer + '.000'
            setPageCode(fullPath)
            setBuffer("")
            onToggle()
        }
        if (e.key === 'Escape') {
            onToggle()
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
                            ref={inputRef}
                            className="tt-input"
                            maxLength={6}
                            value={buffer}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
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
