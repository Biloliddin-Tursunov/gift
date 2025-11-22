// src/components/Verification.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import "../styles/Verification.css";

const SECRET_EMAIL = "sennoume@icloud.com";

// 🌟 FAQAT ISHLOVCHI 3 TA STIKER 🌟
const BASE_ICONS = [
    "https://cdn.jsdelivr.net/gh/Tarikul-Islam-Anik/Animated-Fluent-Emojis@master/Emojis/Animals/Octopus.png",
    "https://cdn.jsdelivr.net/gh/Tarikul-Islam-Anik/Animated-Fluent-Emojis@master/Emojis/Travel%20and%20places/Crescent%20Moon.png",
    "https://cdn.jsdelivr.net/gh/Tarikul-Islam-Anik/Animated-Fluent-Emojis@master/Emojis/Smilies/Alien.png",
];

// 🖼 ALOHIDA STIKER KOMPONENTI (Kursorni his qilish uchun)
function StickerItem({ sticker, mouseX, mouseY }) {
    // Kursor pozitsiyasidan kelib chiqib, stikerning joylashuvini o'zgartiramiz (Parallax)
    const x = useTransform(
        mouseX,
        [0, 1920],
        [-100 * sticker.parallaxSpeed, 100 * sticker.parallaxSpeed]
    );
    const y = useTransform(
        mouseY,
        [0, 1080],
        [-100 * sticker.parallaxSpeed, 100 * sticker.parallaxSpeed]
    );

    return (
        <motion.img
            src={sticker.url}
            alt="sticker"
            className="floating-icon"
            style={{
                ...sticker.initialStyle,
                x: x,
                y: y,
                // Stiker o'lchamini kichraytirish (oldin 90/70 edi, endi 70/50)
                width: sticker.initialStyle.width === "90px" ? "70px" : "50px",
            }}
        />
    );
}

function Verification({ setIsVerified }) {
    const [inputEmail, setInputEmail] = useState("");
    const [error, setError] = useState("");
    const [shake, setShake] = useState(false);
    const navigate = useNavigate();

    // 🖱 KURSORNI HISOBLASH QISMI
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        // Ekranning yuqori chap burchagidan kursor joylashuvini olamiz
        mouseX.set(event.clientX - rect.left);
        mouseY.set(event.clientY - rect.top);
    };

    // 💾 STIKERLARNI KICHRAYTIRISH VA MARKAZDAN QOCHIRISH (useState logic)
    const [stickers] = useState(() => {
        const duplicatedIcons = [
            ...BASE_ICONS,
            ...BASE_ICONS,
            ...BASE_ICONS,
            ...BASE_ICONS,
        ];

        return duplicatedIcons.map((url, index) => {
            // Joylashuvni markazdan qochirish logikasi: (0-25% yoki 75-95% oralig'i)
            const randomSideX = Math.random();
            const leftPos =
                randomSideX < 0.5
                    ? Math.floor(Math.random() * 25) + "%" // Chap tomon
                    : Math.floor(Math.random() * 20 + 75) + "%"; // O'ng tomon (95% dan oshmasligi uchun)

            const randomSideY = Math.random();
            const topPos =
                randomSideY < 0.5
                    ? Math.floor(Math.random() * 25) + "%" // Yuqori tomon
                    : Math.floor(Math.random() * 20 + 75) + "%"; // Past tomon

            return {
                id: index,
                url: url,
                initialStyle: {
                    left: leftPos,
                    top: topPos,
                    animationDelay: Math.random() * 5 + "s",
                    width: index % 3 === 0 ? "90px" : "70px", // Keyinchalik StickerItem da kichraytiramiz
                },
                parallaxSpeed:
                    (index % 2 === 0 ? 0.05 : 0.08) *
                    (index % 3 === 0 ? -1 : 1),
            };
        });
    });

    const handleVerification = () => {
        if (
            inputEmail.toLowerCase().trim() ===
            SECRET_EMAIL.toLowerCase().trim()
        ) {
            // ✅ YANGI QOSHILGAN QISM:
            // Brauzer xotirasiga (session) "tasdiqlandi" deb yozib qo'yamiz
            sessionStorage.setItem("isVerified", "true");

            setIsVerified(true);
            navigate("/gift");
        } else {
            setError("Access Denied. Incorrect Email.");
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleVerification();
    };

    return (
        // mouseMove hodisasini shu konteynerda ushlaymiz
        <motion.div
            className="verification-container"
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.6 }}>
            {/* 1. Orqa fon stikerlari */}
            <div className="icons-background">
                {stickers.map((sticker) => (
                    <StickerItem
                        key={sticker.id}
                        sticker={sticker}
                        mouseX={mouseX}
                        mouseY={mouseY}
                    />
                ))}
            </div>

            {/* 2. PREMIUM KARTA (Input section joylashtirildi) */}
            <div
                className={`premium-glass-card ${
                    shake ? "shake-animation" : ""
                }`}>
                <div className="card-header">
                    <div className="lock-icon-wrapper">
                        <span className="lock-icon">🔒</span>
                    </div>
                </div>

                <h1>Restricted Access</h1>
                <p className="subtitle">
                    Verification required to view this content.
                </p>

                {/* INPUT SECTION */}
                <div className="input-group">
                    <input
                        type="email"
                        value={inputEmail}
                        onChange={(e) => {
                            setInputEmail(e.target.value);
                            setError("");
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="name@example.com"
                        className={error ? "input-error" : ""}
                    />
                </div>

                <button onClick={handleVerification} className="verify-btn">
                    Verify Identity
                </button>

                {error && <p className="error-msg">{error}</p>}
            </div>
        </motion.div>
    );
}

export default Verification;
