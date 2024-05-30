"use client"
import { FC, useEffect, useState } from 'react';
import Widget from "@/components/widget/Widget";
import { FaCarSide, FaRoad } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";
import DailyTraffic from '@/app/components/DailyTraffic';
import PieChartCard from '@/app/components/PieChartCard';
import TaskCard from '@/app/components/TaskCard';
import TotalSpent from '@/app/components/TotalSpent';
import WeeklyRevenue from '@/app/components/WeeklyRevenue';
import { VehicleOperation } from '@/library/vehicle';
import { DriverOperation } from '@/library/driver';
import CustomLoadingElement from '@/app/components/loading';
import Image from "next/image";
import Card from "@/components/card";
import { RouteOperation } from '@/library/route';
import { Route } from '@/library/libraryType/type';

type Props = {};

const DashboardPage: FC<Props> = () => {
    const [vehicleData, setVehicleData] = useState<any>(null)
    const [driverData, setDriverData] = useState<any>(null)
    const [routeData, setRouteData] = useState<any>(null)
    const vehice = new VehicleOperation();
    const driver = new DriverOperation();
    const route = new RouteOperation();

    const handleFetchVehicle = async () => {
        const response = await vehice.viewAllVehicle();
        setVehicleData(response.data)
    }

    const handleFetchRoute = async () => {
        const response = await route.viewAllRoute();
        setRouteData(response.data)
    }


    const handleFetchDriver = async () => {
        const response = await driver.viewAllDriver();
        setDriverData(response.data)
    }

    useEffect(() => {
        handleFetchRoute()
        handleFetchVehicle()
        handleFetchDriver()
    }, []);
    return (
        <div className="min-h-[calc(100vh-118px)]">
            <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
                <Widget
                    icon={<FaCarSide className="h-7 w-7" />}
                    title={"Phương tiện"}
                    subtitle={"Số lượng: " + (vehicleData ? vehicleData.length : "Đang tải...")}
                />
                <Widget
                    icon={<IoPersonCircleSharp className="h-7 w-7" />}
                    title={"Tài xế"}
                    subtitle={"Số lượng: " + (driverData ? driverData.length : "Đang tải...")}
                />
                <Widget
                    icon={<FaRoad className="h-7 w-7" />}
                    title={"Lộ trình"}
                    subtitle={"Số lượng: " + (routeData ? routeData.length : "Đang tải...")}
                />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-1">
                <div className="flex flex-col md:flex-row gap-5 rounded-[20px]">
                    {(driverData) ? <PieChartCard driver={driverData} /> : <Card className='justify-center px-4 place-items-center min-h-[408px] md:min-h-fit md:w-[300px]'>
                        <svg aria-hidden="true" className="w-14 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                    </Card>}
                    {(routeData) ? <DailyTraffic data={routeData} /> : <Card className='justify-center px-4 place-items-center min-h-[408px] grow'>
                        <svg aria-hidden="true" className="w-14 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                    </Card>}

                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 min-h-[400px]">
                {(routeData) ? <TotalSpent data={routeData} /> : <Card className='justify-center px-4 place-items-center min-h-[408px]'>
                    <svg aria-hidden="true" className="w-14 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                </Card>}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5">
                <TaskCard />
            </div>
        </div>
    );
}

export default DashboardPage;