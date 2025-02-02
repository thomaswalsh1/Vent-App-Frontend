import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Separator } from '@/components/ui/separator';

function AboutPage() {

    const dotVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: [1, 0, 1],  // Flashes in and out
            transition: {
                repeat: 4,
                repeatDelay: 0.2,
                duration: 1
            }
        }
    };

    return (
        <div className='w-screen h-screen m-0 p-2 bg-slate-500 flex items-center justify-center overflow-x-hidden'>
            <div id="stuff-container" className='w-full h-full flex flex-col items-center'>
                <div id="header" className='flex m-2 flex-col w-full items-center justify-center'>
                    <div id="heading section" className='border-4 border-transparent' style={{ textShadow: "1px 1px 2px rgb(100 116 139), 0 0 1em black, 0 0 0.2em rgb(100 116 139)" }}>
                        <span className='text-white brand-text text-7xl sm:text-9xl'>Vent</span>
                    </div>
                    <div className='w-full flex items-center justify-center'>
                        <span className='ml-2 text-lg sm:text-2xl italic text-white'>Redefining Online Journaling
                            <motion.span
                                className='text-lg sm:text-2xl italic text-white'
                                variants={dotVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                ...
                            </motion.span>
                        </span>
                    </div>
                    <div>
                        <span className='text-base sm:text-lg text-white italic'>Created By Thomas Walsh</span>
                    </div>

                </div>
                <div id="about-vent" className=''>
                    <div id="about-the-app" className='w-full my-2'>
                        <div id="about-the-app-title" className='w-full my-2'>
                            <span className='italic text-white text-base sm:text-lg'>About the App...</span>
                        </div>
                        <div id="about-the-app-body" className='bg-white p-2 border-2 rounded-xl'>
                            <span className='text-black text-xs sm:text-sm md:text-base'>
                                TO BE IMPLEMENTED SOON




                            </span>
                        </div>

                    </div>
                    <div id="about-me" className='w-full my-2'>
                        <div id="about-me-title" className='w-full my-2'>
                            <span className='italic text-white text-base sm:text-lg'>About Me...</span>
                        </div>
                        <div id="about-me-body" className='bg-white p-2 border-2 rounded-xl'>
                            <span className='text-black text-xs sm:text-sm md:text-base'>
                                TO BE IMPLEMENTED SOON




                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutPage