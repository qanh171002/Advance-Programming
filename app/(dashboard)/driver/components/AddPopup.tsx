"use client"
import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { Button } from "@nextui-org/react";
import Dropzone from "./Dropzone";
import axios from "axios";
import InputWithError from "./Input";
import { Address, Driver } from "@/library/libraryType/type";
import { DriverOperation } from "@/library/driver";
import SubmitPopup from "@/components/submit";
import NotiPopup from "@/components/notification";
import { getCoordinates } from "@/app/components/GetCoordinates";

interface City {
    Id: string;
    Name: string;
    Districts: District[];
}

interface District {
    Id: string;
    Name: string;
    Wards: Ward[];
}

interface Ward {
    Id: string;
    Name: string;
}

interface AddPopupProps {
    onClose: () => void;
    reloadData: () => void;
}

const AddPopup: React.FC<AddPopupProps> = ({ onClose, reloadData }) => {
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [files, setFiles] = useState<Blob[]>([]);
    const driver = new DriverOperation();
    const [address, setAddress] = useState<Address>({
        latitude: 0,
        longitude: 0,
        address: ""
    })
    const [data, setData] = useState<Driver>({
        driverName: "",
        driverNumber: "",
        driverAddress: address,
        driverStatus: 0,
        driverLicense: []
    });

    const [errors, setErrors] = useState({
        driverName: "",
        driverNumber: "",
        address: "",
        status: "",
        license: "",
        district: "",
        city: "",
        ward: ""
    });

    const [cities, setCities] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [selectedCity2, setSelectedCity2] = useState("");
    const [selectedDistrict2, setSelectedDistrict2] = useState("");
    const [selectedWard2, setSelectedWard2] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [message, setMessage] = useState("");

    const validatePhoneNumber = (phone: string) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const handleSubmitClick = () => {
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

        if (address.address.trim() === "") {
            tempErrors.address = "Địa chỉ không được bỏ trống.";
            hasError = true;
        } else {
            tempErrors.address = "";
        }

        if (files.length === 0) {
            tempErrors.license = "Thiếu giấy phép lái xe.";
            hasError = true;
        } else {
            tempErrors.license = "";
        }

        if (selectedCity === "") {
            tempErrors.city = "Vui lòng chọn tỉnh thành.";
            hasError = true;
        } else {
            tempErrors.city = "";
        }

        if (selectedDistrict === "") {
            tempErrors.district = "Vui lòng chọn quận/huyện.";
            hasError = true;
        } else {
            tempErrors.district = "";
        }

        if (selectedWard === "") {
            tempErrors.ward = "Vui lòng chọn phường/xã.";
            hasError = true;
        } else {
            tempErrors.ward = "";
        }

        if (hasError) {
            setErrors(tempErrors);
        } else {
            setErrors({
                driverName: "",
                driverNumber: "",
                address: "",
                status: "",
                license: "",
                city: "",
                district: "",
                ward: ""
            });
            setMessage("Xác nhận tạo tài xế?")
            setOpenModal(true)
        }
    };

    useEffect(() => {
        const fetchCities = async () => {
            const response = await axios.get(
                "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
            );
            setCities(response.data);
        };

        fetchCities();
    }, []);

    const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCity(event.target.value);
        const city = cities.find((city) => city.Id === event.target.value)?.Name;
        //@ts-ignore
        setSelectedCity2(city);
        setSelectedDistrict("");
        setSelectedDistrict2("");
    };

    const handleDistrictChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedDistrict(event.target.value);
        const district = districts.find((district) => district.Id === event.target.value)?.Name;
        //@ts-ignore
        setSelectedDistrict2(district);
        setSelectedWard("");
        setSelectedWard2("");
    };

    const handleWardChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedWard(event.target.value);
        const ward = wards.find((ward) => ward.Id === event.target.value)?.Name;
        //@ts-ignore
        setSelectedWard2(ward);
    };

    const selectedCityObj = cities.find((city) => city.Id === selectedCity);
    const districts = selectedCityObj ? selectedCityObj.Districts : [];
    const selectedDistrictObj = districts.find(
        (district) => district.Id === selectedDistrict
    );
    const wards = selectedDistrictObj ? selectedDistrictObj.Wards : [];

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleAddNewDriver = async () => {
        const { lat, lng } = await getCoordinates(`${address.address}, ${selectedWard2}, ${selectedDistrict2}, ${selectedCity2}`)
        const sendData: Driver = {
            driverName: data.driverName,
            driverNumber: data.driverNumber,
            driverAddress: { latitude: lat, longitude: lng, address: `${address.address}, ${selectedWard2}, ${selectedDistrict2}, ${selectedCity2}` },
            driverStatus: data.driverStatus,
            driverLicense: files
        };
        const response = await driver.createDriver(sendData);
        setOpenModal(false)
        if (response.error) {
            setMessage("Đã có lỗi khi tạo mới tài xế.");
            setOpenError(true);
        } else {
            setMessage("Đã tạo mới tài xế thành công!");
            setOpenError(true)
        }
    }

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
            {openError && <NotiPopup message={message} onClose={() => { setOpenError(false); handleClose(); reloadData(); }} />}
            {openModal && <SubmitPopup message={message} onClose={() => { setOpenModal(false); }} submit={handleAddNewDriver} />}
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
                        Thêm tài xế
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
                        <InputWithError
                            label="Tên tài xế"
                            value={data.driverName}
                            onChange={(e) => setData({ ...data, driverName: e.target.value })}
                            error={errors.driverName}
                        />
                        <InputWithError
                            label="Số điện thoại"
                            value={data.driverNumber}
                            onChange={(e) => setData({ ...data, driverNumber: e.target.value })}
                            error={errors.driverNumber}
                        />
                        <InputWithError
                            label="Địa chỉ cư trú"
                            value={address.address}
                            onChange={(e) => setAddress({ ...address, address: e.target.value })}
                            error={errors.address}
                        />
                        <div className={`flex ${errors.city ? "-mb-3" : ""}`}>
                            <div className="w-1/2 font-bold text-base">
                                Tỉnh thành:
                            </div>
                            <div className="relative w-1/2 flex flex-col gap-2">
                                <select
                                    className={`w-full dark:text-[#000000] pl-2 rounded ${errors.city ? "border-2 border-red-500" : ""}`}
                                    id="city"
                                    aria-label=".form-select-sm"
                                    value={selectedCity}
                                    onChange={handleCityChange}
                                >
                                    <option value="">Chọn tỉnh thành</option>
                                    {cities.map((city) => (
                                        <option key={city.Id} value={city.Id}>
                                            {city.Name}
                                        </option>
                                    ))}
                                </select>
                                {errors.city && <div className="text-red-500">{errors.city}</div>}
                            </div>
                        </div>
                        <div className={`flex ${errors.district ? "-mb-3" : ""}`}>
                            <div className="w-1/2 font-bold text-base">
                                Quận/Huyện:
                            </div>
                            <div className="relative w-1/2 flex flex-col gap-2">
                                <select
                                    className={`w-full dark:text-[#000000] pl-2 rounded ${errors.district ? "border-2 border-red-500" : ""}`}
                                    id="district"
                                    aria-label=".form-select-sm"
                                    value={selectedDistrict}
                                    onChange={handleDistrictChange}
                                >
                                    <option value="">Chọn quận huyện</option>
                                    {districts.map((district) => (
                                        <option key={district.Id} value={district.Id}>
                                            {district.Name}
                                        </option>
                                    ))}
                                </select>
                                {errors.district && <div className="text-red-500">{errors.district}</div>}
                            </div>
                        </div>
                        <div className={`flex ${errors.ward ? "-mb-3" : ""}`}>
                            <div className="w-1/2 font-bold text-base">
                                Phường/Xã:
                            </div>
                            <div className="relative w-1/2 flex flex-col gap-2">
                                <select
                                    className={`w-full dark:text-[#000000] pl-2 rounded ${errors.ward ? "border-2 border-red-500" : ""}`}
                                    aria-label=".form-select-sm"
                                    id="ward"
                                    value={selectedWard}
                                    onChange={handleWardChange}
                                >
                                    <option value="">Chọn phường xã</option>
                                    {wards.map((ward) => (
                                        <option key={ward.Id} value={ward.Id}>
                                            {ward.Name}
                                        </option>
                                    ))}
                                </select>
                                {errors.ward && <div className="text-red-500">{errors.ward}</div>}

                            </div>
                        </div>
                        <div className="flex lg:pb-4">
                            <div className="w-1/2 font-bold text-base">
                                Trạng thái:
                            </div>
                            <select
                                className="w-1/2 dark:text-[#000000] px-2 rounded"
                                value={data.driverStatus}
                                onChange={(e) => setData({ ...data, driverStatus: parseInt(e.target.value) })}
                            >
                                <option value={0}>Sẵn sàng</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col lg:w-1/2 relative dark:bg-navy-900 bg-white rounded-xl p-4 pt-2 mt-6 lg:mt-0 h-full">
                        <span className="w-full text-center font-bold text-lg pb-2">
                            Thêm giấy phép lái xe
                        </span>
                        {errors.license && <div className="text-red-500 absolute w-full text-center mt-12 -ml-4 px-6">{errors.license}</div>}

                        <Dropzone files={files} setFiles={setFiles} className={`${files.length == 0 ? "h-full" : "h-32 px-3"}  flex justify-center place-items-center mt-1`} />
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
