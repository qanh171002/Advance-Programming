import React, { MouseEvent, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { motion, Variants } from "framer-motion";
import DashIcon from "@/components/icons/DashIcon";
import routes from "@/data/routes";

type Props = {
  onClickRoute?: (e: MouseEvent<HTMLElement>) => any | any
}

const linkVariants: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
};

export function SidebarLinks({ onClickRoute }: Props) {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const findActiveRouteIndex = () => {
      for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        if (route.layout && route.path && pathname.includes(route.path)) {
          return i;
        }
      }
      return null;
    };

    setActiveIndex(findActiveRouteIndex());
  }, [pathname]);

  const handleRouteClick = (index: number, e: React.MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
    setActiveIndex(index);
    if (onClickRoute) {
      onClickRoute(e);
    }
  };

  const createLinks = (routes: any) => {
    const toolRoutes = routes.filter((route: { name: string; }) => route.name == "Báo cáo thống kê" || route.name == "Thêm lộ trình");
    const managementRoutes = routes.filter((route: { name: string; }) => route.name !== "Báo cáo thống kê" && route.name !== "Thêm lộ trình");

    return (
      <>
        <div className="mb-4">
          <p className={`${activeIndex != null && activeIndex < 2 ? "text-brand-500 dark:text-brand-400" : "text-gray-600"}  font-semibold mb-2 pl-5`}>Công cụ</p>
          {toolRoutes.map((route: any, index: number) => (
            <Link key={index} href={route.path} onClick={(e) => handleRouteClick(index, e)}>
              <motion.div
                variants={linkVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="relative mb-3 flex hover:cursor-pointer"
              >
                <li
                  className="my-[3px] flex cursor-pointer items-center px-8"
                  key={index}
                >
                  <span
                    className={`${activeIndex === index
                      ? "font-bold text-brand-500 dark:text-white"
                      : "font-medium text-gray-600"
                      }`}
                  >
                    {route.icon ? route.icon : <DashIcon />}{" "}
                  </span>
                  <p
                    className={`leading-1 ml-4 flex ${activeIndex === index
                      ? "font-bold text-navy-700 dark:text-white"
                      : "font-medium text-gray-600"
                      }`}
                  >
                    {route.name}
                  </p>
                </li>
                {activeIndex === index ? (
                  <motion.div
                    className="absolute right-0 -top-0.5 h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400"
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "-100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 * index }}
                  />
                ) : null}
              </motion.div>
            </Link>
          ))}
        </div>
        <div>
          <p className={`${activeIndex != null && activeIndex > 1 ? "text-brand-500 dark:text-brand-400" : "text-gray-600"} font-semibold mb-2 pl-5 pt-2`}>Quản lý</p>
          {managementRoutes.map((route: any, index: number) => (
            <Link key={index + 2} href={route.path} onClick={(e) => handleRouteClick(index + 2, e)}>
              <motion.div
                variants={linkVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.3, delay: 0.1 * (index + 2) }}
                className="relative mb-3 flex hover:cursor-pointer"
              >
                <li
                  className="my-[3px] flex cursor-pointer items-center px-8"
                  key={index + 2}
                >
                  <span
                    className={`${activeIndex === index + 2
                      ? "font-bold text-brand-500 dark:text-white"
                      : "font-medium text-gray-600"
                      }`}
                  >
                    {route.icon ? route.icon : <DashIcon />}{" "}
                  </span>
                  <p
                    className={`leading-1 ml-4 flex ${activeIndex === index + 2
                      ? "font-bold text-navy-700 dark:text-white"
                      : "font-medium text-gray-600"
                      }`}
                  >
                    {route.name}
                  </p>
                </li>
                {activeIndex === index + 2 ? (
                  <motion.div
                    className="absolute right-0 -top-0.5 h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400"
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "-100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 * index }}
                  />
                ) : null}
              </motion.div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return createLinks(routes);
}

export default SidebarLinks;