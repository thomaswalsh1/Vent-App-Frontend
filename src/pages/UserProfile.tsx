import ProfileEditor from '@/components/ProfileEditor'
import React from 'react'
import { useSelector } from 'react-redux'

function UserProfile() {
  return (
      <div className="flex-grow w-full sm:w-fit flex flex-col items-center">
        <div className='flex w-full sm:w-fit items-center justify-center'>
          <ProfileEditor />
        </div>
      </div>
  )
}

export default UserProfile