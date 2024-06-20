"use client";
import Image from "next/image";
import { Fragment, useState } from "react";
import TriangleIcon from "@public/icon/triangle.svg";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

interface Props {
  label: string;
  data: Map<string, string>;
}
const Filter = ({ data, label }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const defaultLabel = searchParams.get(`${label}`);

  const [isActive, setIsActive] = useState(false);

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(`${label}`, value);
    } else {
      params.delete(`${label}`, value);
    }
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <Fragment>
      {/* <div className={`${isActive ? 'active' : ''}  bg-graycustom2 relative dropdown text-sm w-full rounded border-solid border outline-none  border-graycustom`}>
                <div className="dropdown-label pt-1">
                    <div onClick={() => setIsActive(!isActive)} className=" flex justify-between cursor-pointer pb-1  px-3 border-graycustom border-b">
                        <span className="uppercase">
                            {defaultLabel? defaultLabel : label}
                        </span>
                        <Image className="rotate-180" src={TriangleIcon} width={10} height={10} alt={"search icon"} />
                    </div>
                </div>
                <div className="dropdown-content">
                    <ul>
                        {Array.from(data).map(([key, value]) => (
                            <li onClick={() => handleChange(value)} key={key} className="dropdown-item cursor-pointer px-3 py-1">
                                {value}
                            </li>
                        ))}

                    </ul>
                </div>
            </div> */}
      <select
        onChange={(e) => handleChange(e.target.value)}
        className="border rounded p-2 pr-8 w-32 cursor-pointer"
        style={{ appearance: "none" }}>
        {Array.from(data).map(([key, value]) => (
          <option
            className="dropdown-item cursor-pointer px-3 py-1"
            key={key}
            value={value}>
            {value}
          </option>
        ))}
      </select>
      <FilterAltIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
    </Fragment>
  );
};
export default Filter;
