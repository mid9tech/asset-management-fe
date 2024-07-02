/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useSearchParams } from "next/navigation";
import { FC, Fragment, useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import CalenderIcon from "@public/icon/calender.svg";
import Image from "next/image";
import { formatDateCustome } from "@utils/dateFormat";

interface Props {
  defaultValue: string;
}

const DatePickerInput: FC<Props> = ({ defaultValue }) => {
  const datePickerRef = useRef<HTMLInputElement>(null);

  const handleSelect = (date: Date | null) => {
    console.log('data: ', date);
  };

  useEffect(() => {
    if (datePickerRef.current) {
      flatpickr(datePickerRef.current, {
        dateFormat: "d-m-Y",
        defaultDate: formatDateCustome(defaultValue || "", "DMY"),
        onChange: (selectedDates) => {
          handleSelect(selectedDates[0]);
        },
      });
    }
  }, [handleSelect, defaultValue]);

  return (
    <Fragment>
      <div className="relative w-full h-full" onClick={() => datePickerRef.current && datePickerRef.current.focus()}>
        <input
          ref={datePickerRef}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button className="absolute top-0 p-2 h-full right-0 border-l-graycustom border-l ml-8" onClick={() => datePickerRef.current && datePickerRef.current.focus()}>
          <Image
            src={CalenderIcon}
            width={15}
            height={15}
            alt={"calendar icon"}
          />
        </button>
      </div>
    </Fragment>
  );
};

export default DatePickerInput;
