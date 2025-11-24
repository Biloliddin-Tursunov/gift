import React, { useState } from "react";
// Supabase Client'ni import qilish
import { createClient } from "@supabase/supabase-js";
import "../styles/Message.css";

// 🔥 1. SUPABASE PROJECT URL (Client-side uchun xavfsiz)
const SUPABASE_URL = "https://ixrsqvgbdklqntuvvett.supabase.co";

// 🔥 2. ANON KEY (Public kalit - Client-side uchun xavfsiz)
// DIQQAT: SECRET KEY (Service Role Key) bu yerga qo'yilmadi!
const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cnNxdmdiZGtscW50dXZ2ZXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMDg4MjUsImV4cCI6MjA3OTU4NDgyNX0.9sSsPu8HlWTLVsVG4SLQbarFJKjIXJULuBZDn6Jj6Qg";

// Supabase Clientni ishga tushirish
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const MessageSection = () => {
    const [status, setStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const FIELD_MESSAGE_NAME = "message";

    // SUBMIT MANTIQI (SUPABASE GA MA'LUMOT YUBORISH)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const textarea = form.elements.message;
        const messageText = textarea.value.trim();

        if (!messageText) return;

        setStatus("Sending to database...");
        setIsSubmitting(true);

        try {
            // Inserting data into the 'messages' table
            // ⚠️ NOTE: The 'messages' table and 'content' column must be created in Supabase!
            const { error } = await supabase
                .from("messages")
                .insert([{ content: messageText }]);

            if (error) {
                console.error("Supabase Error:", error);
                // Check for RLS (Row Level Security) issue
                if (error.code === "42501") {
                    setStatus("❌ Error: Permission denied (RLS issue).");
                } else {
                    setStatus("❌ An error occurred: Data not inserted.");
                }
            } else {
                setStatus("✅ Message successfully saved!");
                textarea.value = "";
            }
        } catch (error) {
            setStatus("❌ Network error. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="message-container">
            <div className="message-wrapper">
                <h2 className="message-title">What do you want to tell me?</h2>

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
            <div className="shooting-star"></div>
            <div className="shooting-star"></div>
            <div className="shooting-star"></div>
            <div className="shooting-star"></div>
        </div>
    );
};

export default MessageSection;
