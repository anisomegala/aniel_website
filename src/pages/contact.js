import React, { useState } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'

const Contact = () => {
    const [status, setStatus] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Send the data to your email service (Formspree, SendGrid, etc.)
        // 2. Track the Facebook Lead Event
        if (window.fbq) {
            window.fbq('track', 'Lead', {
                content_category: 'Contact Form',
                content_name: 'Inquiry',
                value: 1.00,
                currency: 'USD'
            });
        }

        setStatus("Message Sent! Meta is now tracking this as a Lead.");
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
                        <h1 className="text-4xl font-bold mb-8">Start a Project</h1>
                        
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input 
                                type="text" placeholder="Your Name" required
                                className="p-3 rounded-xl bg-transparent border border-dark/20 dark:border-light/20 outline-none focus:border-primary transition-colors"
                            />
                            <input 
                                type="email" placeholder="Your Email" required
                                className="p-3 rounded-xl bg-transparent border border-dark/20 dark:border-light/20 outline-none focus:border-primary transition-colors"
                            />
                            <textarea 
                                placeholder="How can we collaborate?" rows="4"
                                className="p-3 rounded-xl bg-transparent border border-dark/20 dark:border-light/20 outline-none focus:border-primary transition-colors"
                            />
                            <button 
                                type="submit"
                                className="bg-dark text-light dark:bg-light dark:text-dark py-3 rounded-xl font-bold hover:bg-primary dark:hover:bg-primaryDark transition-all"
                            >
                                Send Message
                            </button>
                        </form>
                        {status && <p className="mt-4 text-primary font-semibold">{status}</p>}
                    </div>
                </Layout>
            </main>
        </>
    )
}

export default Contact