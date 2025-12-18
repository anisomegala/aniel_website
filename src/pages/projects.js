import React from 'react'
import AnimatedText from '../components/AnimatedText'
import Layout from '../components/Layout'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import {YoutubeIcon} from '../components/icons'
import project1 from '../../public/images/projects/Ilu trio.jpg'
import project2 from '../../public/images/projects/AnielQuilombo.jpg'
import project3 from '../../public/images/projects/Odyssey.jpg'

import project4 from '../../public/images/projects/Amaro_Freitas_2023_MJF.jpg'
import project5 from '../../public/images/projects/DaymeArocena.jpg'
import project6 from '../../public/images/projects/LuedjiLuna.jpg'
import project7 from '../../public/images/projects/JulitoPadron.jpg'


const Project = ({type, title, summary, img, link, youtube}) => {
    return (
        <article className='w-full flex items-center justify-center p-2 relative flex-col rounded-2xl border border-solid border-dark bg-primaryDark text-light dark:bg-light dark:text-dark
        xs:p-4

        '>
            <Link href={link} target="_blank" 
            className='w-full cursor-pointer overflow-hidden rounded-lg'
            >
                <Image src={img} alt={title} className='w-full h-auto'/>
            </Link>

            <div className='w-full flex flex-col items-start justify-between mt-4'>
                <span className='font-medium text-medium text-light dark:text-dark'>{type}</span>
                <Link href={link} target="_blank" className='hover:underline underline-offset-2 dark:text-dark'>
                    <h2 className='my-2 w-full text-left text-3xl font-bold lg:text2xl'>{title}</h2>
                </Link>
                <p className='my-2 font-small sm:text-sm'>{summary}</p>
                <div className='mt-2 flex items-center gap-2 bg-light rounded-lg px-2'>
                    <Link href={youtube} target="_blank"  className='w-10'> <YoutubeIcon /> </Link>
                </div>
            </div>
        </article>
    )
}


const FeatureProject = ({type, title, summary, img, link, youtube}) => {
    return (
        <article className='w-full mt-16 flex items-center justify-between rounded-3xl p-6 border border-solid border-dark bg-light shadow-2xl
            lg:flex-col lg:p-8 xs:rounded-2xl xs:rounded-br-3xl xs:p-4 xs:mt-8
        '>
            <Link href={link} target="_blank" 
            className='w-1/2 cursor-pointer overflow-hidden rounded-lg lg:w-full'
            >
                <Image src={img} alt={title} className='w-full h-auto '/>
            </Link>

            <div className='w-1/2 flex flex-col items-start justify-between pl-6 lg:w-full lg:pl-0 lg:pt-6'>
                <span className='text-primary font-medium text-xl xs:text-base'>{type}</span>
                <Link href={link} target="_blank" className='hover:underline underline-offset-2'>
                    <h2 className='my-2 w-full text-left text-4xl font-bold sm:text-sm'>{title}</h2>
                </Link>
                <p className='my-2 font-small'>{summary}</p>
                <div className='mt-2 flex items-center gap-2'>
                    <Link href={youtube} target="_blank"  className='w-10'> <YoutubeIcon /> </Link>
                    <Link href={link} target="_blank" className='hover:underline underline-offset-2'>to listen...</Link>
                </div>
            </div>
        </article>
    )
}

const projects = () => {
    return (
        <>
             <Head>
                <title>
                    Aniel Someillan | Projects
                </title>
                <meta name='All information about my past, present and future projects and artist colaborations' content='My project page' />
            </Head>
            <main className='w-full mb-16 flex flex-col items-center justify-center xs:mt-5'>
                <Layout className='pt-16'>
                    <AnimatedText className='text-6xl lg:!text-5xl sm:mb-6 sm:!text-4xl xs:!text-2xl xs:!mb-0' text={`"Imagination it's the preview of life's coming attractions."`} />
                    <div className='grid grid-cols-12 gap-24 xl:gap-x-16 lg:gap-x-8 md:gap-y-8 sm:gap-x-1 '>
                        <div className='col-span-12'>
                            <FeatureProject
                            type="Feature Project"
                            title="Ílú trio" 
                            summary="Their music cannot be put in just few words — it needs to be listened to get you carried away with the melody, the groove and the feeling. The name Ílú comes from Yoruba cuban religion and means the earth where nothing exists without the music. The trio with their music discovers a new jazz music experience, enriched within the traditional standards of Afro-Cuban sounds and feeling. With Caribbean roots and long-term individual international careers, Bárbaro Crespo aka Machito (congas), Joaquín Sosa (tenor sax & clarinet) and Aniel Someillan (double bass), as Ílú trio, draw their musical inspiration from the songs of their ancestors, thanks to which the audience may enjoy a new, fusion jazz form."
                            img={project1}
                            link='https://ilu-epk.vercel.app'
                            youtube="https://www.youtube.com/watch?v=ug-NmgN5D78&t=1470s"
                            />
                        </div>
                        <div className='col-span-12'>
                            <FeatureProject
                            type="Individual Project"
                            title="Aniel y El Quilombo" 
                            summary="Embodying the essence of Latin jazz, this project is a testament to originality, intertwining its own compositions with reinterpretations of classic Cuban popular music, all infused with the rich influences of Afro and modern jazz. Aniel, with his innate innovative spirit, brings forth a tapestry of nuances, diverse sounds, and rhythms ingrained in his DNA. His unique approach seamlessly blends Afro-Cuban and Brazilian rhythms with elements drawn from European musical traditions, all while embracing the cutting-edge currents of modern jazz. The outcome is a contemporary aesthetic that unfolds harmonically, melodically, and rhythmically, offering a captivating fusion of tradition and innovation."
                            img={project2}
                            link='https://open.spotify.com/album/1DREd4DiKoBZysb3warjl5?si=L3VRM6QYQfaWEjC4DWLsxQ'
                            youtube="https://www.youtube.com/watch?v=QtgpURPdVQc&t=3934s"
                            />
                        </div>
                        <div className='col-span-12'>
                            <FeatureProject
                            type="Feature Project"
                            title="Odyssey" 
                            summary="Odyssey is the result of a multicultural project led by the Spanish singer Alba Santos and the Cuban double bassist Aniel Someillan, involving young composers. The album was recorded in the city of Colombo, Sri Lanka, with the Brazilian drummer Isaias Alves and the Indian pianist Anurag Naidú. It brings together compositions that emerged during this collaboration, resulting in an extravagant intercultural project."
                            img={project3}
                            link='https://open.spotify.com/album/1dVpFsHYwATW0VsPGfd5ZI?si=qeTUwMXQTZWhFsrJGwlVAQ'
                            youtube="https://www.youtube.com/watch?v=ysGmw90I-18&t=4s"
                            />
                        </div>
                        <div className='col-span-6 sm:col-span-12'>
                            <Project 
                            type="Summer and Winter Fall 2023"
                            title="Amaro Freitas Trio" 
                            img={project4}
                            link='https://open.spotify.com/artist/3Y37ixG7KDgDqxSE6PL679?si=DpaHeyL2Taa72o8311OY7Q'
                            youtube="https://www.youtube.com/watch?v=7dIrnzFM4hI&t=201s"
                            />
                        </div>
                        <div className='col-span-6 sm:col-span-12'>
                             <Project 
                            type="Summer and Fall Tour 2022"
                            title="Dayme Arocena" 
                            img={project5}
                            link='https://open.spotify.com/track/4YKRvsBW0T6Db4Owvx6TNf?si=2ab32c9e62074a7a'
                            youtube="https://www.youtube.com/watch?v=WRC0nbpEFJ8"
                            />
                        </div>
                        <div className='col-span-6 sm:col-span-12'>
                             <Project 
                            type="Band Member 2016-2020"
                            title="Luedji Luna" 
                            img={project6}
                            link='https://open.spotify.com/track/5TTWOyGAjATPEuDiTIRd62?si=f9a259e68e9b40e6'
                            youtube="https://www.youtube.com/watch?v=YwoCX1z2at8&t=3535s"
                            />
                        </div>
                        <div className='col-span-6 sm:col-span-12'>
                             <Project 
                            type="Artist Colaborations"
                            title="Julito Padron" 
                            img={project7}
                            link='#'
                            youtube="#"
                            />
                        </div>
                    </div>
                </Layout>
            </main>
        </>
    )
}

export default projects
