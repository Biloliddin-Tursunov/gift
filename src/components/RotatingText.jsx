// src/components/RotatingText.jsx

import React, { useState, useEffect } from "react";
import "../styles/RotatingText.css";

const WORD_DATA = [
    { word: "ALIEN", color: "#8935dc" },
    { word: "CHIUME", color: "#17a2b8" },
    { word: "JIGAR", color: "#ffc107" },
    { word: "HABIBI", color: "#dc3545" },
    { word: "CHICHI", color: "#28a745" },
];

const TYPE_SPEED = 120;
const ERASE_SPEED = 60;
const PAUSE_TIME = 1500;

function RotatingText() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    const { word: fullWord, color } = WORD_DATA[currentIndex];

    useEffect(() => {
        let timer;

        if (isTyping) {
            // TERISH BOSQICHI
            if (currentText.length < fullWord.length) {
                timer = setTimeout(() => {
                    setCurrentText(fullWord.slice(0, currentText.length + 1));
                }, TYPE_SPEED);
            } else {
                // Pauza
                timer = setTimeout(() => {
                    setIsTyping(false);
                }, PAUSE_TIME);
            }
        } else {
            // O'CHIRISH BOSQICHI
            if (currentText.length > 0) {
                timer = setTimeout(() => {
                    setCurrentText(fullWord.slice(0, currentText.length - 1));
                }, ERASE_SPEED);
            } else {
                // ✅ Xatosiz o'tish mantiqi: setTimeout 0ms bilan ishlatiladi
                timer = setTimeout(() => {
                    setIsTyping(true);
                    setCurrentIndex(
                        (prevIndex) => (prevIndex + 1) % WORD_DATA.length
                    );
                }, 0);
            }
        }

        return () => clearTimeout(timer);
    }, [currentIndex, currentText, isTyping, fullWord]);

    return (
        <div className="center-container">
            <div className="rotating-text-wrapper">
                {/* Rasmdagi kabi "HI" so'zi */}
                <span className="hi-static">Hi</span>
                <span className="word-animated" style={{ color: color }}>
                    {currentText}
                    {/* Yaltiroq kursor */}
                    <span className="typing-cursor"></span>
                </span>
            </div>
        </div>
    );
}

export default RotatingText;
