import React from 'react'
import Notifications from '@/components/Notifications/Notifications'


function ViewNotifications() {
  return (
    <div className="flex-grow flex flex-col items-center">
        <div className='flex items-center justify-center'>
            <Notifications />
        </div>
      </div>
  )
}

export default ViewNotifications