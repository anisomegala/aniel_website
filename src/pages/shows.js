import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import AnimatedText from '@/components/AnimatedText';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import en from '../../locales/en.json';
import es from '../../locales/es.json';
import pt from '../../locales/pt.json';
import pl from '../../locales/pl.json';

const ShowItem = ({ show, t }) => {
  const router = useRouter();
  const { locale } = router;
  
  const dateObj = new Date(show.date);
  const day = dateObj.toLocaleDateString(locale, { day: '2-digit' });
  const month = dateObj.toLocaleDateString(locale, { month: 'short' });

  const formatGoogleDate = (date) => {
    return new Date(date).toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  // IMPROVED: Extract URL from description even if it has other text
  const extractUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text?.match(urlRegex);
    return match ? match[0] : null;
  };

  const ticketUrl = extractUrl(show.link); //
  
  const startTime = formatGoogleDate(show.date);
  const endTime = formatGoogleDate(new Date(new Date(show.date).getTime() + 2 * 60 * 60 * 1000));

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(show.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent("Details: " + (ticketUrl || show.link))}&location=${encodeURIComponent(show.location)}`;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between w-full p-6 mb-4 rounded-2xl border border-dark/10 dark:border-light/10 bg-light/50 dark:bg-dark/50 backdrop-blur-sm sm:flex-col sm:items-start sm:gap-4"
    >
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center border-r border-primary/30 pr-8 text-primary font-bold">
          <span className="text-sm uppercase">{month}</span>
          <span className="text-2xl">{day}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold dark:text-light">{show.title}</h3>
          <p className="text-dark/60 dark:text-light/60">{show.location}</p>
        </div>
      </div>
      
      {/* BUTTON GROUP: Placed alongside */}
      <div className="flex items-center gap-4 sm:w-full">
        {/* BUY TICKETS BUTTON: Shows if a URL was found */}
        {ticketUrl && (
          <a 
            href={ticketUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-primary text-light px-6 py-2 rounded-full font-semibold hover:scale-105 transition-all text-sm shadow-lg text-center flex-1 whitespace-nowrap"
          >
            {/* Fallback to ensure text always appears */}
            {t?.shows?.buyTicketsBtn || "Get Tickets"}
          </a>
        )}

        {/* ADD TO CALENDAR BUTTON */}
        <a 
          href={googleCalendarUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-dark/10 text-dark px-6 py-2 rounded-full font-semibold hover:bg-dark hover:text-light transition-all dark:bg-light/10 dark:text-light dark:hover:bg-light dark:hover:text-dark text-sm text-center flex-1 whitespace-nowrap"
        >
          + {t?.shows?.calendarBtn}
        </a>
      </div>
    </motion.div>
  );
};
export default function Shows() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();
  const { locale } = router;

  // Mapping locales to translation files
  const t = locale === 'es' ? es : locale === 'pt' ? pt : locale === 'pl' ? pl : en;

  useEffect(() => {
    fetch('/api/getShows')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch shows');
        return res.json();
      })
      .then(data => setShows(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const pageMeta = {
    en: { title: 'Upcoming Shows | Aniel Someillan', desc: 'Live performance dates and upcoming shows by Aniel Someillan. Tickets and calendar links.' },
    pt: { title: 'Shows | Aniel Someillan', desc: 'Datas de shows ao vivo e próximas apresentações de Aniel Someillan.' },
    es: { title: 'Conciertos | Aniel Someillan', desc: 'Fechas de conciertos en vivo y próximas actuaciones de Aniel Someillan.' },
    pl: { title: 'Koncerty | Aniel Someillan', desc: 'Nadchodzące koncerty Aniela Someillana. Bilety i linki do kalendarza.' },
  };
  const meta = pageMeta[locale] || pageMeta.en;

  return (
    <>
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.desc} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.desc} />
      <meta property="og:url" content={`https://anielsomeillan.com${locale !== 'en' ? `/${locale}` : ''}/shows`} />
    </Head>
    <main className="w-full min-h-screen dark:text-light">
      <Layout>
        <AnimatedText text={t.nav.shows} className="!text-7xl mb-16 lg:!text-6xl md:!text-4xl"  />
        
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="animate-pulse text-center">{t.shows.syncing}</div>
          ) : error ? (
            <p className="text-center opacity-60">{t.shows.error}</p>
          ) : shows.length > 0 ? (
            shows.map(show => <ShowItem key={show.id} show={show} t={t} />)
          ) : (
            <p className="text-center opacity-60">{t.shows.noShows}</p>
          )}
        </div>
      </Layout>
    </main>
    </>
  );
}