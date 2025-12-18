import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import styles from '@/styles/Home.module.css'
import Layout from '../components/Layout'
import profile_main_pic from '../../public/images/profile/profile_main_pic.png'
import AnimatedText from '../components/AnimatedText'

import { LinkArrow } from '../components/icons'
import MoreOfMe from '../components/MoreOfMe'


const CustomLink = ({href, title, className}) => {

    return (
        <Link href={href} className={`${className} relative group`}>
            {title}
           <span className={`h-1 inline-block bg-dark  w-0 absolute left-0 
            -bottom-0.5 group-hover:w-full transition-[width] 
            ease duration-600`}
            >&nbsp;</span>
        </Link>
    )
}


export default function Home() {
  return (
    <>
      <Head>
        <title>Aniel Someillan | Home </title>
        <meta name="Versatile musician from Cuba, bachelor in arts and music. Electric and Double Bass player" content="Overview of the website" />
      </Head>
      <main className='flex items-center text-primaryText w-full min-h-screen dark:text-light'>
        <Layout className='pt-0 md:pt-16 sm:pt-8'>
          <div className='flex items-center justify-between w-full lg:flex-col'>
            <div className='md-w:full'>
              <Image  src={profile_main_pic} alt='aniel Someillan' className='w-full h-auto lg:hidden md:inline-block md:w-full md:my-4' priority  />
            </div>
            <div className='w-1/2 flex flex-col items-center self-center lg:w-full lg:text-center'>
              <AnimatedText text='"Life without playing music is inconceivable to me. I live my daydreams in music. I see my life in terms of music."'  className='text-left xl:!text-5xl lg:!text-center lg:!text-4xl md:!text-3xl sm:!text-2xl'/>
              <p className='my-4 text-base font-medium md:text-sm sm:text-xs'>
                I am Aniel Someillan, a versatile musician holding a Bachelor's in Classical Guitar. Notable achievements include winning the Jazz Junior Competition with "Ilú" and receiving an invitation to the Montreux Jazz Academy. Fluent in English, Portuguese, and Spanish, my career reflects my commitment to musical excellence, diverse collaborations, and ongoing innovation.
              </p>
              <div className='flex items-center self-start mt-2 gap-4 cursor-pointer lg:self-center'>
                <Link href='/anielCV.pdf' target={'_blank'}
                className='flex items-center bg-dark text-light p-2.5 px-6 
                rounded-lg text-lg font-semibold hover:bg-light hover:text-dark
                border border-solid  border-transparent hover:border-primary dark:bg-light dark:text-dark hover:dark:bg-dark hover:dark:text-light hover:dark:border-light
                md:p-2 md:px-4 md:text-base cursor-pointer
                '

                download={true}
                >Résumé <LinkArrow className={'!w-6 ml-1'}/>
                </Link>

                <CustomLink href='mailto:anielsomeillan@icloud.com' title='Contact' target={'_blank'}
                className='mr-4 text-lg font-medium capitalize text-dark dark:text-light md:text-base'/>

              </div>
            </div>
          </div>
        </Layout>
        <MoreOfMe  />
      </main>
    </>
  )
}
