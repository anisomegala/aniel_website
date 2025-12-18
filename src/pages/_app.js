import '@/styles/globals.css'

import { Poppins } from 'next/font/google'
import Head from 'next/head'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ['latin'],
  variable: '--font-pp',
})

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${poppins.variable} font-pp bg-light dark:bg-dark w-full min-h-screen`}>
        <NavBar />
        <Component {...pageProps} />
        <Footer />
      </main>
    </>
  ) 
}
