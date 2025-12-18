import React, {useRef} from 'react'
import {motion, useScroll} from 'framer-motion'
import LiIcon from '../components/LiIcon'


const Details = ({description, place, date, link, address, band, time}) => {
    const ref = useRef(null);
    return (
    
    <li  ref={ref} className='my-8 first:mt-0 last-mb-0 w-[60%] mx-auto flex flex-col items-center justify-between dark:text-light
        md:w-[70%] xs:mr-5
    
    ' >
        <LiIcon reference={ref}/>
        <motion.div
        initial={{y:50}}
        whileInView={{y:0}}
        transition={{duration: 0.5, type: "spring"}}
        >
            <h3 className='capitalize font-bold text-2xl sm:text-xl xs:text-lg'>{description}&nbsp;@{place}</h3>
                <span className='capitalize font-medium text-dark/75 dark:text-primary sx:text-sm'>{time} | {address}</span>
                <p className='capitalize font-medium text-dark/75 dark:text-primary sx:text-sm'>{date}</p>
                <p className='font-medium w-full md:text-sm'>
                    <a href={link} target='_blank'>more details...</a>
                </p>
        </motion.div>
    </li>
    )
}

const UpcomingShows = () => {
    const ref = useRef(null);
    const {scrollYProgress} = useScroll({
        target: ref,
        offset: ["start end", "center start"]
    })
    return (
        <div className='my-16 xs:mt-4'>
           <h1 className='font-bold text-8xl mb-32 w-full text-center dark:text-light md:text-6xl xs:text-5xl  md:mb-16'>Shows</h1>
           <div  ref= {ref} className='w-[75%] mx-auto relative'>
               <motion.div 
               style={{scaleY: scrollYProgress}}
               className='absolute left-0 top-0 w-[4px] h-full bg-dark origin-top dark:bg-light' />
               <ul>
                   <Details 
                    description='Ilú & Shai Maestro'
                    place='Blue Note Poznan' 
                    time='21hr' 
                    date='December 11th'
                    address='Blue Note Poznan' 
                    link='https://bluenote.pl/kalendarz/ilu-trio-shai-maestro/'
                    />
                   <Details 
                    description='Ilú & Shai Maestro'
                    place='Impart Centrum' 
                    time='19hr'
                    date='December 10th' 
                    address='Maszalka Josefa P. 19' 
                    link='https://strefakultury.pl/wydarzenie/ilu-trio-feat-shai-maestro-koncert/'
                    />
                   <Details 
                    description='Ilú & Shai Maestro'
                    place='Jassmin Klub' 
                    time='21hr'
                    date='December 9th' 
                    address='Wilcza 73' 
                    link='https://jassmine.com/wydarzenia/09-12-ilu-trio-shai-maestro/'
                    />
                   <Details 
                    description='Amaro Freitas trio'
                    place='CorkGuinnes Jazz Festival' 
                    time='18hr | 20hr' 
                    address='Cork, Ireland'
                    date='October 28th' 
                    link='https://guinnesscorkjazz.com/line-up/amaro-freitas/'
                    />
                   <Details 
                    description='Amaro Freitas trio'
                    place='Villanos Jazz' 
                    time='21hr' 
                    address='Madrid, Spain' 
                    date='October 25th'
                    link='https://villanosdeljazz.es/salavillanos/amaro-freitas-2023-10-25-sala-villanos'
                    />
                   <Details 
                    description='Amaro Freitas trio'
                    place='Jamboree' 
                    time='21hr' 
                    date='October 23-24th'
                    address='Barcelona' 
                    link='/'
                    />
                    <Details 
                    description='Montreux Jazz Festival Recidency'
                    place='Montreux Palace' 
                    time='' 
                    date='October 5-7th'
                    address='Montreux, Switzerland' 
                    link='https://www.mjaf.ch/en/news/mjf-residency-four-magical-days-of-encounters/'
                    />
               </ul>
           </div>
        </div>
    )
}

export default UpcomingShows
