import { Fragment, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { formatStateText, formatText } from "@utils/formatText";
import { truncateParagraph } from "@utils/truncate";

export const defaultChoice = 'all'
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
    params.set('page', '1')
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

  return (
    <Fragment>
      <div className="relative border border-gray rounded py-1 px-1 w-40 h-8">
        <div className="flex items-center justify-between cursor-pointer divide-x" onClick={toggleDropdown}>
          <span className="">{label}</span>
          <FilterAltIcon className="cursor-pointer" style={{height: 17}} />
        </div>
        {dropdownVisible && (
          <div className={`absolute mt-2 bg-white border border-gray-300 rounded shadow-lg z-10 w-full -ml-1 overflow-scroll`} style={{ height: height }}>
            <fieldset>
              <legend className="sr-only">{label}</legend>
              <div className="space-y-2 p-2">
                <div className="flex items-center">
                  <input
                    id={`${defaultChoice}`}
                    name={defaultChoice}
                    type="checkbox"
                    checked={isChecked(`${defaultChoice}`)}
                    value={`${defaultChoice}`}
                    onChange={(e) => handleChange(event, `${defaultChoice}`)}
                    className="input-checkbox h-4 w-4 text-nashtech rounded accent-red-500"
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
