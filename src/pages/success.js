import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import AnimatedText from '../components/AnimatedText';
import Link from 'next/link';

export default function Success() {
    return (
        <Layout className='pt-32 text-center'>
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center text-4xl mb-6">✓</div>
                <AnimatedText text="Thank You for Your Support!" className='!text-5xl' />
                <p className='text-lg mt-4 opacity-80'>A confirmation email and your digital content have been sent to your inbox.</p>
                <Link href="/" className="mt-10 underline text-xl font-bold hover:text-primary transition-colors">
                    Back to Home
                </Link>
            </div>
        </Layout>
    );
}