"use client";
import Image from "next/image";
import { Fragment, useState } from "react";
import TriangleIcon from "@public/icon/triangle.svg";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

interface Props {
  label: string;
  data: Map<string, string>;
  setCurrentPage: (value: number) => void;
}
const Filter = ({ data, label, setCurrentPage }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(`${label}`, value);
    } else {
      params.delete(`${label}`, value);
    }
    setCurrentPage(1);
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <Fragment>
      <select
        onChange={(e) => handleChange(e.target.value)}
        className="border rounded p-2 pr-8 w-32 cursor-pointer h-full"
        defaultValue={undefined}
        style={{ appearance: "none" }}>
        {Array.from(data).map(([key, value]) => (
          <option
            className="dropdown-item cursor-pointer px-3 py-1"
            key={key}
            value={value}>
            {key}
          </option>
        ))}
      </select>
      <FilterAltIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-10" />
    </Fragment>
  );
};
export default Filter;
