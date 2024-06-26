"use client";
import { Fragment, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

interface Props {
  label: string;
  data: Map<string, string>;
  height?: number;
  setCurrentPage: (value: number) => void;
}

const Filter = ({ data, label, setCurrentPage, height = 150}: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleChange = (event: any, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const isChecked = event.target.checked;
    if (isChecked) {
      params.append(`${label}`, value);
      
    } else {
      console.log("value", value);
      params.delete(`${label}`, value);
    }
    setCurrentPage(1);
    replace(`${pathname}?${params.toString()}`);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  const isChecked = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const categoryParam = params.getAll(`${label}`)

    if (Array.isArray(categoryParam)) {
      return categoryParam.includes(id);
    }
  };
  const handleChangeAll = () => {
    
  }

  console.log("data from filter: ", data);
  

  return (
    <Fragment>
      <div className="relative border rounded p-2 w-48 h-full">
        <div className="flex items-center justify-between cursor-pointer" onClick={toggleDropdown} >
          <span className="font-medium text-gray-700">{label}</span>
          <FilterAltIcon className="cursor-pointer"/>
        </div>
        {dropdownVisible && (
          <div className={`absolute mt-2 bg-white border border-gray-300 rounded shadow-lg z-10 w-full -ml-2 overflow-scroll h-[${height}px]`}>
            <fieldset>
              <legend className="sr-only">{label}</legend>
              <div className="space-y-2 p-2">
              <div className="flex items-center">
                    <input
                      id=""
                      name="all"
                      type="checkbox"
                      checked={isChecked("all")} 
                      value="all"
                      onChange={(e) => handleChange(event, "all")}
                      className="h-4 w-4 text-nashtech border-gray-300 rounded bg-nashtech"
                    />
                    <label htmlFor="" className="ml-3 block text-sm text-gray-700">
                      All
                    </label>
                  </div>
                {Array.from(data).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      id={key}
                      name={key}
                      type="checkbox"
                      checked={isChecked(value)}
                      value={value}
                      onChange={(e) => handleChange(event, value)}
                      className="h-4 w-4 text-nashtech border-gray-300 rounded bg-nashtech"
                    />
                    <label htmlFor={key} className="ml-3 block text-sm text-gray-700">
                      {key}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Filter;
