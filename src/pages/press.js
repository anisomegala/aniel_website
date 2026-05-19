import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import AnimatedText from '@/components/AnimatedText';

const photos = [
  {
    src: '/images/press/press-performance-jazz-plaza.jpg',
    hires: '/images/press/hires/press-performance-jazz-plaza.jpg',
    alt: 'Aniel Someillan — Jazz Plaza, Havana 2026',
    caption: 'Jazz Plaza, Havana — January 2026',
    width: 900,
    height: 1200,
  },
  {
    src: '/images/press/press-portrait-bw.jpg',
    hires: '/images/press/hires/press-portrait-bw.jpg',
    alt: 'Aniel Someillan — Press Portrait (B&W)',
    caption: 'Portrait',
    width: 1400,
    height: 1866,
  },
  {
    src: '/images/press/press-portrait-color.jpg',
    hires: '/images/press/hires/press-portrait-color.jpg',
    alt: 'Aniel Someillan — Press Portrait (Color)',
    caption: 'Portrait — Color',
    width: 1400,
    height: 1866,
  },
  {
    src: '/images/press/press-live-color.jpg',
    hires: '/images/press/hires/press-live-color.jpg',
    alt: 'Aniel Someillan — Live Performance',
    caption: 'Live Performance',
    width: 1024,
    height: 1024,
  },
];

const credentials = [
  { year: '2026', title: 'Festival Internacional Jazz Plaza, Havana', detail: 'MJAF Laureate — 41st edition, with Rodney Barreto, Yilian Cañizares, Rolando Luna, Harold López Nussa & Héctor Quintana' },
  { year: '2023', title: 'Montreux Jazz Academy', detail: 'Selected by the Montreux Jazz Artist Foundation' },
  { year: '2022', title: 'Jazz Junior Competition — 1st Place', detail: 'With trio Ilú, Kraków, Poland' },
  { year: '2021', title: 'Radio Katowice Young Talents', detail: 'Winner' },
];

const links = [
  { label: 'Music', href: 'https://ilucuba.bandcamp.com/album/il', icon: '🎵' },
  { label: 'Live Video', href: 'https://www.youtube.com/live/QtgpURPdVQc?si=Tbq02o9DULAt2BdI', icon: '📹' },
  { label: 'Website', href: 'https://www.anielsomeillan.com', icon: '🌐' },
  { label: 'Instagram', href: 'https://instagram.com/anielsomeillan', icon: '📷' },
  { label: 'Contact', href: 'mailto:anielsomeillan@icloud.com', icon: '✉️' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' } }),
};

const Press = () => {
  return (
    <>
      <Head>
        <title>Press Kit — Aniel Someillan | Afro-Cuban Jazz Double Bassist</title>
        <meta name="description" content="Press photos, bio and media links for Aniel Someillan — Afro-Cuban jazz double bassist based in Warsaw." />
      </Head>

      <main className="flex w-full flex-col items-center justify-center dark:text-light">
        <Layout className="pt-16">

          <AnimatedText
            text="Press Kit"
            className="!text-6xl mb-4 lg:!text-5xl md:!text-4xl sm:!text-3xl"
          />
          <p className="text-center text-dark/60 dark:text-light/60 text-lg mb-16 font-medium">
            Aniel Someillan — Afro-Cuban Jazz / Double Bass / Warsaw
          </p>

          {/* ── PHOTO GRID ── */}
          <section className="mb-20">
            <h2 className="text-xl font-bold uppercase tracking-widest text-primary mb-8">Press Photos</h2>
            <p className="text-sm text-dark/50 dark:text-light/50 mb-8 -mt-4">
              All photos free to use for promotional purposes. Click "Download Hi-Res" for print-quality files.
            </p>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-1">
              {photos.map((photo, i) => (
                <motion.div
                  key={photo.src}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="group relative overflow-hidden rounded-2xl border border-dark/10 dark:border-light/10 shadow-lg"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-light text-sm font-medium">{photo.caption}</span>
                      <a
                        href={photo.hires}
                        download
                        className="text-xs font-bold bg-light text-dark px-3 py-1.5 rounded-full hover:bg-primary hover:text-light transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Download Hi-Res
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── BIO ── */}
          <section className="mb-20 grid grid-cols-12 gap-16 md:flex md:flex-col md:gap-8">
            <div className="col-span-7">
              <h2 className="text-xl font-bold uppercase tracking-widest text-primary mb-6">Short Bio</h2>
              <div className="space-y-5 text-lg leading-relaxed text-dark/80 dark:text-light/80">
                <p>
                  <strong>Aniel Someillan</strong> is a Cuban-born double bassist and composer based in Warsaw, Poland.
                  A graduate of the <strong>Amadeo Roldán Music Conservatory</strong> in Havana, he has built an international
                  career at the crossroads of Afro-Cuban jazz, son cubano, and contemporary improvised music.
                </p>
                <p>
                  Selected as a <strong>Montreux Jazz Artist Foundation laureate</strong> to perform at the{' '}
                  <strong>41st Festival Internacional Jazz Plaza in Havana (January 2026)</strong> alongside Rodney Barreto, Yilian Cañizares, Rolando Luna, Harold López Nussa and Héctor Quintana,
                  winner of the <strong>Jazz Junior Competition 2022</strong> with his group Ilú, and a{' '}
                  <strong>Montreux Jazz Academy 2023</strong> participant, Someillan has established himself as a distinctive voice
                  in the European jazz scene.
                </p>
                <p>
                  He spent three years as bassist for <strong>Luedji Luna</strong> and two years working with pianist{' '}
                  <strong>Amaro Freitas</strong> — two of Brazil's most internationally recognised artists — and has shared
                  the stage with <strong>Giovanni Hidalgo, Daymé Arocena, Shabaka Hutchings, Julito Padrón,
                  Roberto Carcasses</strong> and <strong>Shai Maestro</strong>.
                  His project <em>Aniel y el Quilombo</em> — born from a residency in Brazil — produced the album{' '}
                  <em>Quilombo</em>, weaving Afro-Cuban rhythms with Brazilian and pan-African influences.
                </p>
              </div>
            </div>

            {/* ── CREDENTIALS ── */}
            <div className="col-span-5">
              <h2 className="text-xl font-bold uppercase tracking-widest text-primary mb-6">Awards & Recognition</h2>
              <div className="space-y-4">
                {credentials.map((c, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="p-4 rounded-xl border border-dark/10 dark:border-light/10 bg-light/50 dark:bg-dark/50"
                  >
                    <span className="text-primary font-bold text-sm">{c.year}</span>
                    <p className="font-bold text-dark dark:text-light mt-0.5">{c.title}</p>
                    <p className="text-sm text-dark/60 dark:text-light/60 mt-0.5">{c.detail}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── LINKS ── */}
          <section className="mb-20">
            <h2 className="text-xl font-bold uppercase tracking-widest text-primary mb-6">Media & Contact</h2>
            <div className="flex flex-wrap gap-4">
              {links.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-primary/30 bg-light/50 dark:bg-dark/50 hover:bg-primary hover:text-light hover:border-primary font-bold transition-all duration-200"
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </motion.a>
              ))}
            </div>
          </section>

          {/* ── USAGE NOTE ── */}
          <section className="mb-12 p-6 rounded-2xl border border-primary/20 bg-primary/5">
            <p className="text-sm text-dark/70 dark:text-light/70 leading-relaxed">
              <strong>Photo usage:</strong> All press photos may be used freely for promotional, editorial and press purposes.
              Please credit the photographer where indicated. For interviews, booking enquiries or additional materials,
              contact <a href="mailto:anielsomeillan@icloud.com" className="text-primary font-bold hover:underline">anielsomeillan@icloud.com</a> or{' '}
              <a href="tel:+48784161684" className="text-primary font-bold hover:underline">+48 784 161 684</a>.
            </p>
          </section>

        </Layout>
      </main>
    </>
  );
};

export default Press;
