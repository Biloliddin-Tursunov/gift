import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import "../styles/MacTerminal.css";

// 📝 GAPLAR
const MESSAGES = [
    "sudo initiate_protocol --heart",
    "Accessing secure memories...",
    "Loading... [██████████] 100%",
    "--------------------------------",
    "Sen men uchun alohida olamsan.",
];

// ⏱ YOZISH TEZLIGI (Kattaroq raqm = Sekinroq)
const TYPING_SPEED = 80;

const sectionStyle = {
    height: "100vh",
    width: "100vw",
    scrollSnapAlign: "start",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    overflow: "hidden",
};

const MacTerminal = () => {
    // --- STATE ---
    const [completedLines, setCompletedLines] = useState([]);
    const [currentLine, setCurrentLine] = useState("");
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);

    // --- REFS ---
    const scrollRef = useRef(null);
    const containerRef = useRef(null);

    // 🔥 MUHIM O'ZGARISH:
    // `once: false` qildik. Agar ekrandan chiqib ketsangiz, isInView = false bo'ladi.
    // `amount: 0.5` - Terminalning kamida 50% qismi ko'ringandagina ishlaydi.
    const isInView = useInView(containerRef, { once: false, amount: 0.5 });

    // --- TYPING LOGIC ---
    useEffect(() => {
        // Agar ekranda ko'rinmasa (boshqa joyga skroll qilsangiz), funksiya to'xtaydi.
        if (!isInView) return;

        if (lineIndex >= MESSAGES.length) return;

        const timeout = setTimeout(() => {
            const currentFullText = MESSAGES[lineIndex];

            if (charIndex < currentFullText.length) {
                setCurrentLine((prev) => prev + currentFullText[charIndex]);
                setCharIndex((prev) => prev + 1);
            } else {
                setCompletedLines((prev) => [...prev, currentFullText]);
                setCurrentLine("");
                setCharIndex(0);
                setLineIndex((prev) => prev + 1);
            }
        }, TYPING_SPEED); // 👈 Tezlik shu yerdan olinadi (150ms)

        return () => clearTimeout(timeout);
    }, [charIndex, lineIndex, isInView]); // isInView o'zgarganda effekt qayta ishlaydi

    // --- AUTO SCROLL ---
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentLine, completedLines]);

    return (
        <div style={sectionStyle} ref={containerRef}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                }}>
                <div className="mac-terminal">
                    <div className="terminal-header">
                        <div className="buttons">
                            <span className="btn red"></span>
                            <span className="btn yellow"></span>
                            <span className="btn green"></span>
                        </div>
                        <div className="terminal-title">
                            user — -zsh — 80x24
                        </div>
                    </div>

                    <div className="terminal-body" ref={scrollRef}>
                        <div className="terminal-content">
                            {completedLines.map((line, index) => (
                                <div key={index} className="command-line">
                                    <span className="prompt">➜ ~</span> {line}
                                </div>
                            ))}

                            {lineIndex < MESSAGES.length && (
                                <div className="command-line">
                                    <span className="prompt">➜ ~</span>{" "}
                                    {currentLine}
                                    <span className="cursor"></span>
                                </div>
                            )}

                            {lineIndex >= MESSAGES.length && (
                                <div className="command-line">
                                    <span className="prompt">➜ ~</span>
                                    <span className="cursor blink"></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MacTerminal;
