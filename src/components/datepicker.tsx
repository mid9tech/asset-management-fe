"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { FC, Fragment } from "react";
import SearchIcon from "@public/icon/search.svg";
import Image from "next/image";

interface Props {
  label: string;
}

const DatePicker = ({ label }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set(`${label}`, term);
    } else {
      params.delete(`${label}`);
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);
  return (
    <Fragment>
      <div className="relative w-52 h-full">
        <input
          id=""
          defaultValue={searchParams.get(`${label}`)?.toString()}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          type="date"
          className="w-full pr-9 rounded border-solid border outline-none py-1 border-graycustom"
        />
      </div>
    </Fragment>
  );
};
export default DatePicker;
