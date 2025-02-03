import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { MySideBar } from "@/components/MySideBar";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSidebar } from "@/context/SidebarContext";
import Invitation from "./Animation/Invitation";
import { AnimatePresence } from "motion/react";

const SIDEBAR_WIDTH = "16rem";

const Layout = () => {
  const { isOpen, openSidebar, closeSidebar, toggleSidebar } = useSidebar();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [showingAnimation, setShowingAnimation] = useState(false)



  const handleAnimation = async () => {
    if (!isDesktop) {
      setShowingAnimation(true);
      await new Promise((res) => setTimeout(res, 4000));
      setShowingAnimation(false);
    }
  };

  useEffect(() => {
    handleAnimation();
  }, [])

  useEffect(() => {
    if (isDesktop) openSidebar();
    else closeSidebar();
  }, [isDesktop]);

  return (
    <div className="w-screen h-screen flex bg-slate-700 overflow-hidden relative">
      {/* Sidebar */}
      <div
        className="fixed top-0 left-0 h-full z-20 transition-transform duration-300 ease-in-out"
        style={{
          width: SIDEBAR_WIDTH,
          transform: isOpen ? "translateX(0)" : `translateX(-${SIDEBAR_WIDTH})`,
        }}
      >
        <MySideBar close={toggleSidebar} />
      </div>

      {/* Main content */}
      <div
        className="flex-grow h-screen flex flex-col transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isOpen ? SIDEBAR_WIDTH : "0",
        }}
      >
        {/* Toggle button and Invitation container */}
        <div
          className={`fixed top-4 z-30 transition-all duration-300 ease-in-out 
            ${isOpen ? "left-[17rem]" : "left-4"}`}
        >
          <div className="relative">
            {/* Toggle button */}
            <Button
              onClick={toggleSidebar}
              variant="outline"
              size="icon"
              className="drop-shadow-2xl"
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>

            {/* Invitation animation */}

            <AnimatePresence>
              {showingAnimation && (
                <div className="absolute left-full top-0 ml-4">
                  <Invitation />
                </div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Outlet container */}
        <div className="w-full h-screen flex items-center justify-center p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
