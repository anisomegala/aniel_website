import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import AnimatedText from '../components/AnimatedText';
import Link from 'next/link';
import { useRouter } from 'next/router';
import en from '../../locales/en.json';
import es from '../../locales/es.json';
import pt from '../../locales/pt.json';
import pl from '../../locales/pl.json';

export default function Success() {
    useEffect(() => {
        if (window.fbq) {
            window.fbq('track', 'Purchase', {
                currency: 'USD',
                // Ideally, pass the value from the Stripe session or a fixed value
                value: 0.00
            });
        }
    }, []);

    const router = useRouter();
    const { locale } = router;

    // Mapping locales to translation files
    const t = locale === 'es' ? es : locale === 'pt' ? pt : locale === 'pl' ? pl : en;

    return (
        <Layout className='pt-32 text-center'>
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center text-4xl mb-6">✓</div>

                {/* Localized Thank You Message */}
                <AnimatedText text={t.success.title} className='!text-5xl' />

                {/* Localized Confirmation Subtext */}
                <p className='text-lg mt-4 opacity-80'>{t.success.message}</p>

                {/* Localized Navigation Link */}
                <Link href="/" className="mt-10 underline text-xl font-bold hover:text-primary transition-colors">
                    {t.nav.home}
                </Link>
            </div>
        </Layout>
    );
}