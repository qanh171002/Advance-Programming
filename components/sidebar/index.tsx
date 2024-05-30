"use client"
import { FC } from 'react'
import { HiX } from "react-icons/hi";
import Image from 'next/image';
import { useSidebarContext } from '@/providers/SidebarProvider';
import useMobileView from '@/hooks/useMobileView';
import Links from "./components/Links";

type Props = {}

const Sidebar: FC<Props> = () => {
  const { isMobile } = useMobileView()
  const { openSidebar, setOpenSidebar } = useSidebarContext()

  return (
    <>
      <div className={`bg-[#000] bg-opacity-70 fixed inset-0 z-50 ${openSidebar && isMobile ? 'block w-screen h-screen' : 'hidden'}`} onClick={() => setOpenSidebar(false)} />
      <div
        className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 
        ${openSidebar ? "translate-x-0" : "-translate-x-96"}`}
      >
        <span className="absolute top-4 right-4 block cursor-pointer xl:hidden" onClick={() => setOpenSidebar(false)} >
          <HiX />
        </span>

        <div className={`mx-[20px] mt-[50px] flex flex-col items-center relative`}>
          <Image src="/logo.ico" alt="Your image" width={50} height={50} />
          <div className="mt-3 ml-1 h-2.5 font-poppins text-[15px] font-bold uppercase text-[#1488DB] dark:text-[#1488DB] relative z-10">HO CHI MINH CITY</div>
          <div className="mt-1.5 ml-1 h-2.5 font-poppins text-[15px] font-bold uppercase  text-[#032B91] dark:text-[#032B91] relative z-10">UNIVERSITY OF TECHNOLOGY</div>
        </div>

        <div className="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />

        <ul className="mb-auto pt-1">
          <Links onClickRoute={isMobile ? () => setOpenSidebar(false) : undefined} />
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
