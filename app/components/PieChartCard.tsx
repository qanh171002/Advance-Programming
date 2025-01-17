'use client'
import dynamic from "next/dynamic";
import { pieChartOptions } from "@/data/charts";
import Card from "@/components/card";
import { MdBarChart } from "react-icons/md";

const PieChart = dynamic(() => import("@/components/charts/PieChart"), {
  loading: () => <svg aria-hidden="true" className="w-14 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
  </svg>,
  ssr: false
})

const PieChartCard = ({ driver }: { driver: any }) => {
  const readyDrivers = driver.filter((item: any) => item.driverStatus === 0);
  const busyDrivers = driver.filter((item: any) => item.driverStatus === 1);
  let readyPercentage, busyPercentage;
  if (readyDrivers.length === 0 && busyDrivers.length === 0) {
    readyPercentage = 50;
    busyPercentage = 50;
  } else {
    readyPercentage = parseFloat(((readyDrivers.length / driver.length) * 100).toFixed(1));
    busyPercentage = 100 - readyPercentage;
  }
  return (
    <Card className="rounded-[20px] p-3 md:w-[300px]">
      <div className="flex flex-row justify-between px-3 pt-2">
        <div className="w-full flex place-items-center sm:place-items-start">
          <h4 className="text-lg font-bold text-navy-700 dark:text-white w-full">
            Trạng thái tài xế
          </h4>
        </div>
        <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
          <MdBarChart className="h-6 w-6" />
        </button>
      </div>

      <div className="mb-auto flex h-[220px] w-full items-center justify-center mt-8">
        <PieChart
          // @ts-ignore
          options={pieChartOptions}
          series={[readyPercentage, busyPercentage]}
        />
      </div>
      <div className="flex flex-row !justify-between rounded-2xl py-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-brand-500" />
            <p className="ml-1 text-sm font-normal text-gray-600">Sẵn sàng ({readyDrivers.length})</p>
          </div>
          <p className="mt-px text-xl font-bold text-navy-700  dark:text-white">
            {readyPercentage}%
          </p>
        </div>

        <div className="h-10 mt-1 w-px bg-gray-300 dark:bg-white/10" />

        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-[#6AD2FF]" />
            <p className="ml-1 text-sm font-normal text-gray-600">Đang bận ({busyDrivers.length})</p>
          </div>
          <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">
            {busyPercentage}%
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PieChartCard;
