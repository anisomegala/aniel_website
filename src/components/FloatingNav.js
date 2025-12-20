import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/shows", label: "Shows" },
    { href: "/articles", label: "Articles" },
    { href: "/shop", label: "Shop" },
];



const FloatingNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    // Only show on sub-pages (not home)
    if (router.pathname === "/") return null;

    return (
        /* Positioning Logic:
           right-6: Distance from right edge
           top-1/2: Move the top of the container to 50% height
           -translate-y-1/2: Pull the container back up by half its own height to center it
        */
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] flex items-center justify-end">
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        // 'mr-4' pushes the menu to the left of the button
                        className="mr-4 bg-light/90 dark:bg-dark/90 backdrop-blur-xl border border-primary/20 p-2 rounded-2xl shadow-2xl min-w-[160px]"
                    >
                        <nav className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.href} 
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                        router.pathname === link.href 
                                        ? "bg-primary text-light" 
                                        : "hover:bg-primary/10 text-dark dark:text-light"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* THE CENTRAL BUTTON */}
            <motion.button
                whileHover={{ scale: 1.1, x: -5 }} // Subtle move left on hover
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full bg-dark dark:bg-light flex flex-col items-center justify-center gap-1.5 shadow-2xl border border-primary/40 relative z-[101]"
            >
                <motion.span 
                    animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                    className="w-6 h-0.5 bg-light dark:bg-dark block" 
                />
                <motion.span 
                    animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="w-6 h-0.5 bg-light dark:bg-dark block" 
                />
                <motion.span 
                    animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                    className="w-6 h-0.5 bg-light dark:bg-dark block" 
                />
            </motion.button>
        </div>
    );
};

export default FloatingNav;