import React, { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CreateIcon from "@mui/icons-material/Create";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ReplayIcon from '@mui/icons-material/Replay';
import { SORT_ORDER } from "../types/enum.type";

type Column<T> = {
  header: string;
  accessor: keyof T;
};

interface ReusableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick: (item: T) => void;
  onDeleteClick?: (item: T) => void;
  onEditClick?: (item: T) => void;
  onSortClick?: (item: string) => void;
  sortBy: string;
  sortOrder: string;
}

const ReusableList = <T extends {}>({
  columns,
  data,
  onRowClick,
  onDeleteClick,
  onEditClick,
  onSortClick = () => {},
  sortBy,
  sortOrder,
}: ReusableTableProps<T>) => {
  return (
    <div>
      <div className="bg-white h-auto">
        <div>
          <div className="mt-5">
            <div className={`grid grid-cols-${columns.length} gap-4`}>
              {columns.map((item, key) => (
                <>
                  {item.header !== "icon" ? (
                    <div
                      key={key}
                      className="col border-b-2 border-black cursor-pointer text-sm"
                      onClick={() => onSortClick(item.accessor as string)}>
                      <span className="font-bold">
                        {item.header}
                        {sortBy === item.accessor &&
                        sortOrder === SORT_ORDER.ASC ? (
                          <ArrowDropUpIcon />
                        ) : (
                          <ArrowDropDownIcon />
                        )}
                      </span>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ))}
            </div>
            <div className={`grid grid-rows-${data?.length} grid-col gap-1`}>
              {data?.map((item, key) => (
                <>
                  <div
                    key={key}
                    className={"grid grid-cols-8 gap-4 cursor-pointer"} // Need to
                    onClick={() => onRowClick(item)}>
                    {columns.map((column, colIndex) => (
                      <div key={colIndex}>
                        {column.header !== "icon" ? (
                          <div className="border-b-2 text-sm border-graycustom flex justify-start items-center h-full">
                            {column.accessor !== "id"
                              ? (item[column.accessor] as ReactNode)
                              : key + 1}
                          </div>
                        ) : (
                          <div className="flex justify-between items-center h-full">
                            <CreateIcon className="text-gray-500 cursor-pointer" />
                            <HighlightOffIcon
                              sx={{ color: "#cf2338" }}
                              className="cursor-pointer"
                            />
                            <ReplayIcon
                              sx={{ color: "blue" }}
                              className="cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReusableList;
