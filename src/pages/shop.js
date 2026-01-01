import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';
import Layout from '../components/Layout';
import Head from 'next/head';
import AnimatedText from '../components/AnimatedText';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import en from '../../locales/en.json';
import es from '../../locales/es.json';
import pt from '../../locales/pt.json';
import pl from '../../locales/pl.json';

export async function getStaticProps() {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { data: products } = await stripe.products.list({
        active: true,
        expand: ['data.default_price'],
    });

    return {
        props: {
            products: products.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description,
                image: product.images && product.images.length > 0 ? product.images[0] : null,
                stock: parseInt(product.metadata.stock) || 0,
                price: new Intl.NumberFormat('en-US', {
                    style: 'currency', currency: product.default_price.currency,
                }).format(product.default_price.unit_amount / 100),
                priceId: product.default_price.id,
            })),
        },
        revalidate: 60,
    };
}

export default function Shop({ products }) {
    const [loadingId, setLoadingId] = useState(null);
    const [expandedImage, setExpandedImage] = useState(null);
    const router = useRouter();
    const { locale } = router;

    const t = locale === 'es' ? es : locale === 'pt' ? pt : locale === 'pl' ? pl : en;

    useEffect(() => {
        const hasConsented = localStorage.getItem('cookie-consent') === 'true';
        if (hasConsented && typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'ViewContent', {
                content_type: 'product',
                content_names: products.map(p => p.name)
            });
        }
    }, [products]);

    const handleCheckout = async (product) => {
        const hasConsented = localStorage.getItem('cookie-consent') === 'true';
        setLoadingId(product.priceId);

        if (hasConsented && window.fbq) {
            const priceString = product.price ? String(product.price) : "0";
            const numericValue = parseFloat(priceString.replace(/[^0-9.-]+/g, "")) || 0;

            window.fbq('track', 'AddToCart', {
                content_ids: [product.id],
                content_name: product.name,
                content_type: 'product',
                value: numericValue,
                currency: 'USD'
            });
        }

        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priceId: product.priceId }),
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
        setLoadingId(null);
    };

    return (
        <>
            <Head><title>{t.nav.shop} | Aniel Someillan</title></Head>
            <main className='w-full mb-16 dark:text-light'>
                <Layout className='pt-16'>
                    <AnimatedText text={t.shop.title} className='mb-16' />
                    <div className='grid grid-cols-2 lg:grid-cols-1 gap-12'>
                        {products.map((product) => (
                            <motion.div key={product.id} className='p-6 rounded-3xl border border-dark/10 dark:border-light/10 bg-light/50 dark:bg-dark/50 backdrop-blur-sm'>
                                <div
                                    className='relative w-full h-80 mb-6 overflow-hidden rounded-2xl bg-dark/5 dark:bg-light/5 cursor-zoom-in'
                                    onClick={() => product.image && setExpandedImage(product.image)}
                                >
                                    {product.image ? (
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className='object-cover hover:scale-105 transition-transform duration-500'
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full opacity-30 text-xs">
                                            No Image Available
                                        </div>
                                    )}
                                </div>
                                <h3 className='text-2xl font-bold'>{product.name}</h3>
                                <p className='my-2 opacity-70'>{product.description}</p>
                                <div className='flex justify-between items-center mt-6'>
                                    <span className='text-2xl font-bold text-primary'>{product.price}</span>
                                    {product.stock <= 5 && product.stock > 0 && (
                                        <p className="text-orange-500 text-xs font-bold animate-pulse">
                                            {t.shop.lowStock.replace('{{count}}', product.stock)}
                                        </p>
                                    )}
                                    <button
                                        disabled={product.stock === 0 || loadingId === product.priceId}
                                        onClick={() => handleCheckout(product)}
                                        className='bg-dark text-light px-8 py-3 rounded-full dark:bg-light dark:text-dark font-bold hover:scale-105 transition-transform disabled:opacity-50'
                                    >
                                        {loadingId === product.priceId ? t.shop.redirecting : (product.stock === 0 ? t.shop.soldOut : t.shop.buyNow)}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Layout>
            </main>

            <AnimatePresence>
                {expandedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setExpandedImage(null)}
                        // FIXED: Full viewport height with fixed positioning to prevent background scrolling
                        className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-dark/95 backdrop-blur-lg cursor-zoom-out touch-none"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            // FIXED: Padding ensures safety for iPad and mobile edges
                            className="relative w-full h-full max-w-4xl max-h-screen flex flex-col items-center justify-center p-6 md:p-12"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* IMAGE CONTAINER: Limits size to 75% of screen to leave room for UI */}
                            <div className="relative w-full h-[75vh] flex items-center justify-center pointer-events-none">
                                <img
                                    src={expandedImage}
                                    alt="Expanded Product"
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl pointer-events-auto"
                                />
                            </div>

                            {/* BOTTOM BUTTON: Easy to reach on iPad/Mobile without overlapping content */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setExpandedImage(null)}
                                className="mt-8 bg-light text-dark dark:bg-dark dark:text-light px-10 py-3 rounded-full font-bold shadow-2xl pointer-events-auto border border-dark/10 dark:border-light/10"
                            >
                                {locale === 'es' ? 'Cerrar' : locale === 'pl' ? 'Zamknij' : locale === 'pt' ? 'Fechar' : 'Close'}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}