import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import en from '../../locales/en.json';
import es from '../../locales/es.json';
import pt from '../../locales/pt.json';
import pl from '../../locales/pl.json';

const FloatingNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null); 
    const router = useRouter();
    const { locale } = router;

    const t = locale === 'es' ? es : locale === 'pt' ? pt : locale === 'pl' ? pl : en;

    const navLinks = [
        { href: "/", label: t.nav.home },
        { href: "/about", label: t.nav.about },
        { href: "/projects", label: t.nav.projects },
        { href: "/shows", label: t.nav.shows },
        { href: "/articles", label: t.nav.articles },
        { href: "/shop", label: t.nav.shop },
        { href: "/press", label: t.nav.press },
    ];

    // Click outside logic
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <motion.div 
            ref={containerRef}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }} // Small delay so it appears after page content
            className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] flex items-center justify-end"
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
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

            <motion.button
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={isOpen}
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
        </motion.div>
    );
};

export default FloatingNav;