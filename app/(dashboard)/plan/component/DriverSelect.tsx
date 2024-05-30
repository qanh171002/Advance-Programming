import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RouteOperation } from "@/library/route";
import { Driver } from "@/library/libraryType/type";
import { IoMdPerson, IoMdPhonePortrait } from "react-icons/io";
import { MdCheckCircleOutline, MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from "react-icons/md";

interface DriverSelectProps {
    onClose: () => void;
    submit: () => void;
    selectedDriver?: Driver;
    setSelectedDriver: any;
}

const DriverSelect: React.FC<DriverSelectProps> = ({ onClose, submit, selectedDriver, setSelectedDriver }) => {
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [loading, setLoading] = useState(false);
    const [drivers, setDrivers] = useState<any>()
    const route = new RouteOperation()

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleClose = (event?: React.MouseEvent<HTMLButtonElement>) => {
        if (event) {
            event.preventDefault();
        }
        setIsVisible(false);
    };

    const handleSubmitClick = async () => {
        setLoading(true);
        await submit()
    }

    useEffect(() => {
        const handleGetRecommendDriver = async () => {
            const response = await route.RecommendDriver();
            if (!response.error) {
                setDrivers(response.data)
            }
            if (response.data.length != 0) {
                setSelectedDriver(response.data[0])
            }
        }
        handleGetRecommendDriver()
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 bottom-0 flex backdrop-blur-sm items-center justify-center bg-[#000000] dark:bg-white/30 bg-opacity-50 z-[100] inset-0 px-4"

            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={handleAnimationComplete}
        >
            <motion.div
                ref={notificationRef}
                className="relative min-w-full sm:min-w-[300px] sm:max-w-screen max-h-[80vh] xs:max-h-64 bg-white dark:bg-navy-800 rounded-xl p-4 flex flex-col shadow"
                initial={{ scale: 0 }}
                animate={{ scale: isVisible ? 1 : 0 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-[#000000] dark:text-gray-500 text-xl font-bold mb-2 text-center">Vui lòng chọn tài xế</h2>
                <div className="overflow-scroll max-h-full w-full no-scrollbar">
                    <div className="justify-center grid gap-3 grid-cols-1">
                        {drivers ? (drivers.length != 0 ? drivers.map((driver: Driver) => (
                            <div key={driver.id} className={`cursor-pointer flex gap-1 sm:gap-2 border rounded-lg p-4 ${selectedDriver?.id === driver.id ? 'border-blue-500 dark:border-blue-500' : 'border-gray-200 dark:border-gray-300'}`} onClick={() => setSelectedDriver(driver)}>
                                <div className='grow flex flex-col justify-between p-1'>
                                    <div className='flex flex-col md:flex-row md:gap-2 md:place-items-center mb-2 md:mb-0'>
                                        <div className='flex place-items-center gap-0.5 text-sm text-[#000000] dark:text-gray-300'>
                                            <IoMdPerson />
                                            <p className='pt-0.5 font-medium'>{driver.driverName}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col md:flex-row md:gap-2 md:place-items-center mb-2 md:mb-0'>
                                        <div className='flex place-items-center gap-0.5 text-sm text-[#000000] dark:text-gray-300'>
                                            <IoMdPhonePortrait />
                                            <p className='pt-0.5 font-medium'>{driver.driverNumber}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-full text-[#000000] dark:text-gray-300 flex justify-center place-items-center">
                                    {selectedDriver?.id === driver.id ? <MdOutlineRadioButtonChecked /> : <MdOutlineRadioButtonUnchecked />}
                                </div>
                            </div>
                        )) : <div className="w-full flex justify-center place-items-center text-center px-4 text-[#000000] dark:text-gray-500">Hiện không có tài xế phù hợp, vui lòng tạo mới.</div>) :
                            <div className="min-h-[200px] w-full flex justify-center place-items-center">
                                <svg aria-hidden="true" className="w-14 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                            </div>}
                    </div>
                </div>

                <div className="flex w-full justify-between gap-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className=" mt-4 px-4 py-2 truncate h-10 rounded-md overflow-clip text-black border border-gray-300 dark:text-gray-300 hover:cursor-pointer flex"
                        onClick={(event) => handleClose(event)}
                    >
                        Đóng
                    </motion.button>
                    {drivers && drivers.length != 0 && <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        disabled={loading ? true : false}
                        className={`mt-4 px-4 py-2 truncate h-10 rounded-md overflow-clip ${loading ? "bg-gray-300" : "bg-blue-500 dark:bg-[#032B91]"} text-white  hover:cursor-pointer flex`}
                        onClick={handleSubmitClick}
                    >
                        {
                            loading ?
                                <svg aria-hidden="true" className="w-14 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                :
                                <p>Xác nhận</p>
                        }

                    </motion.button>}
                </div>

            </motion.div>
        </motion.div>
    );
};

export default DriverSelect;