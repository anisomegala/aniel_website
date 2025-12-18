import React from 'react'
import FloatingNav from './FloatingNav';

const Layout = ({children, className=''}) => {
    return (
        <div>
            <FloatingNav />
            <div className={`w-full h-full inline-block  z-0 bg-light p-32  dark:bg-dark xl:p-24 xs:p-6 lg:p-16 md:p-12 sm:p-8 ${className}`}>{children}</div>
        </div>
    )
}

export default Layout;
