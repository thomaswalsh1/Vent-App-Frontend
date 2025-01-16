import React from 'react';
import NewPost from '@/components/NewPost';

function CreatePost() {
  return (
    <div className="flex-grow w-full sm:w-fit flex flex-col items-center">
      <div className='flex w-full sm:w-fit items-center justify-center'>
        <NewPost />
      </div>
    </div>
  );
}

export default CreatePost;
