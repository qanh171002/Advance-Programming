import React from "react";
import Card from "@/components/card";
import CardMenu from "@/components/card/CardMenu";
import Checkbox from "@/components/checkbox/index2";
import { IoPersonCircleOutline } from "react-icons/io5";
import { Button } from "@nextui-org/react";

const TaskCard = () => {
  // Mảng các công việc
  const tasks = [
    { id: 1, title: "Đặng Minh Nhật (2212387)" },
    { id: 2, title: "Mai Đình Quốc Anh (2012595)" },
    { id: 3, title: "Trần Hưng Quốc (2212841)" },
    { id: 3, title: "Đặng Trần Minh Nhật (2212388)" },
    { id: 3, title: "Nguyễn Minh Khoa (2211627)" },
    { id: 3, title: "Nguyễn Trần Hồng Ngọc (1813253)" },
  ];

  return (
    <Card className="pb-7 p-[20px]">
      {/* task header */}
      <div className="relative flex flex-row justify-between">
        <div className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-100 dark:bg-white/5">
            <IoPersonCircleOutline className="h-7 w-7 text-brand-500 dark:text-brand-300" />
          </div>
          <h4 className="ml-4 text-xl font-bold text-navy-700 dark:text-white">
            Thành viên nhóm
          </h4>
        </div>
      </div>

      {/* task content */}
      <div className="h-full w-full grid sm:grid-cols-2 mt-4 gap-1 lg:grid-cols-3">
        {tasks.map((task) => (
          <div key={task.id} className="mt-2 flex items-center justify-between p-2 gap-2">
            <div className="flex items-center justify-center gap-2">
              <p className="text-base font-bold text-navy-700 dark:text-white">{task.title}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TaskCard;
