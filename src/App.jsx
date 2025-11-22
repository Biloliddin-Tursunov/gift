// src/App.jsx

import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion"; // 1. Import qildik

import Verification from "./components/Verification";
import Gift from "./components/Gift";

// Protected Route
const ProtectedRoute = ({ isVerified, children }) => {
    if (isVerified) {
        return children;
    }
    return <Navigate to="/" />;
};

// 2. Animatsiya uchun maxsus Routes komponenti
// useLocation() faqat Router ichida ishlagani uchun buni alohida qildik
const AnimatedRoutes = () => {
    const location = useLocation();

    // Kirish holatini (State) shu yerda yoki App da saqlash mumkin.
    // Keling, oddiylik uchun state ni shu yerga olib o'tamiz yoki props orqali olamiz.
    // Lekin App komponentida turgani yaxshiroq. Quyida App komponentini ko'ring.

    // Eslatma: State'ni App dan props orqali olib kelishimiz kerak.
    // Shuning uchun AnimatedRoutes ni App ichida emas, to'g'ridan-to'g'ri render qilamiz.
    return null;
};

function App() {
    // Holatni saqlash
    const [isVerified, setIsVerified] = useState(() => {
        return localStorage.getItem("isVerified") === "true";
    });

    const handleVerificationStatus = (status) => {
        setIsVerified(status);
        localStorage.setItem("isVerified", status);
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

// 3. Routing va Animatsiya mantiqini birlashtirgan komponent
function AppContent({ isVerified, handleVerificationStatus }) {
    const location = useLocation(); // Router ichida bo'lgani uchun ishlaydi

    return (
        // mode="wait" - Eski sahifa to'liq ketmaguncha yangisi kirmaydi (silliq o'tish uchun)
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route
                    path="/"
                    element={
                        <Verification
                            setIsVerified={handleVerificationStatus}
                        />
                    }
                />

                <Route
                    path="/gift"
                    element={
                        <ProtectedRoute isVerified={isVerified}>
                            <Gift />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </AnimatePresence>
    );
}

export default App;
