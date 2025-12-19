// src/components/Loader.js
import React from 'react'
import { motion } from 'framer-motion'

const Loader = () => {
    // Opening phrase of Chopin Nocturne Op. 9 No. 2 (Simplified for visual rhythm)
    // Each note has a position (x, y) on the pentagram
    const nocturneNotes = [
        { x: 20, y: 35 }, { x: 50, y: 30 }, { x: 80, y: 40 }, { x: 110, y: 25 }, // Bar 1
        { x: 150, y: 35 }, { x: 180, y: 45 }, { x: 210, y: 30 }, { x: 240, y: 20 }, // Bar 2
        { x: 280, y: 35 }, { x: 310, y: 30 }, { x: 340, y: 40 }, { x: 370, y: 25 }, // Bar 3
        { x: 410, y: 35 }, { x: 440, y: 45 }, { x: 470, y: 30 }, { x: 500, y: 20 }  // Bar 4
    ];

    return (
        <motion.div 
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark dark:bg-light"
        >
            <div className="flex flex-col items-center w-full max-w-2xl px-10">
                
                {/* 1. The Pentagram (Staff) */}
                <div className="relative w-full h-32 flex items-center justify-center mb-8">
                    {/* 5 Staff Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between h-20 top-6">
                        {[1, 2, 3, 4, 5].map((line) => (
                            <motion.div 
                                key={line}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="w-full h-[1px] bg-primary/30 origin-left"
                            />
                        ))}
                    </div>

                    {/* Animated Notes */}
                    <svg viewBox="0 0 520 100" className="absolute inset-0 w-full h-full z-10 overflow-visible">
                        {nocturneNotes.map((note, i) => (
                            <motion.g
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ 
                                    delay: 0.5 + (i * 0.12), 
                                    duration: 0.4,
                                    type: "spring",
                                    stiffness: 200 
                                }}
                            >
                                {/* Note Head */}
                                <ellipse cx={note.x} cy={note.y} rx="4" ry="3" className="fill-primary" transform={`rotate(-20 ${note.x} ${note.y})`} />
                                {/* Note Stem */}
                                <line x1={note.x + 3.5} y1={note.y} x2={note.x + 3.5} y2={note.y - 20} className="stroke-primary stroke-[1.5]" />
                            </motion.g>
                        ))}
                        
                        {/* 4 Bar Lines */}
                        {[130, 260, 390].map((bx, i) => (
                            <motion.line 
                                key={i}
                                x1={bx} y1="26" x2={bx} y2="66"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 + (i * 0.5) }}
                                className="stroke-primary/50 stroke-[1]"
                            />
                        ))}
                    </svg>

                    {/* Scrolling Mask Effect */}
                    <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent w-20 z-0"
                    />
                </div>

                {/* 2. Brand Identity */}
                <div className="text-center">
                    <motion.h1 
                        initial={{ opacity: 0, letterSpacing: "0.2em" }}
                        animate={{ opacity: 1, letterSpacing: "0.5em" }}
                        transition={{ duration: 1.5 }}
                        className="text-light dark:text-dark text-2xl font-bold uppercase"
                    >
                        Aniel Someillan
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-primary text-[10px] font-medium tracking-[0.3em] mt-4 uppercase italic"
                    >
                        Nocturne in website major — Composed by Someillan
                    </motion.p>
                </div>
            </div>
        </motion.div>
    )
}

export default Loader