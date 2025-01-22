import React from 'react';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { motion } from 'framer-motion'; // Correct import from 'framer-motion'

function LoadingAnimation() {
    return (
        <div className="flex flex-col w-full items-center justify-center gap-y-3">
            <motion.div
                initial={{ rotate: 0, scale: 1 }}
                animate={{
                    rotate: 360, 
                    scale: [1, 1.2, 1], 
                }}
                transition={{
                    duration: 2, 
                    ease: "easeInOut", 
                    repeat: Infinity,
                }}
            >
                <AiOutlineLoading3Quarters size={40} />
            </motion.div>
        </div>
    );
}

export default LoadingAnimation;
