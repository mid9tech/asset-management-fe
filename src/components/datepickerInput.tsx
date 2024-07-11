/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import * as React from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import CalenderIcon from "@public/icon/calender.svg";
import { formatDateCustome } from "@utils/dateFormat";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const DatePicker = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, defaultValue, onChange, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const combinedRef = ref ? (ref as React.RefObject<HTMLInputElement>) : inputRef;

    React.useEffect(() => {
      if (combinedRef.current) {
        flatpickr(combinedRef.current.id);
      }
    }, [combinedRef, defaultValue, onChange]);

    return (
      <div
        className="relative w-full h-full"
        onClick={() => combinedRef.current && combinedRef.current.focus()}
      >
        <input
          ref={combinedRef}
          {...props}
          type="text"
          onChange={onChange}
          className={`w-full h-10 rounded border-solid border outline-none px-2 py-1 ${className}`}
        />
        <button
          className="absolute top-0 p-2 h-full right-0 border-l-graycustom border-l ml-8"
          onClick={() => combinedRef.current && combinedRef.current.focus()}
          type="button"
        >
          <Image
            src={CalenderIcon}
            width={15}
            height={15}
            alt="calendar icon"
          />
        </button>
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export { DatePicker };
