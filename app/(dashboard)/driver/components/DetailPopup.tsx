"use client"
import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { Button } from "@nextui-org/react";
import Dropzone from "./Dropzone";
import axios from "axios";
import InputWithError from "./Input";
import { FaPen } from "react-icons/fa6";
import { CarouselSlider } from "@/components/slider";
import { Address, updateDriver } from "@/library/libraryType/type";
import { DriverOperation } from "@/library/driver";
import NotiPopup from "@/components/notification";
import SubmitPopup from "@/components/submit";
import { FaSave } from "react-icons/fa";
import MapPopup from "./MapPopup";
import { MdHistory } from "react-icons/md";
import { RouteOperation } from "@/library/route";
import CustomTimeline from "@/components/timeline";

interface DriverData {
    driverName: string;
    driverNumber: string;
    driverAddress: Address;
    driverStatus: number;
    driverLicense: string[];
    driveHistory?: string[]
}

interface AddPopupProps {
    onClose: () => void;
    dataInitial: DriverData;
    reloadData: () => void;
}

const AddPopup: React.FC<AddPopupProps> = ({ onClose, dataInitial, reloadData }) => {
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState<DriverData>(dataInitial);
    const [files, setFiles] = useState<Blob[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [openMap, setOpenMap] = useState(false);
    const [openNoti, setOpenNoti] = useState(false);
    const [message, setMessage] = useState("");
    const driver = new DriverOperation()
    const route = new RouteOperation()
    const [errors, setErrors] = useState({
        driverName: "",
        driverNumber: "",
        driverAddress: "",
        driverStatus: "",
        driverLicense: "",
    });
    const [routes, setRoutes] = useState<any>([]);
    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const driveHistory = dataInitial.driveHistory || [];
                const routeData = await Promise.all(driveHistory.map(routeID => route.GetRoute(routeID)));
                const routesData = routeData.map(response => response.data);

                setRoutes(routesData);
            } catch (error) {
                console.error("Error fetching routes:", error);
            }
        };

        fetchRoutes();
    }, [dataInitial]);

    const handleEditClick = async () => {
        console.log(data)
        setIsEditing(true);
    };

    const validatePhoneNumber = (phone: string) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const handleSaveClick = () => {
        const tempErrors = { ...errors };
        let hasError = false;

        if (data.driverName.trim() === "") {
            tempErrors.driverName = "Tên tài xế không được bỏ trống.";
            hasError = true;
        } else {
            tempErrors.driverName = "";
        }

        if (data.driverNumber.trim() === "" || !validatePhoneNumber(data.driverNumber)) {
            tempErrors.driverNumber = "Số điện thoại không hợp lệ.";
            hasError = true;
        } else {
            tempErrors.driverNumber = "";
        }

        if (data.driverAddress.address.trim() === "") {
            tempErrors.driverAddress = "Địa chỉ không được bỏ trống.";
            hasError = true;
        } else {
            tempErrors.driverAddress = "";
        }
        if (hasError) {
            setErrors(tempErrors);
        } else {
            setErrors({
                driverName: "",
                driverNumber: "",
                driverAddress: "",
                driverStatus: "",
                driverLicense: "",
            });
            const hasChanges =
                data.driverName !== dataInitial.driverName ||
                data.driverNumber !== dataInitial.driverNumber ||
                data.driverAddress !== dataInitial.driverAddress ||
                files.length !== 0
            if (hasChanges) {
                setMessage("Bạn có xác nhận muốn thay đổi thông tin tài xế?");
                setOpenModal(true);
            } else {
                setIsEditing(false);
            }

        }
    };

    useEffect(() => {
        if (data.driverNumber.match(/^\d{10}$/)) {
            setErrors(prevErrors => ({ ...prevErrors, driverNumber: "" }));
        }
        if (data.driverName !== "") {
            setErrors(prevErrors => ({ ...prevErrors, driverName: "" }));
        }
        if (data.driverAddress.address !== "") {
            setErrors(prevErrors => ({ ...prevErrors, driverAddress: "" }));
        }
        if (data.driverLicense.length !== 0) {
            setErrors(prevErrors => ({ ...prevErrors, driverLicense: "" }));
        }
    }, [data]);

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
            reloadData();
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleChangeData = async () => {
        let updateDriverData: updateDriver = {
            driverName: data.driverName,
            driverNumber: data.driverNumber,
            driverAddress: data.driverAddress,
            driverStatus: data.driverStatus,
        }
        if (files.length != 0) { updateDriverData = { ...updateDriverData, driverLicense: files } }
        //@ts-ignore
        const response = await driver.updateDriverByID(dataInitial.id, updateDriverData)
        setOpenModal(false)
        if (response.error) {
            setMessage("Cập nhật tài xế thất bại.");
            setOpenError(true);
        } else {
            dataInitial.driverAddress = data.driverAddress;
            dataInitial.driverName = data.driverName;
            dataInitial.driverNumber = data.driverNumber;
            if (files.length != 0) {
                const uploadedFilesUrls = files.map(file => URL.createObjectURL(file));
                setData(prevData => ({ ...prevData, driverLicense: uploadedFilesUrls }));
            }
            setMessage("Cập nhật tài xế thành công.");
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
            {openNoti && <NotiPopup message={
                <div className="mt-6">
                    {routes.length > 0 ? (
                        <CustomTimeline data={routes} />
                    ) : (
                        <p>Người này không có lịch sử lái xe.</p>
                    )}
                </div>} onClose={() => { setOpenNoti(false) }} name="Lịch sử lái xe" />}
            {openModal && <SubmitPopup message={message} onClose={() => { setOpenModal(false); }} submit={handleChangeData} />}
            {openMap && <MapPopup onClose={() => { setOpenMap(false) }} dataInitial={data.driverAddress} setData={setData} data={data} />}
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
                        Thông tin tài xế
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
                        {!isEditing ?
                            <div className="flex">
                                <div className="w-1/2 font-bold text-base">
                                    Tên tài xế:
                                </div>
                                <div>{data.driverName}</div>
                            </div>
                            :
                            <InputWithError
                                label="Tên tài xế"
                                value={data.driverName}
                                onChange={(e) => setData({ ...data, driverName: e.target.value })}
                                error={errors.driverName}
                            />
                        }
                        {!isEditing ?
                            <div className="flex">
                                <div className="w-1/2 font-bold text-base">
                                    Số điện thoại:
                                </div>
                                <div>{data.driverNumber}</div>
                            </div>
                            :
                            <InputWithError
                                label="Số điện thoại"
                                value={data.driverNumber}
                                onChange={(e) => setData({ ...data, driverNumber: e.target.value })}
                                error={errors.driverNumber}
                            />
                        }
                        {!isEditing ?
                            <div className="flex">
                                <div className="w-1/2 font-bold text-base">
                                    Địa chỉ cư trú:
                                </div>
                                <div className="w-1/2 line-clamp-3">{data.driverAddress.address}</div>
                            </div>
                            :
                            <div className="flex">
                                <div className="w-1/2 font-bold text-base">
                                    Địa chỉ cư trú:
                                </div>
                                <div className="w-1/2 flex flex-col gap-2">
                                    <div className="w-full line-clamp-3">{data.driverAddress.address}</div>
                                    <Button
                                        className="h-8 w-full rounded-md border-2 dark:border-white border-[#000000] bg-white dark:bg-navy-800"
                                        onClick={() => { setOpenMap(true) }}
                                    >
                                        Chọn
                                    </Button>
                                </div>
                            </div>
                        }
                        <div className="flex lg:pb-4">
                            <div className="w-1/2 font-bold text-base">
                                Trạng thái:
                            </div>
                            <div>{data.driverStatus == 0 ? "Sẵn sàng" : "Đang nhận đơn"}</div>
                        </div>
                        <Button
                            className="h-8 w-full flex gap-1 rounded-md border-2 dark:border-white border-[#000000] bg-white dark:bg-navy-800"
                            onClick={() => { setOpenNoti(true) }}
                        >
                            Lịch sử lái xe
                            <MdHistory />
                        </Button>
                    </div>

                    <div className="flex flex-col lg:w-1/2 relative dark:bg-navy-900 bg-white rounded-xl p-4 pt-2 mt-6 lg:mt-0 h-full">
                        <span className="w-full text-center font-bold text-lg pb-2">
                            Ảnh giấy phép lái xe
                        </span>
                        {isEditing ?
                            <>
                                <Dropzone files={files} setFiles={setFiles} className={`${files.length == 0 ? "h-full" : "h-32 px-3"}  flex justify-center place-items-center mt-1`} />
                            </>
                            :
                            <div className="relative grow">
                                <CarouselSlider urls={data.driverLicense} />
                            </div>
                        }

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
                            <span >
                                Lưu
                            </span>
                        </Button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AddPopup;
