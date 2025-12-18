import React, {useRef} from 'react'
import {motion, useScroll} from 'framer-motion'

const LiIcon = ({reference}) => {

    const {scrollYProgress} = useScroll({
        target: reference,
        offset: ["center end", "center center"]
    })
    return (
        <figure className='absolute  -left-8 stroke-dark dark:stroke-light'>
            <svg classwidth="75" height="75" viewBox='0 0 100 100' >
                <circle  cx="75" cy="50" r="20" className='stroke-primary stroke-1 fill-none dark:stroke-primaryDark'/>
                <motion.circle  cx="75" cy="50" r="20" className='stroke-[5px] fill-light'
                style={{
                    pathLength : scrollYProgress
                }}
                />
                <circle  cx="75" cy="50" r="15" className='animate-pulse stroke-1 fill-primary dark:fill-primaryDark '/>
            </svg>
        </figure>
    )
}

export default LiIcon
