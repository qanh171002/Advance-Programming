"use client";
import { type Metadata } from "next";
import "./globals.css";
import "@/components/calendar/MiniCalendar.css";
import Image from "next/image";
import { LoadScript } from "@react-google-maps/api";
import { Suspense } from "react";
import UserProvider from "@/providers/PassedData";
export const CustomLoadingElement = () => {
  return (
    <div className="w-full h-screen flex flex-col gap-4 justify-center place-items-center dark:text-white bg-white dark:bg-navy-800">
      <Image src="/logo.ico" alt="Your image" width={50} height={50} />
      <span className="text-xl">Đang tải dữ liệu...</span>
    </div>
  );
};
export default function layoutStructure({
  childrenProps,
}: {
  childrenProps: React.ReactNode;
}) {
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? ""}
      libraries={["places"]}
      loadingElement={<CustomLoadingElement />}
    >
      <UserProvider>
        <Suspense fallback={<CustomLoadingElement />}>{childrenProps}</Suspense>
      </UserProvider>
    </LoadScript>
  );
}
