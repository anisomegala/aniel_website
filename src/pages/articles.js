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
        className="w-full p-8 my-6 rounded-2xl border border-dark/10 dark:border-light/10 bg-light/50 dark:bg-dark/50 backdrop-blur-sm group hover:border-primary transition-all"
    >
        <a href={article.link} target="_blank" rel="noopener noreferrer" className="flex flex-col">
            <span className="text-primary font-bold text-sm uppercase tracking-widest mb-2">
                {article.displayLink}
            </span>
            <h2 className="text-2xl font-bold group-hover:text-primary transition-colors mb-4">
                {article.title}
            </h2>
            <p className="text-dark/70 dark:text-light/70 leading-relaxed mb-4">
                {article.snippet}
            </p>
            <span className="text-primary font-semibold underline underline-offset-4">
                {t.articles.readFull} &rarr;
            </span>
        </a>
    </motion.div>
);

export default function Articles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { locale } = router;

    // Mapping locales to translation files
    const t = locale === 'es' ? es : locale === 'pt' ? pt : locale === 'pl' ? pl : en;

    useEffect(() => {
        fetch('/api/getArticles')
            .then(res => res.json())
            .then(data => {
                setArticles(data);
                setLoading(false);
            });
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
                    ) : (
                        articles.map((art, index) => (
                            <ArticleLink key={index} article={art} index={index} t={t} />
                        ))
                    )}
                </div>
            </Layout>
        </main>
        </>
    );
}