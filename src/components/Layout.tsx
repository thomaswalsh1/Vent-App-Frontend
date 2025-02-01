import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { MySideBar } from "@/components/MySideBar";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSidebar } from "@/context/SidebarContext";

const SIDEBAR_WIDTH = "16rem";

const Layout = () => {
  const { isOpen, openSidebar, closeSidebar, toggleSidebar } = useSidebar();
  const isDesktop = useMediaQuery("(min-width: 758px)");

  useEffect(() => {
    if (isDesktop) openSidebar();
    else closeSidebar();
  }, [isDesktop]);

  return (
    <div className="w-screen h-screen flex bg-slate-700 overflow-hidden">
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
        {/* Toggle button */}
        <Button
          onClick={toggleSidebar}
          className={`fixed top-4 z-30 transition-all duration-300 ease-in-out ${isOpen ? "left-[17rem]" : "left-4"
            }`}
          variant="outline"
          size="icon"
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>

        {/* Outlet container */}
        <div className="w-full h-screen flex items-center justify-center p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
