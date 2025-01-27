import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PostProps {
  data: {
    title: string;
    content: string;
    author: string;
    userId: string;
    tags: Array<string>;
    visibility: string;
    _id?: string;
    imageUrl?: string;
  };
  isDraft? : boolean;
}

export default function Post({ data, isDraft }: PostProps) {

  const navigate = useNavigate();

  const navigateToSearch = (query: string) => {
    navigate(`/search?query=${encodeURIComponent(query)}`)
  }
  return (
    <div className="bg-white rounded-lg h-full w-full overflow-hidden" onClick={(e) => !isDraft ? navigate(`/posts/${data._id}`) : navigate(`/profile/drafts/${"blockchain"}`)}>
      <div className="p-4">
        <h2 className="text-xl font-bold line-clamp-2">{data.title}</h2>
        <a className="text-md italic pt-2 pb-2 hover:text-slate-600" onClick={(e) => e.stopPropagation()} href={`/users/${data.userId}`}>{data.author}</a>
        <p className='flex flex-row'>{
          data.tags.map((item: string, idx) => idx < 4 ? ( // only show first 4 tags
            <a key={idx} className='text-sm text-blue-400 ml-1 cursor-pointer' onClick={(e) => {e.stopPropagation(); navigateToSearch(data.tags[idx])}}>{`#${data.tags[idx]} `}</a>
          ): (<a />) )
        }
        </p>
        <div className="line-clamp-15" dangerouslySetInnerHTML={{ __html: data.content }}></div>
      </div>
    </div>
  );
}

