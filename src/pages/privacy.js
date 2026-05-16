import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import AnimatedText from '@/components/AnimatedText';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold uppercase tracking-widest text-primary mb-4">{title}</h2>
    <div className="space-y-3 text-dark/80 dark:text-light/80 leading-relaxed">{children}</div>
  </div>
);

const Privacy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | Aniel Someillan</title>
        <meta name="description" content="Privacy policy for anielsomeillan.com — how we use cookies and handle your data." />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <main className="flex w-full flex-col items-center justify-center dark:text-light">
        <Layout className="pt-16">
          <AnimatedText text="Privacy Policy" className="!text-5xl mb-4 lg:!text-4xl md:!text-3xl" />
          <p className="text-dark/50 dark:text-light/50 mb-16 text-sm">Last updated: May 2026</p>

          <div className="max-w-3xl">

            <Section title="Who We Are">
              <p>This website is operated by <strong>Aniel Someillan</strong> (<a href="mailto:anielsomeillan@icloud.com" className="text-primary hover:underline">anielsomeillan@icloud.com</a>). It is a personal artist website used to promote musical projects, upcoming shows, and original compositions.</p>
            </Section>

            <Section title="What Data We Collect">
              <p>We collect minimal data necessary to operate this site:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Cookies</strong> — we use a cookie to remember your cookie consent choice.</li>
                <li><strong>Facebook Pixel</strong> — if you accept cookies, we load Facebook Pixel to track page views and measure performance of any promoted content. This sends anonymised data to Meta Platforms, Inc. See <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meta's Privacy Policy</a>.</li>
                <li><strong>Contact form</strong> — if you use the contact form, your name and email are used only to reply to your message and are not stored or sold.</li>
              </ul>
            </Section>

            <Section title="Cookies">
              <p>We use the following cookies:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><code className="bg-dark/10 dark:bg-light/10 px-1 rounded">cookie-consent</code> — stores your accept/decline choice. Expires when you clear browser storage.</li>
                <li><strong>Facebook Pixel cookies</strong> — only set if you accept cookies. These are third-party cookies managed by Meta. You can opt out at <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">youronlinechoices.com</a>.</li>
              </ul>
              <p>You can withdraw consent at any time by clearing your browser's local storage for this domain.</p>
            </Section>

            <Section title="Your Rights (GDPR)">
              <p>If you are located in the European Economic Area, you have the right to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Access the personal data we hold about you</li>
                <li>Request correction or deletion of your data</li>
                <li>Object to or restrict processing of your data</li>
                <li>Lodge a complaint with your local data protection authority</li>
              </ul>
              <p>To exercise any of these rights, contact: <a href="mailto:anielsomeillan@icloud.com" className="text-primary hover:underline">anielsomeillan@icloud.com</a></p>
            </Section>

            <Section title="Third-Party Services">
              <p>This site uses the following third-party services that have their own privacy policies:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Meta (Facebook Pixel)</strong> — <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">privacy policy</a></li>
                <li><strong>Vercel</strong> (hosting) — <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">privacy policy</a></li>
                <li><strong>Google Fonts</strong> — fonts loaded via Google CDN; see <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google's privacy policy</a></li>
              </ul>
            </Section>

            <Section title="Changes">
              <p>We may update this policy occasionally. The date at the top of this page reflects the most recent revision. Continued use of the site after changes constitutes acceptance of the updated policy.</p>
            </Section>

            <Section title="Contact">
              <p>For any privacy-related questions: <a href="mailto:anielsomeillan@icloud.com" className="text-primary hover:underline">anielsomeillan@icloud.com</a></p>
            </Section>

          </div>
        </Layout>
      </main>
    </>
  );
};

export default Privacy;
