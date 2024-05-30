"use client"
import dynamic from "next/dynamic";
import {
  MdArrowDropUp,
  MdOutlineCalendarToday,
  MdBarChart,
} from "react-icons/md";
import Card from "@/components/card";
import { Button } from "@nextui-org/react";
import { Route } from "@/library/libraryType/type";
import { useState, useEffect } from "react";

const LineChart = dynamic(() => import("@/components/charts/LineChart"), {
  loading: () => <Card className="pb-7 p-[20px] h-full w-full flex justify-between place-items-center">
    <div className="grow flex justify-center place-items-center">
      <svg aria-hidden="true" className="w-14 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
      </svg>
    </div>
  </Card>,
  ssr: false
});

const TotalSpent = ({ data }: { data: Route[] }) => {
  const [past7DaysData, setPast7DaysData] = useState<{ date: string; totalCost: number; totalProfit: number; }[]>([]);
  const [lineChartOptionsTotalSpent, setLineChartOptionsTotalSpent] = useState<any>();

  useEffect(() => {
    generateDataForPast7Days();
  }, [data]);

  const generateDataForPast7Days = () => {
    const currentDate = new Date();
    const past7DaysData = [];
    const categories = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);

      const dataForDate = data.filter(route => {
        const routeDate = new Date(route.beginDate);
        return (
          routeDate.getFullYear() === date.getFullYear() &&
          routeDate.getMonth() === date.getMonth() &&
          routeDate.getDate() === date.getDate()
        );
      });

      const totalCost = dataForDate.reduce((total, route) => total + route.price, 0);
      const totalProfit = dataForDate.reduce((total, route) => total + (route.price + route.income), 0);

      past7DaysData.push({
        date: date.toLocaleDateString(),
        totalCost: totalCost,
        totalProfit: totalProfit
      });

      const day = date.toLocaleDateString().split('/')[0];
      categories.push(day);
    }
    setPast7DaysData(past7DaysData);
    setLineChartOptionsTotalSpent({
      legend: {
        show: false,
      },

      theme: {
        mode: "light",
      },
      chart: {
        type: "line",

        toolbar: {
          show: false,
        },
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },

      tooltip: {
        style: {
          fontSize: "12px",
          fontFamily: undefined,
          backgroundColor: "#000000"
        },
        onDatasetHover: {
          style: {
            fontSize: "12px",
            fontFamily: undefined,
          },
        },
        theme: "dark",
      },
      grid: {
        show: false,
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: "#A3AED0",
            fontSize: "12px",
            fontWeight: "500",
          },
        },
        type: "text",
        range: undefined,
        categories: categories,
      },

      yaxis: {
        show: false,
      },
    })
  };

  const calculateTotalTrips7Days = () => {
    return past7DaysData.reduce((totalTrips, dayData) => totalTrips + dayData.totalCost, 0);
  };

  const calculateTotalProfit7Days = () => {
    return past7DaysData.reduce((totalProfit, dayData) => totalProfit + dayData.totalProfit, 0);
  };

  const percentage = past7DaysData.length >= 2 && past7DaysData[5]?.totalProfit !== 0
    ? ((past7DaysData[6]?.totalProfit - past7DaysData[5]?.totalProfit) / past7DaysData[5]?.totalProfit) * 100
    : 0;

  const lineChartDataTotalSpent = [
    {
      name: "Doanh thu",
      data: past7DaysData.map(dayData => dayData.totalProfit),
      color: "#6AD2FF",
    },
    {
      name: "Vốn",
      data: past7DaysData.map(dayData => dayData.totalCost),
      color: "#4318FF",
    },
  ];

  return (
    <Card className="!p-[20px] text-center">
      <div className="flex justify-between">
        <Button className="linear mt-1 flex items-center justify-center gap-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:hover:opacity-90 dark:active:opacity-80">
          <MdOutlineCalendarToday />
          <span className="text-sm font-medium text-gray-600">Theo ngày</span>
        </Button>
        <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
          <MdBarChart className="h-6 w-6" />
        </button>
      </div>

      <div className="flex h-full w-full flex-col sm:flex-row gap-2 justify-between 2xl:overflow-hidden">
        <div className="flex gap-2 justify-between sm:justify-start sm:flex-col">
          <p className="mt-[10px] sm:mt-[20px] text-3xl font-bold text-navy-700 dark:text-white flex">
            {(calculateTotalProfit7Days() - calculateTotalTrips7Days()).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </p>
          <div className="flex flex-col items-end sm:items-start">
            <p className="mt-2 text-sm text-gray-600 whitespace-nowrap">Tổng lợi nhuận</p>
            <div className="flex flex-row items-center justify-center">
              <MdArrowDropUp className="font-medium text-green-500" />
              <p className="text-sm font-bold text-green-500"> +{percentage.toFixed(2)}% </p>
            </div>
          </div>
        </div>
        <div className="h-full min-h-[200px] w-full">
          {lineChartOptionsTotalSpent && lineChartDataTotalSpent ? <LineChart
            // @ts-ignore
            options={lineChartOptionsTotalSpent}
            series={lineChartDataTotalSpent}
          /> : <Card className="pb-7 p-[20px] w-full h-full flex justify-between place-items-center">
            <div className="grow flex justify-center place-items-center">
              <svg aria-hidden="true" className="w-14 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
            </div>
          </Card>}
        </div>
      </div>
    </Card>
  );
};

export default TotalSpent;