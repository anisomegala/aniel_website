import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import AnimatedText from '@/components/AnimatedText';
import { request } from '../lib/datocms';

export async function getStaticProps({ locale }) {
  const query = `
    query AboutQuery($locale: SiteLocale) {
      aboutMe(locale: $locale) {
        mainTitle
        journeyTitle
        p1
        p2
        p3
        p4
        quote
        educationLabel
        edudegree
        focuslabel
        focusinstrument
        profileImage {
          url
        }
      }
    }
  `;

  try {
    const data = await request({ query, variables: { locale: locale } });
    return {
      props: { aboutData: data?.aboutMe || null },
      revalidate: 60,
    };
  } catch (error) {
    return { props: { aboutData: null } };
  }
}

const titleVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const About = ({ aboutData }) => {
  if (!aboutData) return null;

  return (
    <>
      <Head>
        <title>{aboutData.mainTitle} | Professional Musician & Bassist</title>
      </Head>
      
      <main className="flex w-full flex-col items-center justify-center dark:text-light">
        <Layout className="pt-16">
          <AnimatedText 
            text={aboutData.mainTitle || ""} 
            className="!text-6xl mb-16 lg:!text-5xl md:!text-4xl sm:!text-3xl"
          />

          <div className="grid w-full grid-cols-12 gap-16 md:flex md:flex-col md:gap-8">
            
            {/* LEFT: THE FULL STORY */}
            <div className="col-span-7 flex flex-col items-start justify-start md:order-2">
              <motion.h2 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={titleVariants}
                className="mb-6 text-xl font-bold uppercase text-primary tracking-widest"
              >
                {aboutData.journeyTitle}
              </motion.h2>

              <div className="space-y-6 text-lg font-medium leading-relaxed text-dark/80 dark:text-light/80">
                <p>{aboutData.p1}</p>
                <p>{aboutData.p2}</p>
                <p>{aboutData.p3}</p>

                {aboutData.quote && (
                  <blockquote className="py-6 border-y border-primary/20 italic text-2xl text-dark dark:text-light font-bold lg:text-xl">
                    {aboutData.quote}
                  </blockquote>
                )}

                <p>{aboutData.p4}</p>
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
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  
                  {aboutData.profileImage?.url && (
                    <Image 
                      src={aboutData.profileImage.url} 
                      alt="Aniel Someillan - Bassist" 
                      width={800}
                      height={1000}
                      className="w-full h-auto grayscale-[20%] hover:grayscale-0 transition-all duration-700 ease-in-out"
                      priority
                    />
                  )}
                  
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl -z-10" />
                  <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
                </motion.div>

                {/* Quick Info Grid */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-light/50 dark:bg-dark/50 border border-dark/10 dark:border-light/10">
                        <h4 className="text-primary font-bold text-sm uppercase">{aboutData.educationLabel}</h4>
                        <p className="text-xs font-medium">{aboutData.edudegree}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-light/50 dark:bg-dark/50 border border-dark/10 dark:border-light/10">
                        <h4 className="text-primary font-bold text-sm uppercase">{aboutData.focuslabel}</h4>
                        <p className="text-xs font-medium">{aboutData.focusinstrument}</p>
                    </div>
                </div>
              </div>
            </div>

          </div>
        </Layout>
      </main>
    </>
  );
};

export default About;