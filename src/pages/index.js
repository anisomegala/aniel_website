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
import { useState, useRef, useEffect } from 'react';
import Magnetic from '../components/Magnetic';
import InnerCircle from '../components/InnerCircle';
import { useRouter } from 'next/router';
import en from '../../locales/en.json';
import es from '../../locales/es.json';
import pt from '../../locales/pt.json';
import pl from '../../locales/pl.json';

const StickyAudioPlayer = dynamic(() => Promise.resolve(() => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    const duration = audioRef.current.duration;
    const ct = audioRef.current.currentTime;
    setProgress((ct / duration) * 100);
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-1 -translate-x-1/2 w-[94vw] max-w-md z-50 shadow-2xl"
    >
      <div className="flex items-center bg-light/90 dark:bg-dark/90 backdrop-blur-md p-2 rounded-full border border-primary/30 relative overflow-hidden">

        {/* Background Progress Bar (Subtle) */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        />

        <div className="flex items-center justify-center w-full px-2 gap-3 sm:gap-4">

          {/* 1. Play/Pause Custom Button */}
          <button
            onClick={togglePlay}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <span className="flex gap-1">
                <div className="w-1 h-4 bg-light rounded-full animate-pulse" />
                <div className="w-1 h-4 bg-light rounded-full animate-pulse delay-75" />
              </span>
            ) : (
              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-light border-b-[8px] border-b-transparent ml-1" />
            )}
          </button>

          {/* 2. Audio Info */}
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <p className="text-[10px] sm:text-xs font-bold text-dark dark:text-light truncate">
                Black Narcissus — Aniel Someillan
              </p>
            </div>
            {/* Hidden Native Player for Logic */}
            <audio
              ref={audioRef}
              onTimeUpdate={onTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              preload="none"
            >
              <source src="/audio/Black_Narcissus.mp3" type="audio/mpeg" />
            </audio>
          </div>

          {/* 3. LIVE Badge (Smaller on mobile) */}
          <div className="flex-shrink-0 px-3 py-1 rounded-full bg-dark/5 dark:bg-light/10 border border-dark/10 dark:border-light/10">
            <span className="text-primary text-[8px] sm:text-[10px] font-black tracking-widest uppercase">LIVE</span>
          </div>

        </div>
      </div>
    </motion.div>
  );
}), { ssr: false });

const gridItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
  })
};

// Inside your NavCard component:
const NavCard = ({ index, title, href, description, className = "" }) => {
  return (
    // The className must be here on the outermost tag for the grid to work
    <Link
      href={href}
      className={`block w-full h-full ${className}`}
    >
      <div className="group p-8 rounded-2xl border border-dark/10 dark:border-light/10 bg-light/50 dark:bg-dark/50 backdrop-blur-sm hover:border-primary transition-all duration-300 h-full flex flex-col justify-between">
        {/* Your card content (index, title, description) */}
        <div>
          <h2 className="text-2xl font-bold mt-2">{title}</h2>
          <p className="text-sm opacity-60 mt-4">{description}</p>
        </div>
        <div className="self-end text-primary group-hover:translate-x-2 transition-transform">
          →
        </div>
      </div>
    </Link>
  );
};

export default function Home() {
  const router = useRouter();
  const { locale } = router;

  // Use the synchronized translation files
  const t = locale === 'es' ? es : locale === 'pt' ? pt : locale === 'pl' ? pl : en;

  return (
    <>
      <Head>
        <title>Aniel Someillan | Afro-Cuban Jazz Bassist & Composer</title>
        <meta name="description" content="Official portfolio of Aniel Someillan, a versatile Cuban musician and bass player. Winner of Jazz Junior Competition and Montreux Jazz Academy invitee." />

        {/* Social Media Preview Tags */}
        <meta property="og:title" content="Aniel Someillan | Professional Musician" />
        <meta property="og:description" content="Explore the musical journey of Aniel Someillan, featuring Ilú Trio and international collaborations." />
        <meta property="og:image" content="https://anielsomeillan.com/images/profile/profile_main_pic.png" />
        <meta property="og:type" content="website" />
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
                <AnimatedText text={t.home.quote} className='text-left !text-4xl lg:!text-center md:!text-3xl sm:!text-2xl' />

                <p className='my-4 text-base font-medium md:text-sm sm:text-xs leading-relaxed'>
                  {t.home.biography}
                </p>

                <div className='flex items-center self-start mt-2 gap-4 lg:self-center'>
                  <Magnetic >
                    <Link href='/anielCV.pdf' target={'_blank'} className='flex items-center bg-dark text-light p-2.5 px-6 rounded-lg text-lg font-semibold hover:bg-light hover:text-dark border border-solid border-transparent hover:border-primary dark:bg-light dark:text-dark hover:dark:bg-dark hover:dark:text-light transition-all'>
                      {t.home.resume} <LinkArrow className={'!w-6 ml-1'} />
                    </Link>
                  </Magnetic>
                  <Magnetic>
                    <Link href='/contact'>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2.5 rounded-full border border-dark dark:border-light bg-transparent 
               text-dark dark:text-light text-lg font-semibold tracking-wide
               hover:bg-dark hover:text-light dark:hover:bg-light dark:hover:text-dark 
               transition-all duration-300 cursor-pointer text-center inline-block"
                      >
                        {t.home.getInTouch}
                      </motion.div>
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </div>

            {/* Right: Navigation Grid aligned to top of picture */}
            <div className='w-3/5 lg:w-full grid grid-cols-2 sm:grid-cols-1 gap-4 pt-0'>
              <NavCard
                index={1}
                title={t.nav.about}
                href="/about"
                description="Musical explorer hailing from the vibrant streets of Havana..."
              />
              <NavCard
                index={2}
                title={t.nav.projects}
                href="/projects"
                description="Their music cannot be put in just few words..."
              />
              <NavCard
                index={3}
                title={t.nav.shows}
                href="/shows"
                description="List of upcoming musical performances..."
              />
              <NavCard
                index={4}
                title={t.nav.articles}
                href="/articles"
                description="Read online articles about me..."
              />

              {/* This item now stretches across both columns */}
              <NavCard
                className="col-span-2 sm:col-span-1"
                index={5}
                title={t.nav.shop}
                href="/shop"
                description={`${t.shop.title} is my online store - Visit`}
              />
            </div>
          </div>
        </Layout>
        <InnerCircle />
        <StickyAudioPlayer />

      </main>
    </>
  )
}