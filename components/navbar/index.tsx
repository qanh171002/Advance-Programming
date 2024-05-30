"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiAlignJustify, FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { TbBrandGithubFilled } from "react-icons/tb";
import Dropdown from "@/components/dropdown";
import routes from "@/data/routes";
import { useSidebarContext } from "@/providers/SidebarProvider";
import { useThemeContext } from "@/providers/ThemeProvider";
import { UsersOperation } from "@/library/account";
import Image from "next/image";
import { motion } from "framer-motion";

type Props = {};

const Navbar = ({ }: Props) => {
  const [currentRoute, setCurrentRoute] = useState("Đang tải...");
  const route = useRouter();
  const pathname = usePathname();
  const { setOpenSidebar } = useSidebarContext();
  const { theme, setTheme } = useThemeContext();
  const [email, setEmail] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>(
    "/img/avatars/avatar4.png"
  );
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const user = new UsersOperation()
  useEffect(() => {
    const handleDocumentClick = (event: any) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsSearchFocused(false);
      } else setIsSearchFocused(true);
    };

    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    getActiveRoute(routes);
  }, [pathname]);

  useEffect(() => {
    const fetchEmail = async () => {
      const response = await user.getUserEmail();
      console.log(response);
      if (response != null) {
        setEmail(response);
      }
    };

    fetchEmail();
  }, []);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const response = await user.handleGetUserProfilePicture();
      console.log(response);
      if (response != null) {
        setProfilePicture(response);
      }
    };

    fetchProfilePicture();
  }, []);

  const getActiveRoute = (routes: any) => {
    let activeRoute = "Báo cáo thống kê";
    for (let i = 0; i < routes.length; i++) {
      if (window.location.href.indexOf(routes[i].path) !== -1) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };

  const handleLogout = async () => {
    await user.onClickLogOut();
    route.push("/");
  };

  const handleSearch = () => {
    if (search == "") return;
    //@ts-ignore
    window.find(search);
  };

  return (
    <nav className="sticky top-4 z-[45] flex flex-col md:flex-row md:justify-between h-full justify-start gap-4 flex-wrap items-center rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px] w-full md:w-[224px]">
        <div className="h-6 w-full pt-1 text-left">
          <Link
            className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            href=" "
          >
            Trang chủ
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {" "}
              /{" "}
            </span>
          </Link>
          <Link
            className="text-sm font-bold capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white whitespace-nowrap"
            href="#"
          >
            {currentRoute}
          </Link>
        </div>
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <Link
            href="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white whitespace-nowrap"
          >
            {currentRoute}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-full flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
        <div
          ref={containerRef}
          className={`relative flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]`}
        >
          <motion.button
            onClick={handleSearch}
            className={`absolute text-xl h-8 w-8 px-2 flex justify-center rounded-full place-items-center transition-all duration-500  ${isSearchFocused ? "bg-blue-500 shadow-sm" : ""
              } transform`}
            initial={{ left: 2 }}
            animate={{
              left: isSearchFocused ? "calc(100% - 2rem - 6px)" : "4px",
            }}
          >
            <FiSearch
              className={`h-4 w-4 dark:text-white ${isSearchFocused ? "text-white" : "text-gray-400"
                }`}
            />
          </motion.button>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Tìm kiếm..."
            className={`block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white transition-all duration-500 ${isSearchFocused ? "pl-4" : "pl-10"
              }`}
          />
        </div>
        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={() => setOpenSidebar(true)}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>
        <Link href="https://github.com/MinzNhat" target="_blank">
          <TbBrandGithubFilled className="h-4 w-4 text-gray-600 dark:text-white" />
        </Link>

        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            theme === "dark" ? setTheme("light") : setTheme("dark");
          }}
        >
          {theme === "dark" ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>

        <Dropdown
          button={
            <div className="avatar w-10 h-10 rounded-full">
              {profilePicture && <Image
                src={profilePicture}
                alt="avatar"
                width={19200}
                height={10800}
                className="w-full h-full object-cover rounded-full"
              />}
            </div>
          }
          className={"py-2 top-8 -left-[180px] w-max"}
        >
          <div className="flex w-56 z-50 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
            <div className="p-3.5">
              <div className="flex items-center flex-col gap-.5">
                <p className="text-sm font-normal text-navy-700 dark:text-white w-full text-left">
                  Đang đăng nhập với
                </p>
                <p className="text-sm font-bold text-navy-700 dark:text-white w-full overflow-hidden">
                  {email}
                </p>{" "}
              </div>
            </div>
            <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

            <div className="flex flex-col pb-3 px-3">
              <button
                onClick={handleLogout}
                className="mt-3 text-sm font-medium text-red-500 hover:text-red-500"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;
