import '@/styles/globals.css'
import { Poppins } from 'next/font/google'
import Head from 'next/head'
import Script from 'next/script'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import CookieConsent from '@/components/CookieConsent';
import Footer from '../components/Footer'
import Schema from '../components/Schema';
import { AnimatePresence } from 'framer-motion'
import Loader from '../components/Loader'

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ['latin'],
  variable: '--font-pp',
})

const SITE_URL = 'https://anielsomeillan.com'
const LOCALES = ['en', 'es', 'pt', 'pl']

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { pathname, locale } = router;

  // Canonical uses pathname without query/hash; strip locale prefix for default locale
  const canonicalPath = pathname === '/' ? '' : pathname;
  const canonicalUrl = `${SITE_URL}${locale && locale !== 'en' ? `/${locale}` : ''}${canonicalPath}`;

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('visited');
    if (hasVisited) {
      setLoading(false);
      return;
    }
    sessionStorage.setItem('visited', '1');
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : 'unset';
  }, [loading]);

  useEffect(() => {
    const handleRouteChange = () => {
      if (window.fbq) window.fbq('track', 'PageView');
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  const isStandalone = pathname === '/memorias'

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Aniel Someillan" />
        <meta name="theme-color" content="#b8975a" />
        <link rel="icon" href="/favicon.ico" />

        {/* Canonical — updates per page and locale */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Hreflang — multilingual SEO */}
        {LOCALES.map((l) => (
          <link
            key={l}
            rel="alternate"
            hrefLang={l}
            href={`${SITE_URL}${l !== 'en' ? `/${l}` : ''}${canonicalPath}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${canonicalPath}`} />

        {/* Default OG / Twitter — overridden by individual pages */}
        <meta property="og:site_name" content="Aniel Someillan" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Aniel Someillan | Afro-Cuban Jazz Bassist & Composer" />
        <meta property="og:description" content="Official website of Aniel Someillan — Cuban double bassist and composer based in Warsaw. Jazz Plaza 2026, Montreux Jazz Academy 2023, Jazz Junior winner." />
        <meta property="og:image" content={`${SITE_URL}/images/profile/profile_main_pic.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Aniel Someillan | Afro-Cuban Jazz Bassist & Composer" />
        <meta name="twitter:description" content="Cuban double bassist and composer based in Warsaw. Jazz Plaza 2026 laureate, Montreux Jazz Academy 2023, Jazz Junior winner." />
        <meta name="twitter:image" content={`${SITE_URL}/images/profile/profile_main_pic.png`} />
      </Head>

      <Schema />
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />

      {isStandalone ? (
        <Component {...pageProps} key={router.asPath} />
      ) : (
        <>
          <AnimatePresence mode="wait">
            {loading && <Loader key="loader" finishLoading={() => setLoading(false)} />}
          </AnimatePresence>

          <main className={`${poppins.variable} font-pp bg-light dark:bg-dark w-full min-h-screen`}>
            <NavBar />
            {!loading && (
              <Component {...pageProps} key={router.asPath} />
            )}
            <CookieConsent />
            <Footer />
          </main>
        </>
      )}
    </>
  )
}
