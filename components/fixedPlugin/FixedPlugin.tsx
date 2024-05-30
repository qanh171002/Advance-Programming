'use client'

import { useThemeContext } from "@/providers/ThemeProvider";
import { RiMoonFill, RiSunFill } from "react-icons/ri";

export default function FixedPlugin() {
  const { theme, setTheme } = useThemeContext()

  return (
    <button
      className="border-px !z-[99] flex h-[40px] w-[40px] lg:h-[50px] lg:w-[50px] items-center justify-center rounded-full border-[#6a53ff] bg-gradient-to-br from-brandLinear to-blueSecondary p-0"
      onClick={() => {
        theme === 'dark' ? setTheme('light') : setTheme('dark')
      }}
    >
      <div className="cursor-pointer text-gray-600">
        {theme === 'dark' ? (
          <RiSunFill className="h-4 w-4 lg:w-6 lg:h-6 text-white" />
        ) : (
          <RiMoonFill className="h-4 w-4 lg:w-6 lg:h-6 text-white" />
        )}
      </div>
    </button>
  );
}
