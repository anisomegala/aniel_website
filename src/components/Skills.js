import React from 'react'
import {motion} from 'framer-motion'


const Skill = ({name, x, y}) => {
    return (
        <motion.div className='flex items-center justify-center rounded-full font-bold bg-dark text-light py-1 px-4 shadow-dark absolute dark:bg-light dark:text-dark
            lg:py-1 lg:px-3 md:text-xs md:py-1.5 md:px-2 md:!bg-transparent xs:dark:!bg-transparent
            md:text-dark md:dark:text-light xs:font-semibold
        '
                whileHover={{
                    scale:1.05

                }}
                initial={{x:0, y:0}}
                whileInView={{x:x, y:y, transition: {duration: 1.5}}}
               viewport={{once: true}}
                >
                    {name}
        </motion.div>
    )
}

const Skills = () => (
    <div>
        <h2 className='w-full font-bold text-8xl mt-32 text-center text-dark dark:text-light md:text-6xl md:mt-32'>
                        Skills
        </h2>
        <div className='w-full h-screen relative flex items-center justify-center rounded-full bg-circularLight dark:bg-circularDark
            lg:h-[80vh] sm:h-[60vh] xs:h-[50]vh lg:bg-circularLightLg lg:dark:bg-circularDarkLg
        '>
            <Skill name="Double Bass" x="-2vw" y="-2vw" />
            <Skill name="Web Development" x="-18vw" y="-13.5vw" />
            <Skill name="Backing Vocals" x="13vw" y="-5vw" />
            <Skill name="Guitar" x="5vw" y="-15vw" />
            <Skill name="Electric Bass" x="-2vw" y="2vw" />
            <Skill name="Composition" x="-2vw" y="12vw" />
            <Skill name="Arrangements" x="0vw" y="-10vw" />
            <Skill name="Mixing" x="20vw" y="-22vw" />
            <Skill name="Jazz" x="-12vw" y="6vw" />
            <Skill name="Workshops" x="12vw" y="6vw" />
            <Skill name="Coding (JS)" x="-25vw" y="15vw" />
            <Skill name="Logic Pro" x="13vw" y="10vw" />
            <Skill name="Web Design" x="-30vw" y="-20vw" />
            <Skill name="Music Teaching" x="25vw" y="15vw" />
            <Skill name="Web Design" x="-30vw" y="-20vw" />
        </div>
    </div>
)

export default Skills
