import { MySideBar } from '@/components/sidebar/MySideBar'
import ProfileView from '@/components/UserView/ProfileView'
import React from 'react'
import { useSelector } from 'react-redux'

function ViewUserProfile() {
    return (
        <div className="flex-grow w-full sm:w-fit flex flex-col items-center">
            <div className='flex w-full sm:w-fit items-center justify-center'>
                <ProfileView />
            </div>
        </div>
    )
}

export default ViewUserProfile