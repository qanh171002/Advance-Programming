"use client"
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { Button } from "@nextui-org/react";
import MapRender from "./MapRender";
import { Address } from "@/library/libraryType/type";

interface MapPopupProps {
    onClose: () => void;
    dataInitial: Address;
    setData: any;
    data: any;
}

interface sourceProps {
    lat: number,
    lng: number,
    label: string,
    name: string
}
const MapPopup: React.FC<MapPopupProps> = ({ onClose, dataInitial, setData, data }) => {
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [source, setSource] = useState<sourceProps>({ lat: dataInitial.latitude, lng: dataInitial.longitude, label: dataInitial.address, name: dataInitial.address })

    const handleSubmitClick = () => {
        setData({ ...data, driverAddress: { latitude: source.lat, longitude: source.lng, address: source.label } })
        handleClose()
    };

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <motion.div
            className={`fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-[#000000] bg-opacity-10 dark:bg-white dark:bg-opacity-5 z-50 p-4 md:p-10`}
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
                className={`relative w-full h-full dark:bg-navy-900 bg-white rounded-xl`}
                initial={{ scale: 0 }}
                animate={{ scale: isVisible ? 1 : 0 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Button
                    className="absolute right-4 top-4 sm:right-3 sm:top-3 w-8 h-8 rounded-full mb-2 z-10 text-[#1488D8] dark:bg-navy-900 dark:text-gray-300 bg-white border-[#1488D8] border-2 dark:border-gray-200 shadow"
                    onClick={handleClose}
                >
                    <IoMdClose className="w-5/6 h-5/6" />
                </Button>
                <div className="grow h-full w-full z-0 rounded-xl flex overflow-hidden">
                    <MapRender source={source} setSource={setSource} />
                </div>

                <div className="absolute bottom-0 w-full flex z-10">
                    <Button
                        className="w-[calc(100%+3px)] rounded-b-lg py-3 text-[#1488D8] dark:bg-navy-900 dark:text-gray-200 bg-white border-[#1488D8] border-2 dark:border-gray-200 hover:shadow-md font-semibold"
                        onClick={handleSubmitClick}
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

export default MapPopup;
