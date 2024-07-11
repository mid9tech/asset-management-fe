'use client'
import { Fragment, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { formatStateText } from "@utils/formatText";
import { truncateParagraph } from "@utils/truncate";
import FilterIcon from "@public/icon/filter.svg";
import Image from "next/image";

export const defaultChoice = 'all';

interface Props {
  label: string;
  data: Map<string, string>;
  height?: number;
}
const maxLength = 30; 

const Filter = ({ data, label, height = 150 }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleChange = (event: any, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const isChecked = event.target.checked;
    params.set('page', '1');
    if (isChecked) {
      params.append(`${label}`, value);
    } else {
      params.delete(`${label}`, value);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const isChecked = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const categoryParam = params.getAll(`${label}`);

    if (Array.isArray(categoryParam)) {
      return categoryParam.includes(id);
    }
  };
  const handleClickAll = (event: any) => {
    const checked = event.target.checked;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    if (checked) {
      data.forEach((key, value) => {
        params.append(`${label}`, key);
      });
    } else {
      data.forEach((key, value) => {
        params.delete(`${label}`, key);
      });
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Fragment>
      <div className="relative w-40 h-full z-10">
        <div className="relative w-full h-full">
          <input
            type="text"
            placeholder={label}
            readOnly
            value={label}
            onClick={toggleDropdown}
            className="w-full pr-9 rounded border-solid border outline-none px-2 py-1 border-graycustom cursor-pointer"
          />
          <button
            className="absolute top-0 px-2 py-1 h-full right-0 border-l-graycustom border-l"
            onClick={toggleDropdown}
          >
            <Image src={FilterIcon} width={15} alt={""} />
          </button>
        </div>
        {dropdownVisible && (
          <div
            className={`absolute mt-2 bg-white border border-gray-300 rounded shadow-lg z-10 w-full overflow-scroll`}
            style={{ maxHeight: "350px", height: `${height === 0 ? 'auto' : height}` }}
          >
            <fieldset>
              <legend className="sr-only">{label}</legend>
              <div className="space-y-2 p-2">
                <div className="flex items-center">
                  <input
                    id={`${defaultChoice}`}
                    name={defaultChoice}
                    type="checkbox"
                     checked={Array.from(data.values()).every(value => isChecked(value))}
                    value={`${defaultChoice}`}
                    onChange={(e) => handleClickAll(e)}
                    className="input-checkbox h-4 w-4 text-nashtech rounded custom-checkbox accent-red-500"
                  />
                  <label htmlFor={defaultChoice} className="ml-3 block text-sm text-gray-700">
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
                      onChange={(e) => handleChange(e, value)}
                      className="h-4 w-4 text-nashtech focus:ring rounded bg-transparent"
                    />
                    <label htmlFor={key} className="ml-3 block text-sm text-gray-700">
                      {truncateParagraph(String(formatStateText(key)), maxLength)}
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
