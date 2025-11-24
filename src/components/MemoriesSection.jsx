import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import "../styles/Memories.css";

// --- MARQUEE ROW (Qatorlar komponenti) ---
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
                            e.stopPropagation(); // Bosilganda modal yopilib ketmasligi uchun
                            onImageClick(src);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

// --- ASOSIY KOMPONENT ---
// allImages prop sifatida keladi
const MemoriesSection = ({ allImages }) => {
    // --- STATE ---
    const [displayedText, setDisplayedText] = useState("");
    const [showImages, setShowImages] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [hasStartedTyping, setHasStartedTyping] = useState(false);

    // Refni konteynerga ulash
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.5 });

    const fullText = "Memories related to you, those that are stored.";

    // --- TYPING MANTIQI ---
    useEffect(() => {
        if (!isInView || showImages || hasStartedTyping) return;

        setHasStartedTyping(true);

        let currentIndex = 0;

        const typeNextChar = () => {
            if (currentIndex < fullText.length) {
                const char = fullText.charAt(currentIndex);
                setDisplayedText((prev) => prev + char);
                currentIndex++;
                setTimeout(typeNextChar, 100);
            } else {
                setTimeout(() => {
                    setShowImages(true);
                }, 2000);
            }
        };

        typeNextChar();
    }, [isInView, showImages, hasStartedTyping]); // dependencyga faqat keraklilarni qo'shdik

    // --- RASMLARNI BO'LISH ---
    const rows = useMemo(() => {
        const row1 = [],
            row2 = [],
            row3 = [];
        // allImages prop bo'sh kelishi mumkin, shuning uchun tekshiramiz
        if (allImages && allImages.length > 0) {
            allImages.forEach((img, index) => {
                if (index % 3 === 0) row1.push(img);
                else if (index % 3 === 1) row2.push(img);
                else row3.push(img);
            });
        }
        return { row1, row2, row3 };
    }, [allImages]);

    return (
        // 🔥 Refni shu yerga ulash shart!
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
                                {i === 1 && !showImages && (
                                    <span className="typing-cursor"></span>
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
                            // Gap kerak emas, chunki CSSda joylashtirganmiz
                            padding: "0",
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

            {/* 3-BOSQICH: MODAL */}
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
