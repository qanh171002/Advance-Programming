"use client"
import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { Button } from "@nextui-org/react";
import { FaPen } from "react-icons/fa6";
import MapExport from "./MapExport";
import { Address } from "@/library/libraryType/type";
import { RouteData } from "./CheckTable";
import Progress from "@/components/progress";
import { useRouter } from "next/navigation";
import { usePassDataContext } from "@/providers/PassedData";

interface AddPopupProps {
    onClose: () => void;
    dataInitial: RouteData;
    reloadData: () => void;
}

const AddPopup: React.FC<AddPopupProps> = ({ onClose, dataInitial, reloadData }) => {
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [data, setData] = useState<RouteData>(dataInitial);
    const route = useRouter();
    const { passData, setPassData } = usePassDataContext();
    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
            reloadData();
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <motion.div
            className={`fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-[#000000] bg-opacity-10 dark:bg-white dark:bg-opacity-5 z-50`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                backdropFilter: "blur(6px)",
            }}
            onAnimationComplete={handleAnimationComplete}
        >
            <motion.div
                ref={notificationRef}
                className={`relative w-[98%] sm:w-9/12 dark:bg-navy-900 bg-white rounded-xl p-4 overflow-y-auto`}
                initial={{ scale: 0 }}
                animate={{ scale: isVisible ? 1 : 0 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative items-center justify-center flex-col flex h-10 w-full border-b-2 border-gray-200 dark:!border-navy-700 overflow-hidden">
                    <div className="font-bold text-lg lg:text-2xl pb-2 w-full text-center">
                        Thông tin lộ trình
                    </div>
                    <Button
                        className="absolute right-0 w-8 h-8 top-0 rounded-full mb-2 hover:bg-gray-200 dark:hover:text-navy-900"
                        onClick={handleClose}
                    >
                        <IoMdClose className="w-5/6 h-5/6" />
                    </Button>
                </div>
                <div className="h-96 mt-4 relative flex flex-col lg:flex-row bg-gray-200 bg-clip-border 
                 dark:!bg-navy-800 dark:text-white w-full overflow-y-scroll p-4 rounded-sm">
                    <div className="flex flex-col gap-5 lg:w-1/2 lg:pt-2 lg:pr-5">
                        <Button
                            onClick={() => { setPassData(data.driverID); route.push("/driver") }}
                            className="h-8 w-full flex gap-1 rounded-md border-2 bg-white dark:bg-navy-800"
                        >
                            Xem thông tin tài xế
                        </Button>
                        <Button
                            onClick={() => { setPassData(data.carID); route.push("/vehicle") }}
                            className="h-8 w-full flex gap-1 rounded-md border-2 bg-white dark:bg-navy-800"
                        >
                            Xem thông tin phương tiện
                        </Button>
                        <div className="relative flex w-full justify-self-center place-items-center gap-2">
                            <p className="absolute right-1/2 translate-x-1/2">{data.routeProgress.toFixed(2)}%</p>
                            <Progress value={data.routeProgress} bg_color="bg-white dark:bg-navy-700" />
                        </div>
                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Tên tài xế:
                            </div>
                            <div>{data.driverName}</div>
                        </div>

                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Biển số xe:
                            </div>
                            <div className="w-1/2 line-clamp-3">{data.carLicensePlate}</div>
                        </div>

                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Loại phương tiện:
                            </div>
                            <div>{data.carType == "Bus" ? "Xe buýt" : (data.carType == "Truck" ? "Xe tải" : "Xe container")}</div>
                        </div>

                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Ngày tạo:
                            </div>
                            <div className="w-1/2">{new Date(data.beginDate).toLocaleString()}</div>
                        </div>

                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Ngày dự kiến hoàn thành:
                            </div>
                            <div className="w-1/2">{new Date(data.endDate).toLocaleString()}</div>
                        </div>

                    </div>

                    <div className="flex flex-col lg:w-1/2 min-h-full relative dark:bg-navy-900 bg-white rounded-xl p-4 pt-2 mt-6 lg:mt-0 h-full">
                        <span className="w-full text-center font-bold text-lg pb-2">
                            Vị trí hiện tại
                        </span>
                        <MapExport source={data.begin} destination={data.end} progress={parseFloat(data.routeProgress.toFixed(2))} />
                    </div>
                </div>

                <div className="w-full flex">
                    <Button
                        className="w-full rounded-lg mt-5 mb-1 py-3 text-[#545e7b] border-[#545e7b] hover:border-green-600 dark:hover:bg-green-700 
                            bg-transparent  hover:text-white border-2 hover:bg-green-600 dark:text-white dark:hover:border-green-700 
                            hover:shadow-md"
                        onClick={handleClose}
                    >
                        <span>
                            Xác nhận
                        </span>
                    </Button>

                </div>
            </motion.div>
        </motion.div>
    );
};

export default AddPopup;
