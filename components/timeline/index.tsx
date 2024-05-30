import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
    timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';
import { Route } from '@/library/libraryType/type';

const CustomTimeline = ({ data }: { data: Route[] }) => {

    if (!Array.isArray(data)) {
        console.error('Dữ liệu không phải là một mảng');
        return null;
    }
    const sortedData = [...data].reverse();
    console.log(sortedData)

    return (
        <Timeline
            sx={{
                [`& .${timelineOppositeContentClasses.root}`]: {
                    flex: 0.2,
                },
            }}
        >
            {sortedData.map((item, index) => {
                const { beginDate, endDate, driverName, carType, begin, end, carLicensePlate } = item;
                const startDateObj = new Date(beginDate);
                const endDateObj = endDate ? new Date(endDate) : null;

                return (
                    <TimelineItem key={index} className='min-w-[500px]'>
                        <TimelineOppositeContent>
                            <p className={`p-2 flex flex-col place-items-end sm:gap-2 mb-4 ${index === 0 ? 'font-bold text-black dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                                <span className="date whitespace-nowrap">{startDateObj.toLocaleDateString()} - {endDateObj?.toLocaleDateString()}</span>
                            </p>
                        </TimelineOppositeContent>
                        <TimelineSeparator className='mt-5'>
                            {index === 0 ? <MdRadioButtonChecked className='mb-2 text-blue-500 w-4 h-4' /> : <MdRadioButtonUnchecked className='mb-2 w-3.5 h-3.5 text-gray-400' />}
                            {index < sortedData.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>

                        <TimelineContent>
                            <p className={`border rounded p-2 flex flex-col mb-4  ${index === 0 ? 'font-medium text-black dark:text-white shadow-md' : 'text-gray-400 dark:text-gray-500 shadow'}`}>
                                {`Tài xế ${driverName} lái xe ${carType == "Bus" ? "buýt" : carType == "Truck" ? "tải" : "container"} từ ${begin.address.split(',')[0]}, ${begin.address.split(',')[1]}`} đến {`${end.address.split(',')[0]}, ${end.address.split(',')[1]}`}
                                <br />
                            </p>
                        </TimelineContent>
                    </TimelineItem>
                );
            })}
        </Timeline>
    );
};

export default CustomTimeline;
