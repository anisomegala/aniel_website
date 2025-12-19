// src/components/Schema.js
import Head from 'next/head';

const Schema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Aniel Someillan",
    "url": "https://anielsomeillan.com", 
    "image": "https://anielsomeillan.com/images/profile/profile_main_pic.png",
    "jobTitle": "Professional Musician & Bass Player",
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "Conservatorio Amadeo Roldan" 
    },
    "knowsAbout": ["Afro-Cuban Jazz", "Classical Guitar", "Electric Bass", "Double Bass"],
    "sameAs": [
      "https://instagram.com", 
      "https://facebook.com",
      "https://linkedin.com",
      "https://youtube.com",
      "https://github.com"
    ]
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </Head>
  );
};

export default Schema;