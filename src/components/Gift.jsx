import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Gift.css";

// Komponentlar
import RotatingText from "./RotatingText";
import MacTerminal from "./MacTerminal";
import MemoriesSection from "./MemoriesSection";

// --- RASMLARNI AUTO-IMPORT (Preload uchun) ---
const imagesObj = import.meta.glob(
    "../assets/our_memories/*.{png,jpg,jpeg,JPG,PNG}",
    { eager: true }
);
const allImageUrls = Object.values(imagesObj).map((mod) => mod.default);

// --- YUKLASH EKRANI KOMPONENTI ---
const LoadingScreen = ({ progress }) => {
    return (
        <motion.div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "#000",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
                color: "white",
                fontFamily: "'Courier New', monospace",
            }}
            exit={{ opacity: 0, y: -50 }} // Yuklash tugasa tepaga chiqib ketadi
            transition={{ duration: 0.8 }}>
            <motion.div
                style={{
                    fontSize: "4rem",
                    fontWeight: "bold",
                    marginBottom: "20px",
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}>
                {progress}%
            </motion.div>
            <p style={{ opacity: 0.7 }}>Xotiralar yuklanmoqda...</p>

            {/* Progress bar chizig'i */}
            <div
                style={{
                    width: "200px",
                    height: "4px",
                    background: "#333",
                    marginTop: "15px",
                    borderRadius: "2px",
                }}>
                <motion.div
                    style={{
                        height: "100%",
                        background: "#fff",
                        borderRadius: "2px",
                    }}
                    animate={{ width: `${progress}%` }}
                />
            </div>
        </motion.div>
    );
};

function Gift() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    // --- RASMLARNI PRELOAD QILISH MANTIQI ---
    useEffect(() => {
        let loadedCount = 0;
        const totalImages = allImageUrls.length;

        if (totalImages === 0) {
            setIsLoading(false);
            return;
        }

        allImageUrls.forEach((src) => {
            const img = new Image();
            img.src = src;

            // Har bir rasm yuklanganda hisoblaymiz
            img.onload = () => {
                loadedCount++;
                const percentage = Math.round(
                    (loadedCount / totalImages) * 100
                );
                setProgress(percentage);

                if (loadedCount === totalImages) {
                    // Hammasi yuklangach, ozgina kutib ochamiz (silliq bo'lishi uchun)
                    setTimeout(() => setIsLoading(false), 800);
                }
            };

            // Agar rasm yuklanmasa ham (xato bersa), baribir davom etsin
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === totalImages) setIsLoading(false);
            };
        });
    }, []);

    return (
        <>
            <AnimatePresence>
                {isLoading && <LoadingScreen progress={progress} />}
            </AnimatePresence>

            {!isLoading && (
                <motion.div
                    className="gift-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}>
                    {/* 1-Section */}
                    <div
                        style={{
                            height: "100vh",
                            width: "100vw",
                            scrollSnapAlign: "start",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#282c34",
                        }}>
                        <RotatingText />
                    </div>
                    {/* 2-Section */}
                    <MemoriesSection />

                    {/* 3-Section */}
                    <MacTerminal />
                </motion.div>
            )}
        </>
    );
}

export default Gift;
