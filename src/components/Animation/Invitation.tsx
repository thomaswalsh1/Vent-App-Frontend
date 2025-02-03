import { motion } from 'motion/react'
import React from 'react'
import { FaArrowLeft } from "react-icons/fa6";

function Invitation() {


    return (
        <motion.div
            initial={{ transform: "translateY(-100px)" }}
            animate={{ transform: "translateY(0px)" }}
            transition={{ type: "spring" }}
            exit={{ transform: "translateY(-100px)" }}
            className="flex w-[10rem] flex-row gap-x-2 rounded-xl items-center justify-center p-2 bg-slate-300 shadow-lg"
        >
            <FaArrowLeft />
            <span className="text-black text-lg italic">Get Started</span>
        </motion.div>
    )
}

export default Invitation