import React, { useState } from 'react'
import Logo from './Logo'
import { TwitterIcon, LinkedInIcon, SunIcon, MoonIcon, InstagramIcon, FacebookIcon, GithubIcon } from './icons'
import { motion, AnimatePresence } from 'framer-motion'
import useThemeSwitcher from './hooks/useThemeSwitcher'

import dynamic from 'next/dynamic';

const GlobeIcon = dynamic(() => import('./GlobeIcon'), {
    ssr: false,
    loading: () => <div className="w-16 h-16 bg-transparent" />
});

const NavBar = () => {
    const [mode, setMode] = useThemeSwitcher();
    const [isHovered, setIsHovered] = useState(false);

    const socialIcons = [
        { icon: <TwitterIcon />, href: "https://twitter.com", angle: -90 },
        { icon: <InstagramIcon />, href: "https://instagram.com", angle: -18 },
        { icon: <FacebookIcon />, href: "https://facebook.com", angle: 54 },
        { icon: <LinkedInIcon />, href: "https://linkedin.com", angle: 126 },
        { icon: <GithubIcon />, href: "https://github.com", angle: 198 },
    ];

    return (
        /* CHANGE: Increased 'py-20' and removed any potential overflow issues */
        <header className="w-full px-32 py-20 flex items-center justify-between dark:text-light relative z-50 lg:px-16 md:px-12 sm:px-8 overflow-visible">

            <div className="flex items-center">
                <button
                    onClick={() => setMode(mode === "light" ? "dark" : "light")}
                    className="flex items-center justify-center rounded-full p-2 bg-dark text-light dark:bg-light dark:text-dark transition-all"
                >
                    {mode === "dark" ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
                </button>
            </div>

            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Logo wrapper */}
                <div className="relative z-30 transition-transform duration-500 hover:scale-105 scale-90">
                    <Logo />
                </div>

                <AnimatePresence>
                    {isHovered && socialIcons.map((item, i) => {
                        // Tight radius to keep it close to the logo
                        const radius = 52;
                        const x = Math.cos((item.angle * Math.PI) / 180) * radius;
                        const y = Math.sin((item.angle * Math.PI) / 180) * radius;

                        return (
                            <motion.a
                                key={i}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                                animate={{ opacity: 1, x: x, y: y, scale: 1 }}
                                exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                                /* CHANGE: Ensure z-index is high and allow overflow here too */
                                className="absolute w-8 h-8 flex items-center justify-center z-40 bg-light/95 dark:bg-dark/95 backdrop-blur-md rounded-full border border-primary/10 shadow-md text-dark dark:text-light hover:text-primary"
                            >
                                <div className="w-3.5 h-3.5">
                                    {item.icon}
                                </div>
                            </motion.a>
                        );
                    })}
                </AnimatePresence>
            </div>

            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <GlobeIcon />
            </div>

        </header>
    )
}

export default NavBar;