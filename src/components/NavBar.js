import Link from 'next/link'
import React, { useState } from 'react'
import Logo from './Logo'
import { useRouter } from 'next/router'
import { 
    TwitterIcon, 
    GithubIcon, 
    LinkedInIcon, 
    SunIcon, 
    MoonIcon,
    InstagramIcon, // Ensure these are exported from your icons file
    FacebookIcon 
} from './icons'
import { motion, AnimatePresence } from 'framer-motion'
import useThemeSwitcher from './hooks/useThemeSwitcher'

const CustomLink = ({ href, title, className = "" }) => {
    const router = useRouter();
    return (
        <Link href={href} className={`${className} relative group`}>
            {title}
            <span className={`
                h-[1px] inline-block bg-dark absolute left-0 -bottom-0.5
                group-hover:w-full transition-[width] ease duration-300
                ${router.asPath === href ? 'w-full' : 'w-0'}
                dark:bg-light`}
            >
                &nbsp;
            </span>
        </Link>
    )
}

const NavBar = () => {
    const [mode, setMode] = useThemeSwitcher();
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);
    
    const isHomePage = router.asPath === "/";

    // Social Media Data with 5 icons distributed around the top/sides
    const socialIcons = [
        { icon: <FacebookIcon />, href: "https://facebook.com", angle: -160 }, 
        { icon: <InstagramIcon />, href: "https://instagram.com", angle: -125 },
        { icon: <TwitterIcon />, href: "https://twitter.com", angle: -90 },     // Top Center
        { icon: <LinkedInIcon />, href: "https://linkedin.com", angle: -55 },
        { icon: <GithubIcon />, href: "https://github.com", angle: -20 },
    ];

    return (
        <header className={`w-full px-32 py-8 font-medium flex items-center dark:text-light relative z-50 lg:px-16 md:px-12 sm:px-8 
            ${isHomePage ? "justify-center" : "justify-between"}`}>
            
            {/* 1. Standard Navigation - Only on Non-Home Pages */}
            {!isHomePage && (
                <>
                    <nav className='flex items-center space-x-8'>
                        <CustomLink href="/" title="Home" />
                        <CustomLink href="/about" title="About" />
                        <CustomLink href="/projects" title="Projects" />
                        <CustomLink href="/experience" title="Experience" />
                        <CustomLink href="/articles" title="Articles" />
                    </nav>

                    <nav className='flex items-center justify-center flex-wrap'>
                        <motion.a href="https://twitter.com" target={"_blank"} whileHover={{ y: -2 }} className="w-6 mr-3"><TwitterIcon /></motion.a>
                        <motion.a href="https://github.com" target={"_blank"} whileHover={{ y: -2 }} className="w-6 mx-3"><GithubIcon /></motion.a>
                        <motion.a href="https://linkedin.com" target={"_blank"} whileHover={{ y: -2 }} className="w-6 mx-3"><LinkedInIcon /></motion.a>
                        <button onClick={() => setMode(mode === "light" ? "dark" : "light")} className="ml-3 flex items-center justify-center rounded-full p-1">
                            {mode === "dark" ? <SunIcon className={"fill-dark"} /> : <MoonIcon className={"fill-dark"} />}
                        </button>
                    </nav>
                </>
            )}

            {/* 2. LOGO AREA - Centered on Home with Circular Hover Effect */}
            <div 
                className={`relative flex items-center justify-center cursor-pointer 
                ${isHomePage ? "" : "absolute left-[50%] top-2 translate-x-[-50%]"}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Logo reduced to scale-90 to make room for 5 icons */}
                <div className={`${isHomePage ? "scale-90" : "scale-100"} transition-transform duration-300`}>
                    <Logo />
                </div>

                {/* Animated Social Icons - Only on Home Page */}
                {isHomePage && (
                    <AnimatePresence>
                        {isHovered && socialIcons.map((item, i) => {
                            // RADIUS: 50px keeps icons tight against the smaller logo
                            const radius = 50; 
                            const x = Math.cos((item.angle * Math.PI) / 180) * radius;
                            const y = Math.sin((item.angle * Math.PI) / 180) * radius;

                            return (
                                <motion.a
                                    key={i}
                                    href={item.href}
                                    target="_blank"
                                    initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                                    animate={{ 
                                        opacity: 1, 
                                        x: x, 
                                        y: y, 
                                        scale: 0.75 // Smaller icons for a cleaner halo
                                    }}
                                    exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                                    whileHover={{ scale: 1, transition: { duration: 0.2 } }}
                                    className="absolute w-8 h-8 flex items-center justify-center z-[-1] text-dark dark:text-light"
                                >
                                    <div className="w-5 h-5">
                                        {item.icon}
                                    </div>
                                </motion.a>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>

            {/* 3. HOME PAGE THEME SWITCHER - Fixed on Right */}
            {isHomePage && (
                <div className="absolute right-32 lg:right-16 md:right-12 sm:right-8">
                     <button
                        onClick={() => setMode(mode === "light" ? "dark" : "light")}
                        className={`flex items-center justify-center rounded-full p-1 transition-all
                        ${mode === "light" ? "bg-dark text-light" : "bg-light text-dark"}`}
                    >
                        {mode === "dark" ? <SunIcon className={"fill-dark w-6 h-6"} /> : <MoonIcon className={"fill-dark w-6 h-6"} />}
                    </button>
                </div>
            )}
        </header>
    )
}

export default NavBar;