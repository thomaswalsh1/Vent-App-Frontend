import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { IoIosHelpCircleOutline } from "react-icons/io";
import React from 'react'

function Support() {
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className='focused:outline-none focus-within:outline-none'>
                        <IoIosHelpCircleOutline className='bg-white rounded-full cursor-pointer w-8 h-8' />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='rounded-xl bg-white'>
                    <DropdownMenuLabel>Help</DropdownMenuLabel>
                    <DropdownMenuItem className='cursor-pointer'>
                        Support
                    </DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer'>
                        Feedback
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default Support