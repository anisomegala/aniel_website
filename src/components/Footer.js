import React from 'react'
import Link from 'next/link'

const Footer = () => {
    return (
        <footer className="w-full border-t border-solid border-dark/10 dark:border-light/10 font-medium text-sm sm:text-xs bg-light dark:bg-dark py-8 px-32 lg:px-16 md:px-12 sm:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between text-dark/70 dark:text-light/70 gap-4">
                
                {/* 1. Copyright Section */}
                <div className="flex items-center gap-1 order-3 md:order-1">
                    <span>{new Date().getFullYear()} &copy; All Rights Reserved.</span>
                </div>

                {/* 2. Modern Tagline / Status */}
                <div className="flex items-center gap-2 order-1 md:order-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="font-semibold tracking-wider text-dark dark:text-light italic">
                        Built for the future
                    </span>
                </div>

                {/* 3. Utility Links (Modern Minimalist) */}
                <div className="flex items-center gap-6 order-2 md:order-3">
                    <Link 
                        href="/contact" 
                        className="hover:text-primary transition-colors duration-200 underline underline-offset-4"
                    >
                        Say Hello
                    </Link>
                    <Link 
                        href="/privacy" 
                        className="hover:text-primary transition-colors duration-200"
                    >
                        Privacy
                    </Link>
                </div>

            </div>
        </footer>
    )
}

export default Footer