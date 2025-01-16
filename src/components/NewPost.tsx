import { useSelector } from 'react-redux'
import TextEditor from './TextEditor'

function NewPost() {
    return (
        <div className="bg-gray-100 w-full sm:w-[75vw] h-[100vh] flex justify-center items-center p-4">
            <div className="flex flex-col bg-white border-2 rounded-2xl w-full h-full overflow-y-auto">
                <TextEditor />
            </div>
        </div>
    )
}

export default NewPost