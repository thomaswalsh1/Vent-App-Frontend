import React from 'react';
import { MySideBar } from '@/components/sidebar/MySideBar';
import Feed from '@/components/Feed';
import { useSelector } from "react-redux";
import Search from '@/components/search/Search';


function Home() {
  return (
      <div className="flex-grow flex flex-col items-center">
        <div className='w-full flex items-center justify-center'>
          <Search />
        </div>
      </div>
  );
}

export default Home;
