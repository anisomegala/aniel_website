import React from 'react'
import AnimatedText from '../components/AnimatedText'
import Layout from '../components/Layout'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { YoutubeIcon } from '../components/icons'
import { useRouter } from 'next/router'
import { request } from '../lib/datocms'
import ProjectSkeleton from '@/components/projects'

// Localizations
import en from '../../locales/en.json'
import es from '../../locales/es.json'
import pt from '../../locales/pt.json'
import pl from '../../locales/pl.json'

const FramerImage = motion(Image);

const ProjectCard = ({ type, title, img, link, youtube, className = "", viewText = "" }) => {
    // 1. Safety check: If there's no title or image, don't render an empty broken card
    if (!title || !img?.url) return null;

    return (
        <motion.article 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`relative w-full group flex flex-col items-start justify-end overflow-hidden rounded-3xl border border-dark/10 dark:border-light/10 bg-light dark:bg-dark ${className}`}
        >
            {/* 2. Link Safety: Only make it clickable if a link exists */}
            {link ? (
                <Link href={link} target="_blank" className='absolute inset-0 z-0 cursor-pointer overflow-hidden'>
                    <FramerImage 
                        src={img.url} 
                        alt={title} 
                        width={img.width || 800}
                        height={img.height || 600}
                        className='w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110'
                        whileHover={{ scale: 1.1 }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                </Link>
            ) : (
                <div className='absolute inset-0 z-0 overflow-hidden'>
                     <Image src={img.url} alt={title} fill className='object-cover opacity-40' />
                </div>
            )}

            <div className='relative z-10 w-full p-6 flex flex-col items-start text-light pointer-events-none'>
                {type && (
                    <span className='text-primary dark:text-primaryDark font-semibold text-xs tracking-tighter uppercase mb-1'>
                       {type}
                    </span>
                )}
                
                <h2 className='text-2xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors'>
                   {title}
                </h2>
                
                <div className='flex items-center gap-4 pointer-events-auto'>
                    {/* 3. Icon Safety: Only show icons if the URLs exist */}
                    {youtube && (
                        <Link href={youtube} target="_blank" className='w-8 hover:scale-110 transition-transform'> 
                            <YoutubeIcon className="!fill-light group-hover:!fill-primary" /> 
                        </Link>
                    )}
                    
                    {link && (
                        <Link href={link} target="_blank" className='text-xs font-bold uppercase underline underline-offset-4 tracking-widest hover:text-primary'>
                            {viewText}
                        </Link>
                    )}
                </div>
            </div>
        </motion.article>
    );
};

export async function getStaticProps() {
    const PROJECT_QUERY = `{
      allProjects(orderBy: _createdAt_ASC) {
        id
        title
        typeofproject
        link
        youtube
        layoutclass
        img: image {
          url
          width
          height
        }
      }
    }`;

    const data = await request({ query: PROJECT_QUERY });

    return {
        props: {
            projects: data.allProjects || [],
        },
        revalidate: 60, // Refresh every minute
    };
}

const ProjectsPage = ({ projects = [] }) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const router = useRouter();
    const { locale } = router;
    const t = locale === 'es' ? es : locale === 'pt' ? pt : locale === 'pl' ? pl : en;

    React.useEffect(() => {
        // Short delay to ensure a smooth transition even on fast loads
        if (projects.length > 0) {
            const timer = setTimeout(() => setIsLoading(false), 500);
            return () => clearTimeout(timer);
        }
    }, [projects]);

    return (
        <>
            <Head>
                <title>Aniel Someillan | Projects Portfolio</title>
            </Head>
            <main className='w-full mb-16 flex flex-col items-center justify-center bg-light dark:bg-dark'>
                <Layout className='pt-16'>
                    <AnimatedText 
                        className='mb-16 lg:!text-7xl sm:mb-8 sm:!text-6xl xs:!text-3xl' 
                        text={t.projects.title} 
                    />
                    
                    <div className='grid grid-cols-12 auto-rows-[250px] gap-6 md:gap-4 sm:flex sm:flex-col'>
                        {isLoading ? (
                            // RENDER SKELETONS IN THE PUZZLE PATTERN
                            <>
                                <ProjectSkeleton className="col-span-8 row-span-2 md:col-span-12" />
                                <ProjectSkeleton className="col-span-4 row-span-2 md:col-span-12" />
                                <ProjectSkeleton className="col-span-4 row-span-3 md:col-span-6" />
                                <ProjectSkeleton className="col-span-4 row-span-2 md:col-span-6" />
                                <ProjectSkeleton className="col-span-4 row-span-2 md:col-span-12" />
                            </>
                        ) : (
                            // RENDER ACTUAL DATA
                            projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    type={project.typeofproject || ""}
                                    title={project.title || "Untitled Project"}
                                    img={project.img || null}
                                    link={project.link || null}
                                    youtube={project.youtube || null}
                                    className={project.layoutclass || "col-span-4 row-span-1"} 
                                    viewText={t.projects.viewProject}
                                />
                            ))
                        )}
                    </div>
                </Layout>
            </main>
        </>
    );
};

export default ProjectsPage;