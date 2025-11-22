import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Verification from "./components/Verification";
import Gift from "./components/Gift";

// --- 1. HIMOYALANGAN ROUTE KOMPONENTI ---
const ProtectedRoute = ({ isVerified, children }) => {
    // Agar tasdiqlangan bo'lsa, ichidagi komponentni ko'rsatadi
    if (isVerified) {
        return children;
    }
    // Aks holda, Kirish sahifasiga yo'naltiradi
    return <Navigate to="/" />;
};

// --- 2. ASOSIY APP KOMPONENTI (STATE BOSHQARUVI) ---
function App() {
    // Holatni saqlash: Sahifa yuklanganda sessionStorage dan o'qib olamiz
    const [isVerified, setIsVerified] = useState(() => {
        // 'true' string qiymatini tekshiramiz
        return sessionStorage.getItem("isVerified") === "true";
    });

    // SessionStorage ga yozish va React State ni yangilash uchun universal funksiya
    const handleVerificationStatus = (status) => {
        setIsVerified(status);

        if (status) {
            // Agar true bo'lsa, sessionda saqlaymiz
            sessionStorage.setItem("isVerified", "true");
        } else {
            // Agar false bo'lsa (masalan, Logout tugmasi bosilganda), tozalaymiz
            sessionStorage.removeItem("isVerified");
        }
    };

    return (
        <Router>
            <AppContent
                isVerified={isVerified}
                handleVerificationStatus={handleVerificationStatus}
            />
        </Router>
    );
}

// --- 3. ANIMATSIYA VA ROUTING MANTIQI ---
function AppContent({ isVerified, handleVerificationStatus }) {
    const location = useLocation(); // Joriy URL ni olish

    return (
        // mode="wait": Eski sahifa animatsiyasi tugamasdan yangisi kirmaydi
        <AnimatePresence mode="wait">
            {/* location va key={location.pathname} framer-motion uchun muhim */}
            <Routes location={location} key={location.pathname}>
                {/* / (Verification) sahifasi */}
                <Route
                    path="/"
                    element={
                        // Agar allaqachon Verified bo'lsa, to'g'ridan-to'g'ri /gift ga yo'naltiramiz
                        isVerified ? (
                            <Navigate to="/gift" />
                        ) : (
                            <Verification
                                setIsVerified={handleVerificationStatus}
                            />
                        )
                    }
                />

                {/* /gift (Himoyalangan sahifa) */}
                <Route
                    path="/gift"
                    element={
                        <ProtectedRoute isVerified={isVerified}>
                            <Gift />
                        </ProtectedRoute>
                    }
                />

                {/* Boshqa barcha noma'lum yo'nalishlarni (404) Kirish sahifasiga qaytaramiz */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </AnimatePresence>
    );
}

export default App;
