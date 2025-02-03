import React, { useRef } from 'react'
import { Sidebar, SidebarItemGroup } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiOutlineExclamationCircle, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";
import { IoIosNotifications, IoIosHome } from "react-icons/io";
import { VscNewFile } from "react-icons/vsc";
import { FaSignOutAlt, FaSearch } from "react-icons/fa";
import { Modal } from "flowbite-react";
import { Button } from "../ui/button";
import { ReactElement, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setSignout } from "@/state/auth/authSlice";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";
import { apiClient } from "@/lib/api-client";
import { USER_ROUTES } from "@/utils/constants";
import { RootState } from "@/state/store";
import useMediaQuery from '@mui/material/useMediaQuery'
import { FaChevronLeft } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import { Skeleton } from '../ui/skeleton';
import emptypfp from '@/assets/emptypfp.png'
import RightbarUserCard from './RightbarUserCard';
import LoadingAnimation from '../Animation/LoadingAnimation';
import { AnimatePresence, motion } from 'motion/react';

interface UserData {
  pfp: string;
  firstName: string;
  lastName: string;
  username: string;
}

function Rightbar({ close, mode, id }: { close: () => void, mode: string, id: string }) {

  const currToken = useSelector((state: RootState) => state.auth.token);

  const [visibleUsers, setVisibleUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [error, setError] = useState(null);
  const observerRef = useRef<HTMLDivElement>(null);


  const getUsers = async (page: number) => {
    setLoading(true)
    setIsFetchingMore(true);
    setError(null);
    try {
      // await new Promise((res) => setTimeout(res, 1000)); // test loading
      const res = await apiClient.get(`${USER_ROUTES}/${id}/${mode}`, {
        params: { page, limit: 10 },
        headers: {
          Authorization: `Bearer ${currToken}`
        }
      })

      const { users, hasMore: newHasMore } = res.data;

      if (page === 1) {
        setVisibleUsers(users); // prevent duplicating on first
      } else {
        setVisibleUsers((prev) => [...prev, ...users]);
      }
      setHasMore(newHasMore);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingMore(false);
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    setCurrentPage(1)
    getUsers(1);
  }, [])


  useEffect(() => {
    if (!observerRef.current || !hasMore || isFetchingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
          setCurrentPage((prev) => prev + 1);
          getUsers(currentPage + 1);
        }
      },
      {
        threshold: 0.5,  // Trigger when element is 50% visible
        rootMargin: '100px' // Start loading 100px before element is visible
      }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, currentPage]);


  const closeAndClear = async () => {
    setIsVisible(false)
    await new Promise((res) => setTimeout(res, 500)); // allow for animation to finish
    close();
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div ref={observerRef} className='w-full bg-white h-full flex flex-col rounded-xl border-4 p-4'
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{x: "100%"}}
          
        >
          <div id="heading" className='flex w-full items-center my-2 mb-3 flex-row justify-between'>
            <FaChevronLeft className='w-8 h-8' onClick={closeAndClear} />
            <span className='font-bold'>{mode === "followers" ? "Followers" : "Following"} </span>
            <div className='w-8 h-8' ></div>
          </div>
          <Separator className='mb-4' />
          <div className='h-full flex overflow-x-hidden no-scrollbar flex-col justify-start overflow-scroll gap-y-2'>
            {loading && currentPage === 1 && (
              <div className='flex h-full items-center justify-center'>
                <LoadingAnimation />
              </div>

            )}
            {visibleUsers.map((user, index) => (
              <RightbarUserCard closer={closeAndClear} userId={user} key={index} />
            ))}
            {visibleUsers.length === 0 && !loading && (
              <div className='h-full flex items-center justify-center'>
                <span>No users in {mode}</span>
              </div>
            )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Rightbar