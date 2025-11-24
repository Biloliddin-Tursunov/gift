// api/send-email.js yoki functions/send-email.js

import nodemailer from "nodemailer";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { message } = req.body;

    if (!message) {
        return res
            .status(400)
            .json({ success: false, message: "Message field is required." });
    }

    try {
        // Nodemailer transportini yaratish
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: import.meta.env.EMAIL_USER, // .env dan olinadi
                pass: import.meta.env.EMAIL_PASS, // .env dan olinadi
            },
        });

        // Email yuborish
        let info = await transporter.sendMail({
            from: import.meta.env.EMAIL_USER, // Kimdan
            to: import.meta.env.EMAIL_USER, // Kimga (O'zingizga yuborasiz)
            subject: "Yangi Xabar: Maxsus Sovg'a Formasidan",
            text: `Do'stingizdan kelgan xabar: \n\n${message}`,
            html: `<h1>Do'stingizdan yangi xabar!</h1><p><strong>Xabar:</strong> ${message}</p>`,
        });

        console.log("Xabar yuborildi: %s", info.messageId);
        return res
            .status(200)
            .json({ success: true, message: "Message sent successfully." });
    } catch (error) {
        console.error("Email yuborishda xato:", error);
        return res.status(500).json({
            success: false,
            message: "Email could not be sent due to a server error.",
        });
    }
}
