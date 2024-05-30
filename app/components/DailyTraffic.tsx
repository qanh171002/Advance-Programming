"use client"
import { useState, useEffect } from 'react';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import Card from '@/components/card';
import dynamic from 'next/dynamic';
import { Route } from '@/library/libraryType/type';

const BarChart = dynamic(() => import('@/components/charts/BarChart'), {
  loading: () => <Card className="pb-7 p-[20px] h-full w-full flex justify-between place-items-center">
    <div className="grow flex justify-center place-items-center">
      <svg aria-hidden="true" className="w-14 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
      </svg>
    </div>
  </Card>,
  ssr: false,
});

const DailyTraffic = ({ data }: { data: Route[] }) => {
  const [past7DaysData, setPast7DaysData] = useState<{ date: string; tripsCount: number; }[]>([]);
  const [barChartOptionsDailyTraffic, setBarChartOptionsDailyTraffic] = useState<any>()

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

      const tripsCount = dataForDate.length;

      past7DaysData.push({
        date: date.toLocaleDateString(),
        tripsCount: tripsCount,
      });

      const day = date.toLocaleDateString().split('/')[0];
      categories.push(day);
    }

    setPast7DaysData(past7DaysData);
    setBarChartOptionsDailyTraffic({
      chart: {
        toolbar: {
          show: false,
        },
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
      xaxis: {
        categories: categories,
        show: false,
        labels: {
          show: true,
          style: {
            colors: "#A3AED0",
            fontSize: "14px",
            fontWeight: "500",
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false,
        color: "black",
        labels: {
          show: true,
          style: {
            colors: "#CBD5E0",
            fontSize: "14px",
          },
        },
      },
      grid: {
        show: false,
        strokeDashArray: 5,
        yaxis: {
          lines: {
            show: true,
          },
        },
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          type: "vertical",
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          colorStops: [
            [
              {
                offset: 0,
                color: "#4318FF",
                opacity: 1,
              },
              {
                offset: 100,
                color: "rgba(67, 24, 255, 1)",
                opacity: 0.28,
              },
            ],
          ],
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: "25px",
        },
      },
      responsive: [{
        breakpoint: 1368,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 5,
              columnWidth: "10px",
            },
          },
        },
      }]
    })
  };

  const calculateTotalTrips7Days = () => {
    return past7DaysData.reduce((totalTrips, dayData) => totalTrips + dayData.tripsCount, 0);
  };

  const percentage = past7DaysData.length >= 2 && past7DaysData[5]?.tripsCount !== 0
    ? ((past7DaysData[6]?.tripsCount - past7DaysData[5]?.tripsCount) / past7DaysData[5]?.tripsCount) * 100
    : 0;

  return (
    <Card className="pb-7 p-[20px] grow">
      <div className="flex flex-row justify-between">
        <div className="ml-1 pt-2">
          <p className="text-sm font-medium leading-4 text-gray-600">Lộ trình theo ngày</p>
          <p className="text-[34px] font-bold text-navy-700 dark:text-white">
            {calculateTotalTrips7Days()}{' '}
            <span className="text-sm font-medium leading-6 text-gray-600">chuyến xe</span>
          </p>
        </div>
        <div className="mt-2 flex items-start">
          <div className={`flex items-center text-sm ${percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {percentage >= 0 ? <MdArrowDropUp className="h-5 w-5" /> : <MdArrowDropDown className="h-5 w-5" />}
            <p className="font-bold"> {percentage.toFixed(2)}%</p>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full pt-10 pb-0">
        {barChartOptionsDailyTraffic && past7DaysData ? <BarChart
          chartData={[
            {
              name: 'Số lượng chuyến xe',
              data: past7DaysData.map(day => day.tripsCount),
            },
          ]}
          //@ts-ignore
          chartOptions={barChartOptionsDailyTraffic}
        /> : <Card className="pb-7 p-[20px] h-full w-full flex justify-between place-items-center">
          <div className="grow flex justify-center place-items-center">
            <svg aria-hidden="true" className="w-14 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
          </div>
        </Card>}
      </div>
    </Card>
  );
};

export default DailyTraffic;