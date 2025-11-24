import React from "react";
import { motion } from "framer-motion";

// Komponentlar
import RotatingText from "./RotatingText";
import MacTerminal from "./MacTerminal";
import "../styles/Gift.css";
import MemoriesSection from "./MemoriesSection";

const rotatingSectionStyle = {
    height: "100vh",
    width: "100vw",
    scrollSnapAlign: "start", // Tepaga yopishish
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#282c34", // O'zining foni
};

function Gift() {
    return (
        <motion.div
            className="gift-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            {/* 1-Bozor: Rotating Text (O'rab qo'ydik) */}
            <div style={rotatingSectionStyle}>
                <RotatingText />
            </div>
            <MemoriesSection />
            <MacTerminal />
        </motion.div>
    );
}

export default Gift;
