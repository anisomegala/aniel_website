import React from 'react'
import AnimatedText from '../components/AnimatedText'
import Layout from '../components/Layout'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { YoutubeIcon } from '../components/icons'

// Image Imports
import project1 from '../../public/images/projects/Ilu trio.jpg'
import project2 from '../../public/images/projects/AnielQuilombo.jpg'
import project3 from '../../public/images/projects/Odyssey.jpg'
import project4 from '../../public/images/projects/Amaro_Freitas_2023_MJF.jpg'
import project5 from '../../public/images/projects/DaymeArocena.jpg'
import project6 from '../../public/images/projects/LuedjiLuna.jpg'
import project7 from '../../public/images/projects/JulitoPadron.jpg'

const FramerImage = motion(Image);

// 1. Improved Card for the Puzzle Grid
const ProjectCard = ({ type, title, img, link, youtube, className="" }) => {
    return (
        <motion.article 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`relative w-full group flex flex-col items-start justify-end overflow-hidden rounded-3xl border border-dark/10 dark:border-light/10 bg-light dark:bg-dark ${className}`}
        >
            {/* Image Layer */}
            <Link href={link} target="_blank" className='absolute inset-0 z-0 cursor-pointer overflow-hidden'>
                <FramerImage 
                    src={img} 
                    alt={title} 
                    className='w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110'
                    whileHover={{ scale: 1.1 }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Overlay Gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
            </Link>

            {/* Content Layer (Stays at the bottom) */}
            <div className='relative z-10 w-full p-6 flex flex-col items-start text-light pointer-events-none'>
                <span className='text-primary dark:text-primaryDark font-semibold text-xs tracking-tighter uppercase mb-1'>
                   {type}
                </span>
                <h2 className='text-2xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors'>
                   {title}
                </h2>
                
                <div className='flex items-center gap-4 pointer-events-auto'>
                    <Link href={youtube} target="_blank" className='w-8 hover:scale-110 transition-transform'> 
                        <YoutubeIcon className="!fill-light group-hover:!fill-primary" /> 
                    </Link>
                    <Link href={link} target="_blank" className='text-xs font-bold uppercase underline underline-offset-4 tracking-widest hover:text-primary'>
                        View Project
                    </Link>
                </div>
            </div>
        </motion.article>
    )
}

const ProjectsPage = () => {
    return (
        <>
            <Head>
                <title>Aniel Someillan | Projects Portfolio</title>
                <meta name='description' content='International Jazz Collaborations and Original Projects by Aniel Someillan.' />
            </Head>
            <main className='w-full mb-16 flex flex-col items-center justify-center bg-light dark:bg-dark'>
                <Layout className='pt-16'>
                    <AnimatedText 
                        className='mb-16 lg:!text-7xl sm:mb-8 sm:!text-6xl xs:!text-3xl' 
                        text="Visual Journey through Music" 
                    />
                    
                    {/* 2. THE PUZZLE GRID ENGINE */}
                    <div className='grid grid-cols-12 auto-rows-[250px] gap-6 md:gap-4 sm:flex sm:flex-col'>
                        
                        {/* Huge Main Piece */}
                        <ProjectCard
                            type="Featured Collaboration"
                            title="Ílú trio" 
                            img={project1}
                            link='https://ilu-epk.vercel.app'
                            youtube="https://www.youtube.com/watch?v=ug-NmgN5D78&t=1470s"
                            className="col-span-8 row-span-2 md:col-span-12"
                        />

                        {/* Tall Piece */}
                        <ProjectCard
                            type="Independent Project"
                            title="Aniel y El Quilombo" 
                            img={project2}
                            link='http://googleusercontent.com/spotify.com/6'
                            youtube="https://www.youtube.com/watch?v=QtgpURPdVQc&t=3934s"
                            className="col-span-4 row-span-3 md:col-span-6 sm:h-[400px]"
                        />

                        {/* Wide Piece */}
                        <ProjectCard
                            type="Multicultural Project"
                            title="Odyssey" 
                            img={project3}
                            link='http://googleusercontent.com/spotify.com/7'
                            youtube="https://www.youtube.com/watch?v=ysGmw90I-18&t=4s"
                            className="col-span-4 row-span-1 md:col-span-6"
                        />

                        {/* Standard Block */}
                        <ProjectCard 
                            type="Tour 2023"
                            title="Amaro Freitas Trio" 
                            img={project4}
                            link='http://googleusercontent.com/spotify.com/8'
                            youtube="https://www.youtube.com/watch?v=7dIrnzFM4hI&t=201s"
                            className="col-span-4 row-span-2 md:col-span-12"
                        />

                        {/* Horizontal Piece */}
                        <ProjectCard 
                            type="World Tour 2022"
                            title="Dayme Arocena" 
                            img={project5}
                            link='http://googleusercontent.com/spotify.com/9'
                            youtube="https://www.youtube.com/watch?v=WRC0nbpEFJ8"
                            className="col-span-8 row-span-1 md:col-span-12"
                        />

                        {/* Small Dynamic Blocks */}
                        <ProjectCard 
                            type="Core Member"
                            title="Luedji Luna" 
                            img={project6}
                            link='https://open.spotify.com/album/1dVpFsHYwATW0VsPGfd5ZI?si=qeTUwMXQTZWhFsrJGwlVAQ0'
                            youtube="https://www.youtube.com/watch?v=YwoCX1z2at8&t=3535s"
                            className="col-span-4 row-span-1 md:col-span-6"
                        />
                        <ProjectCard 
                            type="Jazz Collab"
                            title="Julito Padron" 
                            img={project7}
                            link='#'
                            youtube="#"
                            className="col-span-8 row-span-1 md:col-span-6"
                        />
                    </div>
                </Layout>
            </main>
        </>
    )
}

export default ProjectsPage