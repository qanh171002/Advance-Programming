import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import Image from 'next/image'
import { TbChevronsLeft, TbChevronsRight } from "react-icons/tb";
import { Button } from "@nextui-org/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";
import ImageView from "../image";
export function CarouselSlider(ObjUrls: any) {
    const [urlState, setUrlState] = useState<string>("")
    const [openModal, setIsOpenModal] = useState(false)
    const handleOpenImgClick = (url: any) => {
        setUrlState(url);
        setIsOpenModal(true);
    };
    const CustomDot = ({ onMove, index, onClick, active }: any) => {
        return (
            <div className="h-full pb-[12px] flex justify-between">
                <div
                    className="dark:text-white text-[#000000]"
                    onClick={() => onClick()}
                >
                    {active ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
                </div>
            </div>
        );
    };

    const CustomButtonGroup = ({ next, previous }: any) => {
        return (
            <div className="w-full h-10 mt-2 flex justify-between">
                <Button className="left" type="button" onClick={() => previous()}>
                    <FiChevronLeft className="h-full w-6 text-[#000000] dark:text-white" />
                </Button>
                <Button className="right" type="button" onClick={() => next()}>
                    <FiChevronRight className="h-full w-6 text-[#000000] dark:text-white" />
                </Button>
            </div>
        );
    };
    return <div className="h-full w-full">
        {openModal && <ImageView url={urlState} onClose={() => setIsOpenModal(false)} />}
        <Carousel
            additionalTransfrom={0} draggable keyBoardControl
            autoPlay showDots={true}
            autoPlaySpeed={3000}
            shouldResetAutoplay={true}
            swipeable minimumTouchDrag={80} pauseOnHover
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside={true}
            renderDotsOutside={true}
            customDot={<CustomDot />}
            customButtonGroup={<CustomButtonGroup />}
            responsive={{
                res1: { breakpoint: { max: 40000, min: 0 }, items: 1, partialVisibilityGutter: 0 },
            }}
            containerClass="w-full h-60 rounded-2xl mt-2 outline outline-[1px] outline-gray-300 bg-white dark:bg-navy-800"
            rewind={true}
            rewindWithAnimation={true}
            arrows={false}
            transitionDuration={1000}
            dotListClass="flex justify-between gap-1"
        >

            {ObjUrls.urls.length != 0 ? ObjUrls.urls.map((url: any, index: any) => (
                <div key={index} className='rounded-t-xl px-2'>
                    <Image
                        onClick={() => handleOpenImgClick(url)}
                        src={url}
                        alt={`Order Image ${index}`}
                        width={10000}
                        height={10000}
                        className='w-full h-52 rounded-md object-contain'
                    />
                </div>
            )) : (
                <div className="flex justify-center text-center">
                    <p>Chưa có ảnh</p>
                </div>
            )}
        </Carousel>
    </div>
}
