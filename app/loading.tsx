import Image from "next/image";
export default function CustomLoadingElement() {
  return (
    <div className="w-full h-screen flex flex-col gap-4 justify-center place-items-center dark:text-white bg-white dark:bg-navy-800">
      <Image src="/logo.ico" alt="Your image" width={50} height={50} />
      <span className="text-xl dark:text-white">Đang tải dữ liệu...</span>
    </div>
  );
}
