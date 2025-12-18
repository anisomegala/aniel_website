import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import AnimatedText from '../components/AnimatedText'
import Layout from '../components/Layout'
import UpcomingShows from '../components/UpcomingShows'

const shows = () => {
    return (
        <div>
             <Head>
                <title>
                    Aniel Someillan | Shows
                </title>
                <meta name='Check out my upcoming shows, recordings and artist colaborations.' content='Upcoming Shows' />
            </Head>
            <main className='flex w-full flex-col items-center justify-center'>
                <Layout className='pt-16'>
                     <AnimatedText text='"Art is a lie that makes us realize truth."'  className='px-16 mb-8 lg!text-4xl sm:!text-2xl xs:!text-1xl sm:mb-2 xs:mt-5'/>
                    <UpcomingShows />
                </Layout>
            </main>    
        </div>
    )
}

export default shows
