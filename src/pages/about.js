import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import AnimatedText from '../components/AnimatedText'
import Layout from '../components/Layout'

import about_pic from '../../public/images/profile/about_pic.jpg'
import Skills from '../components/Skills'

const about = () => {
    return (
        <div>
            <Head>
            <title>
                    Aniel Someillan | About 
                </title>
                <meta name='I am Aniel Someillan, a musical explorer hailing from the vibrant streets of Havana.My journey began at age 6, progressing from a local music school...' content='my bio' />
            </Head>
            <main className='flex w-full flex-col items-center justify-center dark:text-light'>
                <Layout className='pt-16'>
                    <AnimatedText text='"Music, like dreams, reveals the secrets of the soul, expressing what words often fail to convey. In its harmonies and rhythms, we may find the unconscious melodies of our innermost desires and fears."'  className='mb-8 lg!text-4xl sm:!text-2xl xs:!text-1xl sm:mb-2 xs:mt-5'/>
                    
                    <div className='grid w-full grid-cols-9 gap-16 mt-8 md:flex md:flex-col md:items-center md:justify-center sm:gap-8 '>
                        <div className='col-span-3 flex flex-col items-start  xl:col-span-6 md:order-2  md:col-span-9'>
                            <h2 className='mb-4 text-4xl font-bold uppercase text-dark'>Bio</h2>
                            <p className='font-medium'>
                                I am Aniel Someillan, a musical explorer hailing from the vibrant streets of Havana. My journey began at age 6, progressing from a local music school to earning a Bachelor's in Classical Guitar at the esteemed Amadeo Roldan Music Conservatory. 
                            </p>
                            <p className='font-medium'>
                                My musical palette extends beyond Classical Guitar, encompassing mastery over various instruments. The founding of "Aniel y el Quilombo" stands as a testament to my entrepreneurial spirit and creative prowess, culminating in the acclaimed album "Quilombo."
                            </p>
                            <p className='my-4 font-medium'>
                               In the realm of Jazz, I garnered recognition by clinching victory in the Jazz Junior Competition with the enthralling ensemble "Ilú." 
                            </p>
                           
                        </div>
                        <div className='col-span-3 relative self-center h-max xl:col-span-6 rounded-2xl border-2 border-solid  bg-light p-8
                            dark:bg-dark dark:border-light xl:col-span-4 md:order-1 md:col-span-9 xs:col-span-9 
                         '>
                            <Image src={about_pic} alt='aniel someillan playing' 
                            priority
                            sizes="max-width:768px) 100vw,
                            (max-width: 1200px) 50vw,
                            33vw
                            "
                            className='w-full h-auto rounded-2xl md:w-full xs:col-span-9 ' />
                        </div>
                        <div className='col-span-3 flex flex-col items-start justify-center xl:col-span-12 xl:flex-row xl:items-ce md:order-3 xl:gap-4'>
                             <p className='font-medium'>
                                Recent chapters of my musical journey involve captivating collaborations with esteemed artists such as Giovanni Hidalgo, Ifiude, Daymé Arocena, Eduardo Campos (Visitante Calle 13), Rafa Pabón, Julito Padron, Roberto Carcasses, Amaro Freitas, Shabaka Hutchings, and more. These partnerships have added depth and diversity to my artistic expression.
                            </p>
                            <p className='mt-2 font-medium xl:mt-0'>
                                Language poses no barrier; I am fluent in English, Portuguese, and possess native fluency in Spanish. My career is a tapestry woven with a commitment to musical excellence, diverse collaborations, and an unwavering dedication to innovation. As I continue to explore uncharted musical territories, I stand as a beacon of inspiration for aspiring musicians worldwide.
                            </p>
                        </div>
                    </div>
                    <Skills />
                </Layout>
            </main>
        </div>
    )
}

export default about
