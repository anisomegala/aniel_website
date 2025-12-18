import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Layout from '../components/Layout'
import profile_main_pic from '../../public/images/profile/profile_main_pic.png'
import AnimatedText from '../components/AnimatedText'
import { LinkArrow } from '../components/icons'

const StickyAudioPlayer = dynamic(() => Promise.resolve(() => (
  <motion.div 
    initial={{ y: 100 }}
    animate={{ y: 0 }}
    transition={{ delay: 1, duration: 0.5 }}
    className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50"
  >
    <div className="flex items-center gap-4 bg-light/80 dark:bg-dark/80 backdrop-blur-md p-3 rounded-full border border-primary/30 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center animate-pulse">
        <span className="text-light text-[10px] font-bold tracking-tighter">LIVE</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-xs font-bold text-dark dark:text-light truncate">Aniel Someillan - Black Narcissus</p>
        <audio controls preload="none" className="w-full h-6 scale-90 -ml-4 filter sepia brightness-110 contrast-125">
          <source src="/audio/Black_Narcissus.mp3" type="audio/mpeg" />
        </audio>
      </div>
    </div>
  </motion.div>
)), { ssr: false });

const gridItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
  })
};

const NavCard = ({ title, href, index, description }) => (
  <motion.div
    custom={index}
    initial="hidden"
    animate="visible"
    variants={gridItemVariants}
    whileHover={{ y: -10, transition: { duration: 0.2 } }}
    className="relative overflow-hidden rounded-2xl bg-light/50 dark:bg-dark/50 border border-dark/10 dark:border-light/10 p-6 backdrop-blur-sm group hover:border-primary transition-colors h-full"
  >
    <Link href={href} className="flex flex-col h-full justify-between">
      <div>
        <h3 className="text-xl font-bold text-dark dark:text-light group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-dark/60 dark:text-light/60 mt-2 leading-relaxed">{description}</p>
      </div>
      <div className="mt-4 self-end">
        <LinkArrow className="w-6 fill-dark dark:fill-light group-hover:fill-primary transition-colors" />
      </div>
    </Link>
  </motion.div>
);

export default function Home() {
  return (
    <>
      <Head>
        <title>Aniel Someillan | Professional Musician & Bass Player</title>
        <meta name="description" content="Aniel Someillan - Versatile Cuban musician, Electric and Double Bass player." />
      </Head>
      <main className='flex flex-col items-center text-primaryText w-full min-h-screen dark:text-light relative pb-24'>
        <Layout className='pt-16 md:pt-16 sm:pt-8'>
          {/* Changed items-center to items-start to align tops */}
          <div className='flex items-start justify-between w-full lg:flex-col gap-12'>
            
            {/* Left: SEO Content & Image */}
            <div className='w-2/5 flex flex-col items-center lg:w-full lg:text-center'>
              <div className="relative w-full aspect-square mb-8 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl">
                 <Image 
                    src={profile_main_pic} 
                    alt='Aniel Someillan - Professional Musician' 
                    className='w-full h-auto object-cover' 
                    priority 
                  />
              </div>
              
              <div className="w-full">
                <AnimatedText text='"Life without playing music is inconceivable to me."'  className='text-left !text-4xl lg:!text-center md:!text-3xl sm:!text-2xl'/>
                
                <p className='my-4 text-base font-medium md:text-sm sm:text-xs leading-relaxed'>
                  I am **Aniel Someillan**, a versatile musician holding a Bachelor&apos;s in Classical Guitar. Notable achievements include winning the Jazz Junior Competition with &quot;Ilú&quot; and receiving an invitation to the Montreux Jazz Academy. 
                </p>
                
                <div className='flex items-center self-start mt-2 gap-4 lg:self-center'>
                  <Link href='/anielCV.pdf' target={'_blank'} className='flex items-center bg-dark text-light p-2.5 px-6 rounded-lg text-lg font-semibold hover:bg-light hover:text-dark border border-solid border-transparent hover:border-primary dark:bg-light dark:text-dark hover:dark:bg-dark hover:dark:text-light transition-all'>
                    Résumé <LinkArrow className={'!w-6 ml-1'}/>
                  </Link>
                  <Link href='mailto:anielsomeillan@icloud.com' className="text-lg font-medium text-dark dark:text-light underline decoration-primary underline-offset-4 decoration-2">Contact</Link>
                </div>
              </div>
            </div>

            {/* Right: Navigation Grid aligned to top of picture */}
            <div className='w-3/5 lg:w-full grid grid-cols-2 sm:grid-cols-1 gap-4 pt-0'>
              <NavCard 
                index={1} 
                title="About" 
                href="/about" 
                description="Musical explorer hailing from the vibrant streets of Havana..."
              />
              <NavCard 
                index={2} 
                title="Projects" 
                href="/projects" 
                description="Their music cannot be put in just few words — it needs to be listened to get you carried away.."
              />
              <NavCard 
                index={3} 
                title="Upcoming Shows" 
                href="/shows" 
                description="List of upcoming musical performances..."
              />
              <NavCard 
                index={4} 
                title="Articles" 
                href="/articles" 
                description="Read online articles about me..."
              />
            </div>

          </div>
        </Layout>

        <StickyAudioPlayer />
      </main>
    </>
  )
}