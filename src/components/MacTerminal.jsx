import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import "../styles/MacTerminal.css";

// 📜 NAME DEFINITION TEXT (Moved outside the component)
const BILOL_MEANING_TEXT = `
    "Bilal" (Arabic: بلال) is a name whose original meaning signifies "wetness," "moisture," "water," or "something that delights the soul." It originates from the verb "balal" (بلل), which means "to become wet" or "to moisten."

    In Islamic history, this name is most famously associated with Bilal ibn Rabah (r.a.) — one of the first slaves to embrace Islam, later known as the Muazzin (caller to prayer) of the Prophet Muhammad (peace be upon him).

    For this reason, the name "Bilal" is also used among Muslims as a symbol of loyalty, faith, patience, and purity.
    That is, this name spiritually carries the meaning of "moistening" the soul, which means giving faith and life.
`;

// 🔥 MODAL COMPONENT IS DECLARED OUTSIDE
const NameModal = ({ onClose }) => (
    <div className="custom-modal-overlay" onClick={onClose}>
        <motion.div
            className="custom-modal-content"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                <h3>Name Meaning: Bilal (بلال)</h3>
                <button className="close-btn" onClick={onClose}>
                    &times;
                </button>
            </div>
            <div className="modal-body">
                {/* Text is split by newline characters */}
                {BILOL_MEANING_TEXT.split("\n").map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                ))}
                <p className="modal-footer-text">
                    (Press the **Escape** key to close)
                </p>
            </div>
        </motion.div>
    </div>
);

// 📝 GAPLAR (O'zgarmadi)
const MESSAGES = [
    "sudo initiate_protocol --heart",
    "Accessing secure memories...",
    "Loading... [██████████] 100%",
    "--------------------------------",
    "~> ",
    "~> Hello, Jigar,",
    "~> Are you not tired?!",
    "~> I miss you very much.",
    "~> I miss our telepathic conversations.",
    "~> I miss you asking me various questions.",

    // 👇 YANGI QO'SHILGAN MAQTUV QISMI (Gap)
    "~> I have never met a person like you in my life.",
    "~> Who understands and supports me better than I understand myself.",
    "~> Who loves the world of animals and nature as much as you do.",
    "~> There are not many people in this world who treat everyone well and do good deeds equally.",
    // 👆 YANGI QO'SHILGAN MAQTUV QISMI (Gap)

    "~> Sometimes I wonder if you forgot me and are spending time with your other friends.",
    "~> Unfortunately, I couldn't visit your home country,",
    "~> and exchanging friendship bracelets was postponed until next year.",
    "~> The plans you made for me were also postponed.",
    "~> I am sorry for this. All the blame lies with my laziness and incompetence.",

    "~> I definitely promise to meet you.",
    "~> I don't know when, but we will meet.",

    "~> I want to tell you a truth.",
    "~> I recently met with a teacher from Arabia and asked the meaning of my name since it's Arabic.",
    "~> And my name is not 'New Moon' like it says on Google. Sorry, sorry, big sorry.",
    "~> To know its true meaning, press the Enter key.",

    "~> ",
    "~> System status: HAPPY ❤️",
];

// ⏱ YOZISH TEZLIGI
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

    // 🔥 MODAL STATE (O'zgarmadi)
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- REFS ---
    const scrollRef = useRef(null);
    const containerRef = useRef(null);

    const isInView = useInView(containerRef, { once: false, amount: 0.5 });

    // --- TYPING LOGIC (O'zgarmadi) ---
    useEffect(() => {
        // ... (Typing logic) ...
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
        }, TYPING_SPEED);

        return () => clearTimeout(timeout);
    }, [charIndex, lineIndex, isInView]);

    // 🔥 KEY LISTENER LOGIC (O'zgarmadi)
    useEffect(() => {
        const handleEnterPress = (event) => {
            // Agar Enter bosilsa VA Typing tugagan bo'lsa
            if (
                event.key === "Enter" &&
                isInView &&
                lineIndex >= MESSAGES.length
            ) {
                if (!isModalOpen) {
                    setIsModalOpen(true);
                }
            }
            // Agar Escape bosilsa, modalni yopish
            if (event.key === "Escape") {
                setIsModalOpen(false);
            }
        };

        window.addEventListener("keydown", handleEnterPress);
        return () => window.removeEventListener("keydown", handleEnterPress);
    }, [isInView, lineIndex, isModalOpen]);

    // --- AUTO SCROLL (O'zgarmadi) ---
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentLine, completedLines]);

    return (
        <div style={sectionStyle} ref={containerRef}>
            {/* 🔥 MODAL ENDI TASHQARIDAGI KOMPONENTGA MUROJAAT QILADI */}
            {isModalOpen && <NameModal onClose={() => setIsModalOpen(false)} />}

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
