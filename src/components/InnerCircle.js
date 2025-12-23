import React, { useState } from 'react';
import { motion } from 'framer-motion';

const InnerCircle = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(""); // 'loading', 'success', 'error'

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setEmail("");
            } else {
                throw new Error(data.error || "Something went wrong");
            }
        } catch (err) {
            setStatus("error");
            console.error(err);
        }
    };
    return (
        <section className="w-full py-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto relative overflow-hidden rounded-[2.5rem] border border-dark/10 dark:border-light/10 bg-light/30 dark:bg-dark/30 backdrop-blur-2xl p-12 md:p-16 text-center"
            >
                {/* Subtle Decorative Gradient */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 dark:text-light">
                        Join the Inner Circle
                    </h2>
                    <p className="text-lg md:text-xl mb-8 opacity-70 dark:text-light/70 max-w-xl mx-auto">
                        Step backstage. Receive unreleased demos, early access to shows, and exclusive vinyl editions.
                    </p>

                    <form onSubmit={handleSubscribe} className="flex flex-col gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            required
                            placeholder="Your best email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-grow p-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-dark/10 dark:border-light/10 outline-none focus:border-primary transition-all text-dark dark:text-light"
                        />
                        <button
                            type="submit"
                            disabled={status === "loading" || status === "success"}
                            className="bg-dark text-light dark:bg-light dark:text-dark px-8 py-4 rounded-2xl font-bold hover:bg-primary dark:hover:bg-primary transition-all disabled:opacity-50"
                        >
                            {status === "loading" ? "Entering..." : status === "success" ? "Welcome" : "Get Access"}
                        </button>
                    </form>

                    {status === "success" && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 text-primary font-semibold"
                        >
                            Check your inbox. The first secret is waiting for you.
                        </motion.p>
                    )}
                </div>
            </motion.div>
        </section>
    );
};

export default InnerCircle;