import Head from 'next/head'
import React from 'react'
import Layout from '@/components/Layout'
import AnimatedText from '@/components/AnimatedText'
import { motion } from 'framer-motion'
import Image from 'next/image'
import profile_main_pic from '../../public/images/profile/aboutImage.jpg'
import { useRouter } from 'next/router'
import en from '../../locales/en.json'
import es from '../../locales/es.json'
import pt from '../../locales/pt.json'
import pl from '../../locales/pl.json'

// Animation for section headers
const titleVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function About() {
  const router = useRouter();
  const { locale } = router;

  // Mapping locales to translation files
  const t = locale === 'es' ? es : locale === 'pt' ? pt : locale === 'pl' ? pl : en;

  return (
    <>
      <Head>
        <title>About Aniel Someillan | Professional Musician & Bassist</title>
        <meta name="description" content="Detailed biography of Aniel Someillan - Cuban musician, Bachelor in Classical Guitar, and Jazz Junior Competition winner." />
      </Head>
      
      <main className="flex w-full flex-col items-center justify-center dark:text-light">
        <Layout className="pt-16">
          <AnimatedText 
            text={t.about.title} 
            className="!text-6xl mb-16 lg:!text-5xl md:!text-4xl sm:!text-3xl"
          />

          <div className="grid w-full grid-cols-12 gap-16 md:flex md:flex-col md:gap-8">
            
            {/* LEFT: THE FULL STORY (Detailed SEO Content) */}
            <div className="col-span-7 flex flex-col items-start justify-start md:order-2">
              <motion.h2 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={titleVariants}
                className="mb-6 text-xl font-bold uppercase text-primary tracking-widest"
              >
                {t.about.journeyTitle}
              </motion.h2>

              <div className="space-y-6 text-lg font-medium leading-relaxed text-dark/80 dark:text-light/80">
                <p>
                  {t.about.p1}
                </p>

                <p>
                  {t.about.p2}
                </p>

                <p>
                  {t.about.p3}
                </p>

                <blockquote className="py-6 border-y border-primary/20 italic text-2xl text-dark dark:text-light font-bold lg:text-xl">
                  {t.about.quote}
                </blockquote>

                <p>
                  {t.about.p4}
                </p>
              </div>
            </div>

            {/* RIGHT: STICKY IMAGE CONTAINER */}
            <div className="col-span-5 md:order-1">
              <div className="sticky top-24">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="relative group overflow-hidden rounded-2xl border border-primary/20 shadow-2xl"
                >
                  {/* Subtle overlay effect on hover */}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  
                  <Image 
                    src={profile_main_pic} 
                    alt="Aniel Someillan - Bassist" 
                    className="w-full h-auto grayscale-[20%] hover:grayscale-0 transition-all duration-700 ease-in-out"
                    priority
                  />
                  
                  {/* Floating decorative elements */}
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl -z-10" />
                  <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
                </motion.div>

                {/* Quick Info Grid under image */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-light/50 dark:bg-dark/50 border border-dark/5 border-light/5">
                        <h4 className="text-primary font-bold text-sm uppercase">{t.about.education}</h4>
                        <p className="text-xs font-medium">{t.about.eduDegree}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-light/50 dark:bg-dark/50 border border-dark/5 border-light/5">
                        <h4 className="text-primary font-bold text-sm uppercase">{t.about.focus}</h4>
                        <p className="text-xs font-medium">{t.about.focusInstrument}</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </main>
    </>
  )
}