import Link from 'next/link'
import React from 'react'
import Layout from '../components/Layout'

const Footer = () => {
    return (
        <footer className='w-full border-t-2 border-solid border-dark
        font-medium text-lg dark:text-light dark:border-light sm:text-base'>
            <Layout className='py-4 flex items-center justify-around lg:flex-col lg:py-6'>
                <span>{new Date().getFullYear()}&copy; All rights Reserved </span>
                <Link href='/'>Created by Aniel Someillan</Link>
                <Link href='https://ilu-epk.vercel.app' target={'_blank'}
                    className='underline underline-offset-2'
                >Go to Ilu EPK</Link>
            </Layout>
        </footer>
    )
}

export default Footer
