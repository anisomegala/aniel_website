import Head from 'next/head';

const Schema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Aniel Someillan",
    "url": "https://anielsomeillan.com",
    "image": "https://anielsomeillan.com/images/press/press-performance-jazz-plaza.jpg",
    "jobTitle": "Double Bassist & Composer",
    "description": "Cuban-born double bassist and composer based in Warsaw, Poland. Afro-Cuban jazz, son cubano, and contemporary improvised music. Jazz Plaza 2026 MJAF laureate, Montreux Jazz Academy 2023, Jazz Junior Competition winner 2022.",
    "birthPlace": {
      "@type": "Place",
      "name": "Havana, Cuba"
    },
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "Conservatorio de Música Amadeo Roldán",
      "address": { "@type": "PostalAddress", "addressLocality": "Havana", "addressCountry": "CU" }
    },
    "award": [
      "Jazz Plaza Festival Laureate 2026 — MJAF laureate concert with Rodney Barreto, Yilian Cañizares, Rolando Luna, Harold López Nussa and Héctor Quintana",
      "Montreux Jazz Academy 2023 — Montreux Jazz Artist Foundation",
      "Jazz Junior Competition Winner 2022 — Kraków, Poland",
      "Radio Katowice Young Talents Winner 2021"
    ],
    "knowsAbout": ["Afro-Cuban Jazz", "Son Cubano", "Double Bass", "Electric Bass", "Classical Guitar", "Composition"],
    "sameAs": [
      "https://www.instagram.com/anielsomeillan",
      "https://www.youtube.com/@anielsomeillan",
      "https://ilucuba.bandcamp.com",
      "https://www.facebook.com/anielsomeillan"
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
