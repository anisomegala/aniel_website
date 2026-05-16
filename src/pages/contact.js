import React, { useState } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import en from '../../locales/en.json'
import es from '../../locales/es.json'
import pt from '../../locales/pt.json'
import pl from '../../locales/pl.json'

const Contact = () => {
    const [status, setStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { locale } = router;

    // Mapping locales to translation files
    const t = locale === 'es' ? es : locale === 'pt' ? pt : locale === 'pl' ? pl : en;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.target);

        // Safety check: get the value and provide a fallback string before splitting
        const fullName = formData.get("name") || "";

        const data = {
            email: formData.get("email"),
            firstName: fullName.split(" ")[0] || "Guest",
            lastName: fullName.split(" ").slice(1).join(" ") || "",
            message: formData.get("message")
        };

        // 1. Browser-side Tracking (Standard Pixel)
        if (window.fbq) {
            window.fbq('track', 'Lead', { currency: 'USD', value: 1.00 });
        }

        // 2. Server-side Tracking (CAPI)
        try {
            const response = await fetch('/api/fb-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setStatus("Success! Your inquiry has been sent.");
                e.target.reset();
            } else {
                throw new Error("API Error");
            }
        } catch (err) {
            setStatus("Message sent, but tracking encountered an error.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <>
            <Head>
                <title>Contact Aniel | Professional Jazz Collaboration</title>
                <meta name="description" content="Reach out for bookings, collaborations, or inquiries." />
            </Head>
            <main className="w-full min-h-screen flex flex-col items-center justify-center dark:text-light">
                <Layout className="pt-16">
                    <div className="max-w-2xl mx-auto bg-light/50 dark:bg-dark/50 p-8 rounded-3xl border border-dark/10 dark:border-light/10 backdrop-blur-md">
                        <h1 className="text-4xl font-bold mb-8">{t.nav.contact}</h1>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                name="name" // IMPORTANT: This must match formData.get("name")
                                type="text"
                                placeholder="Your Name"
                                required
                                className="p-3 rounded-xl bg-transparent border border-dark/20 dark:border-light/20 outline-none focus:border-primary transition-colors"
                            />
                            <input
                                name="email" // IMPORTANT: This must match formData.get("email")
                                type="email"
                                placeholder="Your Email"
                                required
                                className="p-3 rounded-xl bg-transparent border border-dark/20 dark:border-light/20 outline-none focus:border-primary transition-colors"
                            />
                            <textarea
                                name="message"
                                placeholder="How can we collaborate?" rows="4"
                                className="p-3 rounded-xl bg-transparent border border-dark/20 dark:border-light/20 outline-none focus:border-primary transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-dark text-light dark:bg-light dark:text-dark py-3 rounded-xl font-bold hover:bg-primary dark:hover:bg-primaryDark transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-light/40 border-t-light dark:border-dark/40 dark:border-t-dark rounded-full animate-spin" />
                                        Sending…
                                    </>
                                ) : t.home.getInTouch}
                            </button>
                        </form>
                        {status && <p className="mt-4 text-primary font-semibold">{status}</p>}
                    </div>
                </Layout>
            </main >
        </>
    )
}

export default Contact