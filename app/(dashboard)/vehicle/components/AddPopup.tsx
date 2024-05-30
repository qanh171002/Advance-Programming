"use client"
import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { Button } from "@nextui-org/react";
import { FaTrash, FaPen } from "react-icons/fa";
import MiniCalendar from "@/components/calendar/MiniCalendar";
import { Vehicle } from "@/library/libraryType/type";
import { VehicleOperation } from "@/library/vehicle";
import NotiPopup from "@/components/notification";
import SubmitPopup from "@/components/submit";
import InputWithError from "./Input";

interface AddPopupProps {
    onClose: () => void;
    reloadData: () => void;
}

const AddPopup: React.FC<AddPopupProps> = ({ onClose, reloadData }) => {
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [message, setMessage] = useState("");
    const vehice = new VehicleOperation()
    const [value, onChange] = useState<any>();
    const [data, setData] = useState<Vehicle>({
        type: "Bus",
        licenseplate: "",
        enginefuel: "Gasoline",
        height: "0",
        length: "0",
        width: "0",
        mass: "0",
        status: "Inactive",
    });

    const [errors, setErrors] = useState({
        licenseplate: "",
        height: "",
        length: "",
        width: "",
        mass: "",
    });

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleSubmitClick = () => {
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
            setMessage("Xác nhận tạo phương tiện?")
            setOpenModal(true)
        }
    };

    const handleAddVehicle = async () => {
        let dataInfo: Vehicle = {
            type: data.type,
            licenseplate: data.licenseplate,
            enginefuel: data.enginefuel,
            height: data.height,
            length: data.length,
            width: data.width,
            mass: data.mass,
            status: data.status,
            maintenanceDay: value ? new Date(value) : new Date(Date.now() + 2 * 30 * 24 * 60 * 60 * 1000)
        }
        const response = await vehice.createVehicle(dataInfo);
        setOpenModal(false)
        if (response.error) {
            setMessage("Đã có lỗi khi tạo mới phương tiện.");
            setOpenError(true);
        } else {
            setMessage("Đã tạo mới phương tiện thành công!");
            setOpenError(true)
        }
    }

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

    const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (/^\d*\.?\d*$/.test(value)) {
            setData({ ...data, [name]: value });
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
            {openError && <NotiPopup message={message} onClose={() => { handleClose(); setOpenError(false); reloadData(); }} />}
            {openModal && <SubmitPopup message={message} onClose={() => { setOpenModal(false); }} submit={handleAddVehicle} />}
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
                        Thêm phương tiện
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
                        </div>
                        <InputWithError
                            label="Biển số xe"
                            value={data.licenseplate}
                            onChange={(e) => setData({ ...data, licenseplate: e.target.value })}
                            error={errors.licenseplate}
                        />
                        <div className={`flex`}>
                            <div className="w-1/2 font-bold text-base">
                                Loại động cơ:
                            </div>
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
                        </div>
                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Trạng thái:
                            </div>
                            <select
                                className="w-1/2 dark:text-[#000000] pl-2 rounded"
                                value={data.status}
                                onChange={(e) =>
                                    setData({ ...data, status: e.target.value })
                                }
                            >
                                <option value="Inactive">Sẵn sàng</option>
                            </select>
                        </div>
                        <InputWithError
                            value={data.mass}
                            error={errors.mass}
                            onChange={handleNumericInputChange}
                            name2="mass"
                            label="Tải trọng"
                        />
                        <InputWithError
                            value={data.length}
                            error={errors.length}
                            onChange={handleNumericInputChange}
                            name2="length"
                            label="Chiều dài"
                        />
                        <InputWithError
                            value={data.width}
                            error={errors.width}
                            onChange={handleNumericInputChange}
                            name2="width"
                            label="Chiều rộng"
                        />
                        <InputWithError
                            value={data.height}
                            error={errors.height}
                            onChange={handleNumericInputChange}
                            name2="height"
                            label="Chiều cao"
                        />
                    </div>
                    <div className="flex flex-col lg:w-1/2 dark:bg-navy-900 bg-white rounded-xl p-4 mt-6 lg:mt-0">
                        <span className="w-full text-center font-bold text-base lg:-mt-3">
                            Đặt lịch bảo dưỡng định kỳ
                        </span>
                        <span className="w-full text-center font-bold text-sm pb-2 lg:pb-1">
                            (Mặc định sẽ là 2 tháng sau)
                        </span>
                        <MiniCalendar value={value} onChange={onChange} />
                    </div>
                </div>

                <div className="w-full flex">
                    <Button
                        className="w-full rounded-lg mt-5 mb-1 py-3 text-[#545e7b] border-[#545e7b] hover:border-green-600 dark:hover:bg-green-700 
                        bg-transparent  hover:text-white border-2 hover:bg-green-600 dark:text-white dark:hover:border-green-700 
                        hover:shadow-md"
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

export default AddPopup;
