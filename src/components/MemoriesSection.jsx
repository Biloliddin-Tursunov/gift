import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import "../styles/Memories.css";

// --- RASMLARNI AUTO-IMPORT ---
const imagesObj = import.meta.glob(
    "../assets/our_memories/*.{png,jpg,jpeg,JPG,PNG}",
    { eager: true }
);
const allImages = Object.values(imagesObj).map((mod) => mod.default);

// --- ALOHIDA QATOR KOMPONENTI (O'zgarmadi) ---
const MarqueeRow = ({ images, direction, onImageClick }) => {
    const repeatedImages = [...images, ...images, ...images, ...images];
    return (
        <div className="marquee-row">
            <div
                className={`marquee-track ${
                    direction === "left" ? "scroll-left" : "scroll-right"
                }`}>
                {repeatedImages.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt="memory"
                        className="memory-img"
                        onClick={(e) => {
                            e.stopPropagation();
                            onImageClick(src);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

// --- ASOSIY KOMPONENT ---
const MemoriesSection = () => {
    // --- STATE ---
    const [displayedText, setDisplayedText] = useState("");
    const [showImages, setShowImages] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    // 🔥 YANGI: Typing faqat bir marta ishlashi uchun state
    const [hasStartedTyping, setHasStartedTyping] = useState(false);

    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.5 });

    const fullText = "Memories related to you, those that are stored.";

    // --- 🔥 MANTIQ (Tuzatilgan Typing) ---
    useEffect(() => {
        // 1. Agar ko'rinmasa, yoki rasmlar chiqqan bo'lsa, yoki typing boshlangan bo'lsa -> TO'XTA
        if (!isInView || showImages || hasStartedTyping) return;

        // 2. Boshlangani haqida belgi qo'yamiz
        setHasStartedTyping(true);

        let currentIndex = 0;

        // 3. Rekursiv funksiya (Harflarni bittalab qo'shish)
        const typeNextChar = () => {
            if (currentIndex < fullText.length) {
                // Keyingi harfni qo'shamiz (current index asosida)
                const char = fullText.charAt(currentIndex);
                setDisplayedText((prev) => prev + char);
                currentIndex++;

                // Keyingi harf uchun vaqt belgilaymiz (100ms)
                setTimeout(typeNextChar, 100);
            } else {
                // Matn tugadi. 2 soniya kutib, rasmlarni chiqaramiz.
                setTimeout(() => {
                    setShowImages(true);
                }, 2000);
            }
        };

        // Typingni boshlash
        typeNextChar();
    }, [isInView, showImages, hasStartedTyping]);
    // Dependency arrayga e'tibor bering: faqat kerakli narsalar bor.

    // Rasmlarni 3 qatorga bo'lish (O'zgarmadi)
    const rows = useMemo(() => {
        const row1 = [],
            row2 = [],
            row3 = [];
        allImages.forEach((img, index) => {
            if (index % 3 === 0) row1.push(img);
            else if (index % 3 === 1) row2.push(img);
            else row3.push(img);
        });
        return { row1, row2, row3 };
    }, []);

    return (
        // 🔥 Ref shu yerga ulangan bo'lishi SHART
        <div className="memories-container" ref={containerRef}>
            <AnimatePresence mode="wait">
                {/* 1-BOSQICH: MATN */}
                {!showImages && (
                    <motion.h1
                        key="intro-text"
                        className="intro-text"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
                        transition={{ duration: 0.8 }}>
                        {displayedText.split("\n").map((line, i) => (
                            <span key={i} style={{ display: "block" }}>
                                {line}
                                {/* Kursor faqat yozilayotganda ko'rinadi */}
                                {i === 1 && !showImages && (
                                    <span className="typing-cursor">|</span>
                                )}
                            </span>
                        ))}
                    </motion.h1>
                )}

                {/* 2-BOSQICH: RASMLAR */}
                {showImages && (
                    <motion.div
                        key="image-grid"
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            padding: "10px 0",
                        }}
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}>
                        <MarqueeRow
                            images={rows.row1}
                            direction="left"
                            onImageClick={setSelectedImage}
                        />
                        <MarqueeRow
                            images={rows.row2}
                            direction="right"
                            onImageClick={setSelectedImage}
                        />
                        <MarqueeRow
                            images={rows.row3}
                            direction="left"
                            onImageClick={setSelectedImage}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3-BOSQICH: KATTA RASM (MODAL) */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}>
                        <motion.img
                            src={selectedImage}
                            className="modal-img"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 300,
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MemoriesSection;
