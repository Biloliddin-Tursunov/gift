// src/components/Gift.jsx
import React from "react";
import { motion } from "framer-motion"; // 1. Import qildik
import RotatingText from "./RotatingText";

// ... (giftStyles o'zgarmaydi) ...
const giftStyles = {
    /* ... */
};

function Gift() {
    return (
        // 2. motion.div bilan o'rash
        <motion.div
            style={giftStyles.container}
            initial={{ opacity: 0, scale: 0.9 }} // Kichikroq bo'lib, xira boshlanadi
            animate={{ opacity: 1, scale: 1 }} // Kattalashib paydo bo'ladi
            exit={{ opacity: 0 }} // Shunchaki xira bo'lib yo'qoladi
            transition={{ duration: 0.8, ease: "easeOut" }} // Biroz sekinroq va silliq
        >
            <RotatingText />
        </motion.div>
    );
}

export default Gift;
