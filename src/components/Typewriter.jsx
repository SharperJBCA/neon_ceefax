import { useRef, useState, useEffect } from "react";
import { useInView } from "motion/react";
import "./typewriter.css";

/**
 * Typewriter — scroll-triggered character-by-character text reveal.
 *
 * Wrap any text content:
 *   <Typewriter>Some text to type out</Typewriter>
 *   <Typewriter speed={30} cursor>Faster with blinking cursor</Typewriter>
 *
 * Props:
 *   speed   – ms per character (default 40)
 *   cursor  – show a blinking cursor while typing (default true)
 *   once    – only play once, don't re-type on re-enter (default false)
 *   tag     – wrapper element type (default "span")
 */
function Typewriter({
  children,
  speed = 40,
  cursor = true,
  once = false,
  tag: Tag = "span",
  style,
  className,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: "some" });
  const [charCount, setCharCount] = useState(0);
  const [done, setDone] = useState(false);

  // Extract the raw text from children (handles strings, numbers, nested spans)
  const fullText = extractText(children);

  useEffect(() => {
    if (!isInView) {
      if (!once) {
        setCharCount(0);
        setDone(false);
      }
      return;
    }

    if (charCount >= fullText.length) {
      setDone(true);
      return;
    }

    const timer = setTimeout(() => {
      setCharCount((c) => c + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isInView, charCount, fullText.length, speed, once]);

  const visibleText = fullText.slice(0, charCount);
  const showCursor = cursor && isInView && !done;

  return (
    <Tag
      ref={ref}
      style={{ whiteSpace: "pre-wrap", ...style }}
      className={className}
    >
      {visibleText}
      {showCursor && <span className="typewriter-cursor">|</span>}
    </Tag>
  );
}

// Recursively pull plain text out of React children
function extractText(node) {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node.props?.children) return extractText(node.props.children);
  return "";
}

export default Typewriter;
