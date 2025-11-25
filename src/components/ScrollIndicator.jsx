// src/components/ScrollIndicator.jsx

import React from "react";
import "../styles/ScrollIndicator.css";
import { AnimatePresence, motion } from "framer-motion";

const ScrollIndicator = ({ isVisible }) => {
    if (!isVisible) return null;

    // Scrollni keyingi ekran balandligigacha silliq tushirish
    const scrollToNext = () => {
        window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    };

    return (
        <AnimatePresence>
            <motion.div
                className="scroll-indicator"
                onClick={scrollToNext}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}>
                {/* CSS yordamida chizilgan strelka */}
                <div className="arrow"></div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ScrollIndicator;
