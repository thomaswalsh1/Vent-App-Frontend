import React from 'react'
import ViewEditor from './ViewEditor'

function ViewPost() {
    return (
        <div className="bg-gray-100 w-full sm:w-[75vw] h-[100vh] flex justify-center items-center p-1 sm:p-4">
            <div className="flex flex-col rounded-2xl bg-white w-full h-[100%] overflow-y-scroll no-scrollbar">
                <ViewEditor />
            </div>
        </div>
    )
}

export default ViewPost