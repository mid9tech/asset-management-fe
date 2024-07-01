/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { FC, Fragment, useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import CalenderIcon from "@public/icon/calender.svg";
import Image from "next/image";

interface Props {
  label: string;
  name: string;
}

const DatePicker: FC<Props> = ({ label, name }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const datePickerRef = useRef<HTMLInputElement>(null);

  const formatDateCustome = (dateString: string, format: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    if (format === "DMY") {
      return `${day}-${month}-${year}`;
    } else if (format === "YMD") {
      return `${year}-${month}-${day}`;
    } else if (format === "ISO") {
      return new Date(date).toLocaleDateString('pt-br').split( '/' ).reverse( ).join( '-' ); // Returns yyyy-mm-dd
    }
    return dateString;
  };

  const handleSearch = useDebouncedCallback((date: Date | Date[]) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (date && date instanceof Date) {
      params.set(name, formatDateCustome(date.toISOString(), "ISO"));
    } else {
      params.delete(name);
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  useEffect(() => {
    if (datePickerRef.current) {
      flatpickr(datePickerRef.current, {
        dateFormat: "d-m-Y",
        defaultDate: formatDateCustome(searchParams.get(name) || "", "DMY"),
        onChange: (selectedDates) => {
          handleSearch(selectedDates[0]);
        },
      });
    }
  }, [handleSearch, searchParams]);

  return (
    <Fragment>
      <div className="relative w-52 h-full" onClick={() => datePickerRef.current && datePickerRef.current.focus()}>
        <input
          ref={datePickerRef}
          placeholder={label}
          className="w-full pr-9 rounded border-solid border outline-none px-2 py-1 border-graycustom"
        />
        <button className="absolute top-0 p-2 h-full right-0 border-l-graycustom border-l">
          <Image
            src={CalenderIcon}
            width={15}
            height={15}
            alt={"search icon"}
          />
        </button>
      </div>
    </Fragment>
  );
};

export default DatePicker;
