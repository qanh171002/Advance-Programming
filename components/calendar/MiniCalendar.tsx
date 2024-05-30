'use client'

import { useState } from "react";
import Calendar from "react-calendar";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import Card from "@/components/card";
import NotiPopup from "../notification";

const MiniCalendar = ({ value, onChange }: any) => {

  const [openError, setOpenError] = useState(false);
  const [message, setMessage] = useState("");
  const handleDateChange = (date: any) => {
    if (new Date(date) < new Date()) {
      setMessage("Vui lòng chọn ngày lớn hơn ngày hiện tại.")
      setOpenError(true);
      return;
    }
    onChange(date);
  };

  return (
    <div className="grow">
      {openError && <NotiPopup message={message} onClose={() => { setOpenError(false); }} />}

      <Card className="flex w-full h-full flex-col px-3 py-3 items-center">
        <Calendar
          onChange={handleDateChange}
          value={value}
          prevLabel={<MdChevronLeft className="ml-1 h-6 w-6 " />}
          nextLabel={<MdChevronRight className="ml-1 h-6 w-6 " />}
          view={"month"}
        />
      </Card>
    </div>
  );
};

export default MiniCalendar;
