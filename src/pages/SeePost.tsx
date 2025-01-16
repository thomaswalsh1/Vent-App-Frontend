import ViewPost from '@/components/UserPosts/ViewPost';

function SeePost() {
  return (
    <div className="flex-grow w-full sm:w-fit flex flex-col items-center">
      <div className='flex w-full sm:w-fit items-center justify-center'>
        <ViewPost />
      </div>
    </div>
  );
}

export default SeePost;
