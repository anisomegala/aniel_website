import Link from 'next/link'
import React from 'react'
import {motion} from "framer-motion";

const MotionLink = motion(Link)

const Logo = () => {
    return (
        <div className='flex items-center justify-center mt-2'>
            <MotionLink href='/' className='w-16 h-16 bg-dark text-light flex items-center justify-center rounded-full text-2xl font-bold border border-solid border-transparent dark:border-light'
            whileHover={{
                backgroundColor: '#b8975a',
                transition: { duration: 0.3 },
                scale: 1.1
            }}
            >AS</MotionLink>
        </div>
    )
}

export default Logo
