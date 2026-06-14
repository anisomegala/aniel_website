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

const ArticleLink = ({ article, index, t }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="w-full my-4 rounded-2xl border border-dark/10 dark:border-light/10 bg-light/50 dark:bg-dark/50 backdrop-blur-sm group hover:border-primary hover:shadow-lg transition-all overflow-hidden"
    >
        <div className="h-1 bg-gradient-to-r from-primary/60 to-transparent" />
        <a href={article.link} target="_blank" rel="noopener noreferrer" className="flex gap-6 p-6 items-start sm:flex-col sm:gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm">
                {index + 1}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
                <span className="text-primary font-bold text-xs uppercase tracking-widest mb-1">
                    {article.displayLink}
                </span>
                <h2 className="text-xl font-bold group-hover:text-primary transition-colors mb-2 leading-snug">
                    {article.title}
                </h2>
                <p className="text-dark/60 dark:text-light/60 text-sm leading-relaxed mb-3 line-clamp-3">
                    {article.snippet}
                </p>
                <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    {t.articles.readFull} <span>&rarr;</span>
                </span>
            </div>
        </a>
    </motion.div>
);

export default function Articles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const router = useRouter();
    const { locale } = router;

    // Mapping locales to translation files
    const t = locale === 'es' ? es : locale === 'pt' ? pt : locale === 'pl' ? pl : en;

    useEffect(() => {
        fetch('/api/getArticles')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch articles');
                return res.json();
            })
            .then(data => setArticles(data))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    const pageMeta = {
        en: { title: 'Press & Articles | Aniel Someillan', desc: 'Press coverage and articles featuring Aniel Someillan — Afro-Cuban jazz double bassist and composer.' },
        pt: { title: 'Imprensa & Artigos | Aniel Someillan', desc: 'Cobertura de imprensa e artigos sobre Aniel Someillan — contrabaixista e compositor de jazz afro-cubano.' },
        es: { title: 'Prensa & Artículos | Aniel Someillan', desc: 'Cobertura de prensa y artículos sobre Aniel Someillan — contrabajista y compositor de jazz afrocubano.' },
        pl: { title: 'Prasa & Artykuły | Aniel Someillan', desc: 'Artykuły prasowe o Anielu Someillan — kontrabasiście i kompozytorze afrokubańskiego jazzu.' },
    };
    const meta = pageMeta[locale] || pageMeta.en;

    return (
        <>
        <Head>
            <title>{meta.title}</title>
            <meta name="description" content={meta.desc} />
            <meta property="og:title" content={meta.title} />
            <meta property="og:description" content={meta.desc} />
            <meta property="og:url" content={`https://anielsomeillan.com${locale !== 'en' ? `/${locale}` : ''}/articles`} />
        </Head>
        <main className="w-full min-h-screen dark:text-light">
            <Layout>
                <AnimatedText
                    text={t.articles.title} 
                    className="!text-7xl mb-16 lg:!text-6xl md:!text-5xl" 
                />
                
                <div className="max-w-4xl mx-auto pb-20">
                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <p className="text-center opacity-60">{t.articles.error}</p>
                    ) : articles.length > 0 ? (
                        articles.map((art, index) => (
                            <ArticleLink key={index} article={art} index={index} t={t} />
                        ))
                    ) : (
                        <p className="text-center opacity-60">{t.articles.empty}</p>
                    )}
                </div>
            </Layout>
        </main>
        </>
    );
}