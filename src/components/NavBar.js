import Link from 'next/link'
import React, {useEffect, useState} from 'react'
import Logo from '../components/Logo'
import { useRouter } from 'next/router'
import {InstagramIcon, FacebookIcon, LinkedInIcon, GithubIcon, SunIcon,  MoonIcon, YoutubeIcon } from './icons'
import {motion} from "framer-motion";
import useThemeSwitcher from './hooks/useThemeSwitcher'


const CustomLink = ({href, title, className}) => {

    const router = useRouter();

    return (
        <Link href={href} className={`${className} relative group`}>
            {title}
            <span className={`h-1 inline-block bg-dark absolute left-0 
            -bottom-0.5 group-hover:w-full  transition-[width] 
            ease duration-600 ${router.asPath === href ? 'w-full' : 'w-0'} dark:bg-light
            `}
            
            >&nbsp;</span>
        </Link>
    )
}



const CustomMobilLink = ({href, title, className="", toggle }) => {

    const router = useRouter();
    
    const handelClick2 = () => {
        toggle();
        router.push(href)
    }


    return (
        <button href={href} className={`${className} relative group text-light dark:text-dark my-2`} onClick={handelClick2}>
            {title}
            <span className={`h-1 inline-block bg-light dark:bg-dark absolute left-0 
            -bottom-0.5 group-hover:w-full  transition-[width] 
            ease duration-600 ${router.asPath === href ? 'w-full' : 'w-0'} dark:bg-light
            `}
            
            >&nbsp;</span>
        </button>
    )
}


const NavBar = () => {

    const [mode, setMode] = useThemeSwitcher();
    const [isHidden, setIsHidden] = useState(true);

    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
        setIsHidden(!isHidden);
    }

    return (
        <header className='w-full px-32 py-8 font-medium flex items-center justify-between dark:text-light relative z-10 lg:px-16 md:px-12 sm:px-8'
        >
            <button className="flex-col justify-center items-center hidden lg:flex"  onClick={handleClick}>
                <span className={`bg-dark dark:bg-light transition-all durastion-300 ease-out block h-0.5 w-6 rounded-sm -translate-y-0.5 -translate-x-0.5 ${isOpen ? "rotate-45 translate-y-1 translate-x-1.5" : "-translate-y-0.5 -translate-x-1" }`}></span>
                <span className={`bg-dark dark:bg-light transition-all durastion-300 ease-out block h-0.5 w-6 rounded-sm my-0.4 ${isOpen ?  "-rotate-45 translate-y-0.5 -translate-x-2" : ""}`}></span>
                <span className={`bg-dark dark:bg-light transition-all durastion-300 ease-out block h-0.5 w-6 rounded-sm translate-y-0.5 translate-x-0.5 ${isOpen ?  "-translate-x-0.5": "translate-x-1" }`}></span>
            </button>

            <div className='w-full flex justify-between items-center lg:hidden'>
                <nav>
                    <CustomLink href='/'  title='Home' className='mr-4' />
                    <CustomLink href='/about'  title='About'  className='mx-4'/>
                    <CustomLink href='/shows'  title='Shows'  className='mx-4'/>
                    <CustomLink href='/projects'  title='Projects'  className='ml-4' />
                </nav>
                <nav className='flex items-center justify-center flex-wrap gap-5'>
                <motion.a href='https://www.instagram.com/anielsomeillan/' target={'_blank'}
                whileHover={{y:-2}}
                className='w-6'
                >
                    <InstagramIcon />
                </motion.a>
                <motion.a href='https://www.facebook.com/anielsomeillan/' target={'_blank'}
                whileHover={{y:-2}}
                className='w-6'
                >
                    <FacebookIcon />
                </motion.a>
                <motion.a href='https://www.linkedin.com/in/aniel-someillan-8ba47a10b/' target={'_blank'}
                whileHover={{y:-2}}
                className='w-6'
                >
                    <LinkedInIcon />
                </motion.a>
                <motion.a href='https://www.youtube.com/channel/UCFxWUuuoTJ8B21uSz9j9gHg' target={'_blank'}
                whileHover={{y:-2}}
                className='w-6'
                >
                    <YoutubeIcon  className='w-7'/>
                </motion.a>
                <button
                    onClick={() => setMode(mode === "light" ? "dark" : "light")}
                    className={`flex items-center justify-center rounded-full p-1
                        ${mode === "light" ? "bg-primary text-light" : "bg-light text-dark"}
                    `}
                >
                    
                    {
                        mode === "dark" ? 
                        <SunIcon  className={'fill-dark w-6'} /> :
                        <MoonIcon className={'fill-dark w-6'} />                    
                    }
                </button>
            </nav>
            </div>




            {
                isOpen ? 
                <motion.div 
                    initial={{scale:0, opacity:0, x:"-50%", y: "-50%"}}
                    animate={{scale:1, opacity:1}}
                className='min-w-[70vw] flex flex-col justify-between z-30 items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                bg-dark/90 dark:bg-light/75 rounded-lg backdrop-blur-md py-32'>
                <nav className='flex items-center flex-col justify-center'>
                    <CustomMobilLink href='/'  title='Home' className=''  toggle={handleClick}/>
                    <CustomMobilLink href='/about'  title='About'  className='' toggle={handleClick}/>
                    <CustomMobilLink href='/shows'  title='Shows'  className='' toggle={handleClick}/>
                    <CustomMobilLink href='/projects'  title='Projects'  className=''  toggle={handleClick}/>
                </nav>
                <nav className='flex items-center justify-center flex-wrap gap-5 mt-2 sm:gap-2'>
                <motion.a href='https://www.instagram.com/anielsomeillan/' target={'_blank'}
                whileHover={{y:-2}}
                className='w-6'
                >
                    <InstagramIcon />
                </motion.a>
                <motion.a href='https://www.facebook.com/anielsomeillan/' target={'_blank'}
                whileHover={{y:-2}}
                className='w-6'
                >
                    <FacebookIcon />
                </motion.a>
                <motion.a href='https://www.linkedin.com/in/aniel-someillan-8ba47a10b/' target={'_blank'}
                whileHover={{y:-2}}
                className='w-6'
                >
                    <LinkedInIcon />
                </motion.a>
                <motion.a href='https://www.youtube.com/channel/UCFxWUuuoTJ8B21uSz9j9gHg' target={'_blank'}
                whileHover={{y:-2}}
                className='w-6'
                >
                    <YoutubeIcon />
                </motion.a>
                <button
                    onClick={() => setMode(mode === "light" ? "dark" : "light")}
                    className={`flex items-center justify-center rounded-full p-1
                        ${mode === "light" ? "bg-primary text-light" : "bg-light text-dark"}
                    `}
                >
                    
                    {
                        mode === "dark" ? 
                        <SunIcon  className={'fill-dark w-6'} /> :
                        <MoonIcon className={'fill-dark w-6'} />                    
                    }
                </button>
            </nav>
            </motion.div>


                : " "

            }



            <div className='absolute left-[50%] top-2 translate-x-[-50%]'>
                   <Logo />
            </div>
        </header>
    )
}

export default NavBar
