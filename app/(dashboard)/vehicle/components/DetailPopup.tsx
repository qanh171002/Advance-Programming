"use client"
import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { Button } from "@nextui-org/react";
import { FaTrash, FaPen, FaSave } from "react-icons/fa";
import MiniCalendar from "@/components/calendar/MiniCalendar";
import { Vehicle } from "@/library/libraryType/type";
import { VehicleOperation } from "@/library/vehicle";
import NotiPopup from "@/components/notification";
import SubmitPopup from "@/components/submit";
import InputWithError from "./Input";
import { RouteOperation } from "@/library/route";
import CustomTimeline from "@/components/timeline";

interface DetailPopupProps {
    onClose: () => void;
    dataInitial: Vehicle;
    reloadData: () => void
}

const DetailPopup: React.FC<DetailPopupProps> = ({ onClose, dataInitial, reloadData }) => {
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [data, setData] = useState(dataInitial);
    const [isEditing, setIsEditing] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [message, setMessage] = useState("");
    const vehice = new VehicleOperation()
    const route = new RouteOperation()
    const [errors, setErrors] = useState({
        licenseplate: "",
        height: "",
        length: "",
        width: "",
        mass: "",
    });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
            reloadData();
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleSaveClick = () => {
        const tempErrors = { ...errors };
        let hasError = false;

        if (!data.licenseplate.match(/^\d{2}[A-Z]-\d{3}.\d{2}$/)) {
            tempErrors.licenseplate = "Biển số xe không hợp lệ. Ví dụ: 12A-345.23";
            hasError = true;
        }

        if (data.height === "" || data.height === "0") {
            tempErrors.height = "Chiều cao không được bỏ trống.";
            hasError = true;
        }
        if (data.length === "" || data.length === "0") {
            tempErrors.length = "Chiều dài không được bỏ trống.";
            hasError = true;
        }
        if (data.width === "" || data.width === "0") {
            tempErrors.width = "Chiều rộng không được bỏ trống.";
            hasError = true;
        }
        if (data.mass === "" || data.mass === "0") {
            tempErrors.mass = "Tải trọng không được bỏ trống.";
            hasError = true;
        }

        if (hasError) {
            setErrors(tempErrors);
        } else {
            setErrors({
                licenseplate: "",
                height: "",
                length: "",
                width: "",
                mass: "",
            });
            const hasChanges =
                data.licenseplate !== dataInitial.licenseplate ||
                data.height !== dataInitial.height ||
                data.length !== dataInitial.length ||
                data.width !== dataInitial.width ||
                data.mass !== dataInitial.mass ||
                data.enginefuel !== dataInitial.enginefuel ||
                data.type !== dataInitial.type || data.maintenanceDay !== dataInitial.maintenanceDay
            if (hasChanges) {
                setMessage("Bạn có xác nhận muốn thay đổi thông tin phương tiện?");
                setOpenModal(true);
            } else {
                setIsEditing(false);
            }
        }
    };

    useEffect(() => {
        if (data.licenseplate.match(/^\d{2}[A-Z]-\d{3}.\d{2}$/)) {
            setErrors(prevErrors => ({ ...prevErrors, licenseplate: "" }));
        }
        if (data.height !== "" && data.height !== "0") {
            setErrors(prevErrors => ({ ...prevErrors, height: "" }));
        }
        if (data.length !== "" && data.length !== "0") {
            setErrors(prevErrors => ({ ...prevErrors, length: "" }));
        }
        if (data.width !== "" && data.width !== "0") {
            setErrors(prevErrors => ({ ...prevErrors, width: "" }));
        }
        if (data.mass !== "" && data.mass !== "0") {
            setErrors(prevErrors => ({ ...prevErrors, mass: "" }));
        }
    }, [data]);

    useEffect(() => {
        console.log(data.maintenanceDay)
    }, []);

    const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (/^\d*\.?\d*$/.test(value)) {
            setData({ ...data, [name]: value });
        }
    };

    const handleChangeData = async () => {
        //@ts-ignore
        const response = await vehice.updateVehicleByID(dataInitial.id, data)
        setOpenModal(false)
        if (response.error) {
            setMessage("Cập nhật phương tiện thất bại.");
            setOpenError(true);
        } else {
            dataInitial.licenseplate = data.licenseplate;
            dataInitial.height = data.height;
            dataInitial.length = data.length;
            dataInitial.width = data.width;
            dataInitial.mass = data.mass;
            dataInitial.type = data.type;
            dataInitial.enginefuel = data.enginefuel;
            dataInitial.maintenanceDay = data.maintenanceDay
            setMessage("Cập nhật phương tiện thành công.");
            setOpenError(true);
        }
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
            {openError && <NotiPopup message={message} onClose={() => { setOpenError(false); setIsEditing(false); }} />}
            {openModal && <SubmitPopup message={message} onClose={() => { setOpenModal(false); }} submit={handleChangeData} />}
            <motion.div
                ref={notificationRef}
                className={`relative w-[98%] sm:w-9/12 dark:bg-navy-900 bg-white rounded-xl p-4`}
                initial={{ scale: 0 }}
                animate={{ scale: isVisible ? 1 : 0 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative items-center justify-center flex-col flex h-10 w-full border-b-2 border-gray-200 dark:!border-navy-700 overflow-hidden">
                    <div className="font-bold text-lg sm:text-2xl pb-2 w-full text-center">
                        Thông tin phương tiện
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
                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Phân loại:
                            </div>
                            {isEditing ? (
                                <select
                                    className="w-1/2 dark:text-[#000000] pl-2 rounded"
                                    value={data.type}
                                    onChange={(e) =>
                                        setData({ ...data, type: e.target.value })
                                    }
                                >
                                    <option value="Bus">Xe khách</option>
                                    <option value="ContainerTruck">Xe container</option>
                                    <option value="Truck">Xe tải</option>
                                </select>
                            ) : (
                                <div>{data.type === "Bus" ? "Xe khách" : (data.type === "ContainerTruck" ? "Xe container" : "Xe tải")}</div>
                            )}
                        </div>
                        {isEditing ?
                            <InputWithError
                                value={data.licenseplate}
                                error={errors.licenseplate}
                                onChange={(e) => setData({ ...data, licenseplate: e.target.value })}
                                name2="licenseplate"
                                label="Biển số xe"
                            />
                            :
                            <div className="flex">
                                <div className="w-1/2 font-bold text-base">
                                    Biển số xe:
                                </div>
                                <div>{data.licenseplate}</div>
                            </div>
                        }
                        <div className={`flex`}>
                            <div className="w-1/2 font-bold text-base">
                                Loại động cơ:
                            </div>
                            {isEditing ? (
                                <select
                                    className="w-1/2 dark:text-[#000000] pl-2 rounded"
                                    value={data.enginefuel}
                                    onChange={(e) =>
                                        setData({ ...data, enginefuel: e.target.value })
                                    }
                                >
                                    <option value="Gasoline">Gasoline</option>
                                    <option value="Diesel">Diesel</option>
                                </select>
                            ) : (
                                <div>{data.enginefuel}</div>
                            )}
                        </div>
                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Trạng thái:
                            </div>
                            {isEditing ? (
                                <select
                                    className="w-1/2 dark:text-[#000000] pl-2 rounded"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData({ ...data, status: e.target.value })
                                    }
                                >
                                    {data.status === "Active" ? <option value="Active">Đang nhận đơn</option> : (data.status === "Inactive" ? <option value="Inactive">Sẵn sàng</option> : <option value="Inactive">Đang bảo trì</option>)}
                                </select>
                            ) : (
                                <div>{data.status === "Active" ? "Đang nhận đơn" : (data.status === "Inactive" ? "Sẵn sàng" : "Đang bảo trì")}</div>
                            )}
                        </div>
                        {isEditing ?
                            <InputWithError
                                value={data.mass}
                                error={errors.mass}
                                onChange={handleNumericInputChange}
                                name2="mass"
                                label="Tải trọng"
                            />
                            :
                            <div className="flex">
                                <div className="w-1/2 font-bold text-base">
                                    Tải trọng:
                                </div>
                                <div>{data.mass}</div>
                            </div>
                        }
                        {isEditing ?
                            <InputWithError
                                value={data.length}
                                error={errors.length}
                                onChange={handleNumericInputChange}
                                name2="length"
                                label="Chiều dài"
                            />
                            :
                            <div className="flex">
                                <div className="w-1/2 font-bold text-base">
                                    Chiều dài:
                                </div>
                                <div>{data.length}</div>
                            </div>
                        }
                        {isEditing ?
                            <InputWithError
                                value={data.width}
                                error={errors.width}
                                onChange={handleNumericInputChange}
                                name2="width"
                                label="Chiều rộng"
                            />
                            :
                            <div className="flex">
                                <div className="w-1/2 font-bold text-base">
                                    Chiều rộng:
                                </div>
                                <div>{data.width}</div>
                            </div>
                        }
                        {isEditing ?
                            <InputWithError
                                value={data.height}
                                error={errors.height}
                                onChange={handleNumericInputChange}
                                name2="height"
                                label="Chiều cao"
                            />
                            :
                            <div className="flex">
                                <div className="w-1/2 font-bold text-base">
                                    Chiều cao:
                                </div>
                                <div>{data.height}</div>
                            </div>
                        }
                    </div>
                    <div className="flex flex-col lg:w-1/2 dark:bg-navy-900 bg-white rounded-xl p-4 mt-6 lg:mt-0">
                        <span className="w-full text-center font-bold text-base pb-2">
                            Đặt lịch bảo dưỡng định kỳ
                        </span>
                        <MiniCalendar value={data.maintenanceDay} onChange={(e: any) => setData({ ...data, maintenanceDay: e })} />
                    </div>
                </div>

                <div className="w-full flex">
                    {!isEditing ? (
                        <Button
                            className="w-full rounded-lg mt-5 mb-1 py-3 text-[#545e7b] border-[#545e7b] hover:border-green-600 dark:hover:bg-green-700 
                            bg-transparent  hover:text-white border-2 hover:bg-green-600 dark:text-white dark:hover:border-green-700 
                            hover:shadow-md flex gap-1"
                            onClick={handleEditClick}
                        >
                            <FaPen />
                            <span>
                                Chỉnh sửa
                            </span>
                        </Button>
                    ) : (
                        <Button
                            className="w-full rounded-lg mt-5 mb-1 py-3 border-green-400 hover:border-green-600 dark:border-green-700 dark:hover:bg-green-700 text-green-500
                            bg-transparent  hover:text-white border-2 hover:bg-green-600
                            hover:shadow-md flex gap-1"
                            onClick={handleSaveClick}
                        >
                            <FaSave />
                            <span>
                                Lưu
                            </span>
                        </Button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DetailPopup;
