import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Gift.css";
import "../styles/ScrollIndicator.css";

// Komponentlar
import RotatingText from "./RotatingText";
import MacTerminal from "./MacTerminal";
import MemoriesSection from "./MemoriesSection";
import DeepSeaSection from "./DeepSeaSection";
import MessageSection from "./MessageSection";
import ScrollIndicator from "./ScrollIndicator";

// --- RASMLARNI AUTO-IMPORT (Preload uchun) ---
const imagesObj = import.meta.glob(
    "../assets/our_memories/*.{png,jpg,jpeg,JPG,PNG}",
    { eager: true }
);
const allImageUrls = Object.values(imagesObj).map((mod) => mod.default);

// --- YUKLASH EKRANI ---
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
            exit={{ opacity: 0, y: -50 }}
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
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [totalSections, setTotalSections] = useState(0);

    const containerRef = useRef(null);

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

            img.onload = () => {
                loadedCount++;
                const percentage = Math.round(
                    (loadedCount / totalImages) * 100
                );
                setProgress(percentage);

                if (loadedCount === totalImages) {
                    setTimeout(() => setIsLoading(false), 800);
                }
            };

            img.onerror = () => {
                loadedCount++;
                if (loadedCount === totalImages) setIsLoading(false);
            };
        });
    }, []);

    // --- SECTIONLARNI KUZATISH (IntersectionObserver) ---
    useEffect(() => {
        if (!containerRef.current) return;

        const sections = containerRef.current.querySelectorAll(".section");
        setTotalSections(sections.length);

        if (sections.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.6, // sectionning 60% ko'rinsa indeks o'zgaradi
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const idx = Array.from(sections).indexOf(entry.target);
                    if (idx !== -1) {
                        setCurrentSectionIndex(idx);
                    }
                }
            });
        }, observerOptions);

        sections.forEach((sec) => observer.observe(sec));

        return () => {
            observer.disconnect();
        };
    }, [isLoading]); // loading tugagach sectionlar DOMda bo'ladi va observer ishlaydi

    return (
        <>
            <AnimatePresence>
                {isLoading && <LoadingScreen progress={progress} />}
            </AnimatePresence>

            {!isLoading && (
                <motion.div
                    ref={containerRef}
                    className="gift-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}>
                    {/* Har bir section .section bilan o'ralgan va 100vh bo'lishi kerak */}
                    <div
                        className="section"
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

                    <div
                        className="section"
                        style={{ height: "100vh", width: "100vw" }}>
                        <MemoriesSection allImages={allImageUrls} />
                    </div>

                    <div
                        className="section"
                        style={{ height: "100vh", width: "100vw" }}>
                        <DeepSeaSection />
                    </div>

                    <div
                        className="section"
                        style={{ height: "100vh", width: "100vw" }}>
                        <MacTerminal />
                    </div>

                    <div
                        className="section"
                        style={{ height: "100vh", width: "100vw" }}>
                        <MessageSection />
                    </div>

                    {/* ScrollIndicator faqat oxirgi sectiondan oldin ko'rinadi */}
                    <ScrollIndicator
                        isVisible={currentSectionIndex < totalSections - 1}
                    />
                </motion.div>
            )}
        </>
    );
}

export default Gift;
