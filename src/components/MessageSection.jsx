import React, { useState } from "react";
import "../styles/Message.css";

// 🔥 GOOGLE FORMS URL OLIB TASHLANDI. ENDI LOCAL API ISHLATILADI.
const API_ENDPOINT = "/api/send-email";

const MessageSection = () => {
    const [status, setStatus] = useState("");

    // Formni boshqarish funksiyasi
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Yuborilmoqda...");

        const textarea = e.target.elements.message;
        const messageText = textarea.value;

        try {
            const response = await fetch(API_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: messageText }),
            });

            if (response.ok) {
                setStatus("✅ Xabar muvaffaqiyatli yuborildi!");
                textarea.value = ""; // Maydonni tozalash
            } else {
                const errorData = await response.json();
                setStatus(`❌ Xato: ${errorData.message || "Yuborilmadi."}`);
            }
        } catch (error) {
            setStatus("❌ Tarmoq xatosi. Keyinroq urinib ko'ring.");
            console.log(error);
        }
    };

    return (
        <div className="message-container">
            <div className="message-wrapper">
                <h2 className="message-title">Final Message</h2>

                <p className="message-subtitle">
                    If you have finished reading this, please leave a message
                    for me here.
                </p>

                {/* 🔥 ACTION O'RNIGA JAVASCRIPT SUBMISSION ISHLATILADI */}
                <form className="message-form" onSubmit={handleSubmit}>
                    <textarea
                        name="message"
                        placeholder="Type your message here..."
                        rows="6"
                        required
                        className="message-textarea"
                    />

                    <button type="submit" className="message-button">
                        Send ❤️
                    </button>

                    <p className="message-footer">
                        {status ||
                            "Bu xabar to'g'ridan-to'g'ri emailingizga yuboriladi."}
                    </p>
                </form>
            </div>
        </div>
    );
};

export default MessageSection;
