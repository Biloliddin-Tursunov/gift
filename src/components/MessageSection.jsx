import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "../styles/Message.css";
import { motion } from "framer-motion";

// 🔥 1. SUPABASE PROJECT URL (O'zgarishsiz)
const SUPABASE_URL = "https://ixrsqvgbdklqntuvvett.supabase.co";
const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cnNxdmdiZGtscW50dXZ2ZXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMDg4MjUsImV4cCI6MjA3OTU4NDgyNX0.9sSsPu8HlWTLVsVG4SLQbarFJKjIXJULuBZDn6Jj6Qg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const MessageSection = () => {
    const [status, setStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const FIELD_MESSAGE_NAME = "message";

    const FINAL_SUCCESS_MESSAGE_UZ =
        "It makes me happy to have someone like you in my life!!!";

    // SUBMIT MANTIQI (O'zgarmadi)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const textarea = form.elements.message;
        const messageText = textarea.value.trim();
        if (!messageText) return;

        setStatus("Sending to database...");
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from("messages")
                .insert([{ content: messageText }]);

            if (error) {
                console.error("Supabase Error:", error);
                if (error.code === "42501") {
                    setStatus("❌ Error: Permission denied (RLS issue).");
                } else {
                    setStatus("❌ An error occurred: Data not inserted.");
                }
            } else {
                setStatus("✅ Message successfully saved!");
                textarea.value = "";
                setIsSubmitted(true); // 🎉 Forma yashirinadi
            }
        } catch (error) {
            setStatus("❌ Network error. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 🔥 MUVOFAQQIYATLI XABAR KOMPONENTI
    const SuccessMessage = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            style={{
                textAlign: "center",
                padding: "40px",
                maxWidth: "90%", // Kengroq qilib chiqaramiz
                width: "100%",
                zIndex: 10,
            }}>
            <h1
                style={{
                    color: "#ffc107",
                    fontSize: "3rem", // Katta shrift
                    fontWeight: "800",
                    textShadow: "0 0 15px rgba(255, 193, 7, 0.7)",
                    marginBottom: "15px",
                }}>
                {FINAL_SUCCESS_MESSAGE_UZ}
            </h1>
            <p style={{ color: "#b0b0b0", fontSize: "1.2rem" }}>
                (Please get in touch with me when you have some free time.)
            </p>
        </motion.div>
    );

    return (
        <div className="message-container">
            {isSubmitted ? (
                // 🔥 Faqat yozuvni chiqaramiz, wrapper yo'q
                <SuccessMessage />
            ) : (
                // 🔥 Agar yuborilmagan bo'lsa, wrapper va formani chiqaramiz
                <div className="message-wrapper">
                    <h2 className="message-title">
                        What do you want to tell me?
                    </h2>
                    <p className="message-subtitle">
                        You can leave any message you want.
                    </p>
                    <form className="message-form" onSubmit={handleSubmit}>
                        <textarea
                            name={FIELD_MESSAGE_NAME}
                            placeholder="Type your message here..."
                            rows="8"
                            required
                            className="message-textarea"
                            disabled={isSubmitting}
                        />
                        <button
                            type="submit"
                            className="message-button"
                            disabled={isSubmitting}>
                            {isSubmitting ? "..." : "Send 👽"}
                        </button>
                        <p className="message-footer">
                            {status ||
                                "This message is stored directly in the personal database."}
                        </p>
                    </form>
                </div>
            )}

            {/* Orqa fondagi yulduzlar */}
            <div className="shooting-star"></div>
            <div className="shooting-star"></div>
            <div className="shooting-star"></div>
            <div className="shooting-star"></div>
        </div>
    );
};

export default MessageSection;
