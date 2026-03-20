import { useState, useEffect, useRef } from "react";

function Header({ pageCode, setPageCode, content, onToggle, active, user, profile, role }) {

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
        const value = e.target.value.slice(0, 6).toLowerCase()
        setBuffer(value)
        if (value.length === 6) {
            const fullPath = value + '.000'
            setPageCode(fullPath)
            setBuffer("")
            onToggle()
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && buffer.length > 0) {
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
                            autoCapitalize="none"
                            autoCorrect="off"
                        />
                    </>
                ) : (
                    <>
                        {user ? (
                            <div className="tt-nav-links">
                                <button className="tt-nav-btn" onClick={() => setPageCode("dashbd.000")}>
                                    {profile?.display_name ?? "CREW"}
                                </button>
                                <button className="tt-nav-btn" onClick={() => setPageCode("gamesz.000")}>
                                    GAMES
                                </button>
                            </div>
                        ) : (
                            <button className="tt-nav-btn" onClick={() => setPageCode("authxx.000")}>
                                LOGIN
                            </button>
                        )}
                        <span className="tt-tap-hint" onClick={onToggle}>TAP TO TYPE</span>
                    </>
                )}
            </div>
        </header>
    )
}
export default Header
