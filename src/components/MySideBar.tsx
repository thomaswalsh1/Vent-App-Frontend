import { Sidebar, SidebarItemGroup } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiOutlineExclamationCircle, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";
import { IoIosNotifications, IoIosHome } from "react-icons/io";
import { VscNewFile } from "react-icons/vsc";
import { FaSignOutAlt, FaSearch } from "react-icons/fa";
import { Modal } from "flowbite-react";
import { Button } from "./ui/button";
import { ReactElement, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setSignout } from "@/state/auth/authSlice";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "./ui/separator";
import { apiClient } from "@/lib/api-client";
import { USER_ROUTES } from "@/utils/constants";
import { RootState } from "@/state/store";

export function MySideBar() {
  const [openSignOut, setOpenSignOut] = useState(false);
  const [pfpLoaded, setPfpLoaded] = useState(false);
  const [pfp, setPfp] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  // global pfp
 
  const currUser = useSelector((state: RootState) => state.auth.user);
  const currToken = useSelector((state: RootState) => state.auth.token);

  const getPfp = async () => {
    try {
      const res = await apiClient.get(`${USER_ROUTES}/${currUser.id}`, {
        headers: {
          Authorization: `Bearer ${currToken}`
        }
      })
      setPfp(res.data.pfp);
    } catch (error) {
      console.error(error);
    } finally {
      setPfpLoaded(true);
    }
  }

  // load the pfp
  useEffect(() => {
    getPfp();
  }, [])
  

  const handleSignOut = () => {
    dispatch(setSignout());
    toast({
      title: "Sign Out",
      description: "Successfully signed out",
    });
    navigate("/");
  };

  const handleNewPost = () => {
    navigate("/new");
  }

  const handleGoHome = () => {
    navigate("/home");
  }

  const handleViewMyProfile = () => {
    navigate("/profile")
  }

  const handleGoToSearch = () => {
    navigate("/search")
  }
  
  const handleSeeNotifs = () => {
    navigate("/notifications")
  }

  return (
    <>
      <Sidebar aria-label="Default sidebar example" className="overflow-hidden">
        <Sidebar.Items className="flex flex-col h-[100%] align-items justify-between">
          <Sidebar.ItemGroup>
            <div className="flex flex-row justify-between">
              <Sidebar.Logo img="" href="" className="-mb-[1.75]">
                <p className="brand-text text-black">Vent</p>
              </Sidebar.Logo>
            </div>
            <Separator />
            <Sidebar.Item onClick={handleGoHome} icon={IoIosHome}>
              Home
            </Sidebar.Item>
            <Sidebar.Item onClick={handleNewPost} icon={VscNewFile}>
              New Post
            </Sidebar.Item>
            <Sidebar.Item onClick={handleGoToSearch} icon={FaSearch}>
              Search
            </Sidebar.Item>
            <Sidebar.Item onClick={handleSeeNotifs} icon={IoIosNotifications}>
              Notifications
            </Sidebar.Item>
            <Sidebar.Item
              onClick={() => setOpenSignOut(true)}

              icon={HiArrowSmRight}
            >
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
          <SidebarItemGroup>
            <Sidebar.Item icon={
              () =>
                pfpLoaded && pfp ? (
                  <img
                    src={pfp}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <HiUser className="h-8 w-8 text-gray-400" />
                )
            } onClick={handleViewMyProfile}>
              {currUser?.username || 'Profile'}
            </Sidebar.Item>
          </SidebarItemGroup>
        </Sidebar.Items>
      </Sidebar>

      <Modal
        show={openSignOut}
        size="md"
        onClose={() => setOpenSignOut(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <FaSignOutAlt className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to sign out?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleSignOut}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenSignOut(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
