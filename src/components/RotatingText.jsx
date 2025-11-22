// RotatingText.jsx

import React, { useState, useEffect } from "react";
import "../styles/RotatingText.css";

// Almashinuvchi so'zlar va ularning ranglari
const WORD_DATA = [
    { word: "🐙🌸👽", color: "#8935dcff" }, // Qizil
    { word: "Chiume", color: "#17a2b8" }, // Zangori (Rasmdagi kabi)
    { word: "Jigar", color: "#ffc107" }, // Sariq
    { word: "Alien", color: "#007bff" }, // Moviy
    { word: "Habibi", color: "#dc3545" },
    { word: "Chichi", color: "#28a745" }, // Yashil
];

// Sozlamalar
const TYPE_SPEED = 100; // Harf terish tezligi (ms)
const ERASE_SPEED = 50; // Harf o'chirish tezligi (ms)
const PAUSE_TIME = 1500; // So'z to'liq terilgandan keyingi pauza (ms)

function RotatingText() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isTyping, setIsTyping] = useState(true); // Terish (true) yoki O'chirish (false) holati

    const { word: fullWord, color } = WORD_DATA[currentIndex];

    useEffect(() => {
        let timer;

        if (isTyping) {
            // TERISH BOSQICHI
            if (currentText.length < fullWord.length) {
                // Harf qo'shish
                timer = setTimeout(() => {
                    setCurrentText(fullWord.slice(0, currentText.length + 1));
                }, TYPE_SPEED);
            } else {
                // So'z to'liq terildi, pauza qilishga o'tish
                timer = setTimeout(() => {
                    setIsTyping(false); // O'chirishni boshlash
                }, PAUSE_TIME);
            }
        } else {
            // O'CHIRISH BOSQICHI
            if (currentText.length > 0) {
                // Harf o'chirish
                timer = setTimeout(() => {
                    setCurrentText(fullWord.slice(0, currentText.length - 1));
                }, ERASE_SPEED);
            } else {
                // So'z to'liq o'chirildi, keyingi so'zga o'tish
                setIsTyping(true); // Terishni boshlash
                setCurrentIndex(
                    (prevIndex) => (prevIndex + 1) % WORD_DATA.length
                );
            }
        }

        return () => clearTimeout(timer); // Komponent o'chirilganda timer'ni tozalash
    }, [currentIndex, currentText, isTyping, fullWord]); // Bu holatlar o'zgarganda qayta ishga tushadi

    return (
        <div className="center-container">
            <div className="rotating-text-wrapper">
                {/* HI so'zi - Qora va o'zgarmas */}
                <span className="hi-static">Hello</span>

                {/* Almashinuvchi so'z - Rangi va animatsiyasi o'zgaradi */}
                <span className="word-animated" style={{ color: color }}>
                    {currentText}
                    {/* Yoniq turuvchi (Blinking) kursor effekti */}
                    <span className="typing-cursor">|</span>
                </span>
            </div>
        </div>
    );
}

export default RotatingText;
