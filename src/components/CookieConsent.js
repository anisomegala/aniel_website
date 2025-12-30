import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'true');
        setIsVisible(false);
        // Trigger a page refresh or custom event to initialize Pixel
        window.location.reload(); 
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'false');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-6 right-6 z-[9999] max-w-lg md:left-auto"
                >
                    <div className="relative overflow-hidden rounded-3xl border border-dark/10 dark:border-light/10 bg-light/70 dark:bg-dark/70 backdrop-blur-2xl p-6 shadow-2xl">
                        {/* Decorative Gradient Background */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2 dark:text-light">Cookie Settings</h3>
                            <p className="text-sm opacity-80 dark:text-light/80 mb-6">
                                We use cookies to improve your experience and track shop performance via Facebook Pixel. 
                                Read our <Link href="/about" className="underline font-bold">Privacy Policy</Link> for more details.
                            </p>
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={handleAccept}
                                    className="flex-1 bg-dark text-light dark:bg-light dark:text-dark py-3 rounded-xl font-bold hover:bg-primary dark:hover:bg-primary transition-all"
                                >
                                    Accept
                                </button>
                                <button 
                                    onClick={handleDecline}
                                    className="flex-1 border border-dark/20 dark:border-light/20 py-3 rounded-xl font-bold hover:bg-red-500/10 hover:border-red-500/50 transition-all dark:text-light"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;