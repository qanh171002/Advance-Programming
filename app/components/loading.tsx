import Image from "next/image";
export default function CustomLoadingElement() {
  return (
    <div className="w-full mt-5 min-h-[calc(100vh-126px)] flex flex-col gap-4 justify-center place-items-center bg-white shadow-md dark:bg-navy-800 rounded-xl">
      <Image src="/logo.ico" alt="Your image" width={50} height={50} />
      <span className="text-xl dark:text-white">Đang tải dữ liệu...</span>
    </div>
  );
}
