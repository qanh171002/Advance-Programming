'use client'
import { Button } from '@nextui-org/react';
import React, { useContext, useState, useEffect } from 'react';
import { FaAngleDoubleLeft } from "react-icons/fa";
import { CollapseContext } from '../context/CollapseContext';
import SearchBox from './SearchBox';
import CarList from './CarList';
import { SourceContext } from '../context/SourceContext';
import { DistanceContext } from '../context/DistanceContext';
import { DestinationContext } from '../context/DestinationContext';
import { RouteOperation } from '@/library/route';
import Notification from '@/components/notification'
import DriverSelect from './DriverSelect';
import { Address, CreateRoute, Driver } from '@/library/libraryType/type';
import { useRouter } from 'next/navigation';
import SubmitPopup from '@/components/submit';
import { usePassDataContext } from '@/providers/PassedData';
const AddPanel = () => {
    //@ts-ignore
    const { isCollapsed, setIsCollapsed } = useContext(CollapseContext);
    //@ts-ignore
    const { source, setSource } = useContext(SourceContext);
    //@ts-ignore
    const { destination, setDestination } = useContext(DestinationContext);
    // @ts-ignore
    const { distance, setDistance } = useContext(DistanceContext);
    const { passData, setPassData } = usePassDataContext();
    const [selectedType, setSelectedType] = useState(null);
    const [task, setTask] = useState("")
    const route = new RouteOperation()
    const router = useRouter()
    const [message, setMessage] = useState("")
    const [openError, setOpenError] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [openModal2, setOpenModal2] = useState(false)
    const [selectedDriver, setSelectedDriver] = useState<Driver>()
    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleCreateClick = () => {
        let errorMessage = "";

        if (task === "" && !selectedType && !distance) {
            errorMessage = "Vui lòng tìm kiếm tuyến đường, chọn loại xe và nhập nội dung công việc";
        } else if (task === "" && !selectedType) {
            errorMessage = "Vui lòng tìm kiếm tuyến đường và chọn loại xe";
        } else if (task === "" && !distance) {
            errorMessage = "Vui lòng tìm kiếm tuyến đường và nhập nội dung công việc";
        } else if (!selectedType && !distance) {
            errorMessage = "Vui lòng tìm kiếm tuyến đường và chọn loại xe";
        } else if (task === "") {
            errorMessage = "Vui lòng nhập nội dung công việc";
        } else if (!selectedType) {
            errorMessage = "Vui lòng chọn loại xe";
        } else if (!distance) {
            errorMessage = "Vui lòng tìm kiếm tuyến đường";
        }

        if (errorMessage) {
            setMessage(errorMessage);
            setOpenError(true);
        } else {
            setOpenModal(true)
        }
    };

    const handleCreateRoute = async () => {
        if (selectedDriver && selectedType) {
            const begin: Address = {
                latitude: source.lat,
                longitude: source.lng,
                address: source.name
            }
            const end: Address = {
                latitude: destination.lat,
                longitude: destination.lng,
                address: destination.name
            }
            const routeInfo: CreateRoute = {
                begin: begin,
                end: end,
                distance: distance,
                beginDate: new Date(),
                driver: selectedDriver,
                task: task,
                typeCar: selectedType
            }
            const response = await route.CreateRoute(routeInfo)
            setOpenModal(false)
            if (response.error) {
                setMessage("Đã có lỗi xảy ra khi tạo mới.")
                setOpenError(true);
            }
            else if (typeof response.data == "string") {
                setMessage(response.data)
                setOpenError(true)
            }
            else {
                setMessage("Tạo mới lộ trình thành công")
                setOpenModal2(true)
                setPassData(response.data.id)
            }
        }

    };

    useEffect(() => {
        setIsCollapsed(false);
        return () => {
            setIsCollapsed(true);
            setDestination(null);
            setSource(null)
            setDistance(null)
        };
    }, []);

    return (
        <div className={`relative ${isCollapsed ? 'w-full h-8 sm:w-8 sm:h-full' : ' w-full h-[calc(100dvh-208px)] md:h-[calc(100dvh-126px)] sm:w-2/3 md:w-[550px]'} sticky z-[45] transition-all duration-500 ease-in-out`}>
            {openError && <Notification onClose={() => setOpenError(false)} message={message} />}
            {openModal2 && <SubmitPopup onClose={() => { setPassData(""); setOpenModal2(false); }} message={message} submit={() => { setOpenModal2(false); router.push("/route") }} name='Đến xem' />}
            {openModal && <DriverSelect onClose={() => setOpenModal(false)} submit={handleCreateRoute} selectedDriver={selectedDriver} setSelectedDriver={setSelectedDriver} />}
            <div className={`border-8 border-white dark:border-navy-900 shadow-xl shadow-shadow-500 dark:shadow-none rounded-xl sm:rounded-tr-none sm:rounded-l-xl transition-all duration-500 ${isCollapsed ? 'opacity-0 h-8' : 'opacity-100 h-[calc(100dvh-208px)] md:h-[calc(100dvh-126px)]'}`} style={{ transitionDelay: isCollapsed ? '0ms' : '200ms' }}>
                <div className={`bg-white/10 backdrop-blur-sm dark:bg-[#0b14374d] h-full transition-opacity rounded-[4px] sm:rounded-tr-none sm:rounded-l-[4px] duration-200 border-b-2 dark:border-b border-white/10 dark:border-white/30 flex flex-col overflow-y-scroll no-scrollbar ${isCollapsed ? 'opacity-0' : 'opacity-100'}`} style={{ transitionDelay: isCollapsed ? '0ms' : '400ms' }}>
                    <SearchBox />
                    <CarList selectedType={selectedType} setSelectedType={setSelectedType} />
                    <div className="flex flex-col w-full gap-2 px-2 pb-2 mb-14">
                        <div className="flex flex-col w-full gap-2 p-4 bg-white dark:bg-navy-900 rounded-xl shadow">
                            <h1 className="text-xl w-full text-center font-bold text-gray-700 dark:text-gray-300 text-nowrap cursor-default pb-1">
                                Chú thích công việc
                            </h1>
                            <textarea
                                cols={30}
                                rows={10}
                                id="taskInput"
                                defaultValue={task}
                                onChange={(e) => setTask(e.target.value)}
                                className="w-full p-2 border border-gray-200 dark:border-gray-300 rounded-md min-h-[200px] focus:outline-none focus:border-blue-500 text-left bg-white dark:bg-navy-900 text-black dark:text-gray-300"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Button
                className={`absolute bottom-2 h-12 text-white bg-blue-500 w-[calc(100%-16px)] mx-2 dark:bg-[#032B91]
                hover:cursor-pointer rounded-md flex outline-8 outline-white dark:outline-navy-900 transition-all duration-400 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}
                onClick={handleCreateClick}
                style={{ transitionDelay: isCollapsed ? '0ms' : '400ms', outlineOffset: '-1px' }}
            >
                Xác nhận tạo lộ trình
            </Button>
            <Button
                className={`absolute -bottom-3 sm:top-[20.3px] dark:text-white text-gray-400
                hover:cursor-pointer rounded-full flex focus:outline-none transition-all duration-500
                ${isCollapsed ? 'transform -translate-y-1/2 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-0 shadow h-8 w-8 bg-white dark:bg-navy-900' :
                        'transform right-1/2 translate-x-1/2 sm:-translate-y-[calc(50%)] sm:translate-x-0 bottom-12 sm:border-none h-8 w-8 sm:-right-5 sm:w-14 sm:h-10 sm:justify-end'}`}
                onClick={handleToggleCollapse}
            >
                <div className='absolute w-full top-0 h-1/3 bg-white dark:bg-navy-900 sm:hidden'></div>

                <FaAngleDoubleLeft className={`transition-transform duration-500 bg-white dark:text-gray-300 dark:bg-navy-900 h-10  ${isCollapsed ? "-rotate-90 sm:rotate-180" : "rotate-90 sm:rotate-0 mb-2 sm:mb-0 sm:pr-2 sm:pl-1 sm:w-[45%]"}`} />
            </Button>
        </div >
    );
}

export default AddPanel;