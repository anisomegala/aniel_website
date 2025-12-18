import Link from 'next/link'
import React from 'react'
import {motion} from "framer-motion";

const MotionLink = motion(Link)

const Logo = () => {
    return (
        <div className='flex items-center justify-center mt-2'>
            <MotionLink href='/' className='w-16 h-16 bg-dark text-light flex items-center justify-center rounded-full text-2xl font-bold border border-solid border-transparent dark:border-light'
            whileHover={{
                backgroundColor:  ['#0033A0', '#D21034','#1D1811', '#FFCC29', '#289728','#D4213D', "#996633"],
                transition: {duration: 1, repeat: Infinity},
                scale: 1.2
            }}
            >AS</MotionLink>
        </div>
    )
}

export default Logo
