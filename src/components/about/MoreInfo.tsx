import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function MoreInfo() {

    const navigate = useNavigate();
    
    const goToAboutPage = () => {
        navigate("/about");
    }

    return (
        <div>
            <div className='z-30 drop-shadow-2xl'>
                <Button onClick={goToAboutPage} className=' bg-opacity-100 hover:bg-slate-500 hover:bg-opacity-100 rounded-xl bg-slate-400 m-2 border-2'>Learn More</Button>
            </div>
        </div>


    )
}

export default MoreInfo