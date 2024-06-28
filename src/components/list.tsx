import React, { Fragment, ReactNode } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CreateIcon from "@mui/icons-material/Create";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ReplayIcon from "@mui/icons-material/Replay";
import { SORT_ORDER } from "../types/enum.type";
import { truncateParagraph } from "@utils/truncate";

type Column<T> = {
  header: string;
  accessor: keyof T;
  width?: number; // Optional width property for columns
};

interface ReusableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick: (item: T) => void;
  onDeleteClick?: (item: T) => void;
  onEditClick?: (item: T) => void;
  onReturnClick?: (item: T) => void;
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
  onReturnClick,
  onSortClick = () => {},
  sortBy,
  sortOrder,
}: ReusableTableProps<T>) => {
  console.log('onDeleteClick', onDeleteClick);
  return (
    <div>
      <div className="bg-white h-auto">
        <div>
          <div className="mt-5">
            <table className="w-full table-fixed">
              {" "}
              {/* Add table-fixed class */}
              <thead>
                <tr className="flex flex-row gap-3">
                  {columns.map((item, key) => (
                    <Fragment key={key}>
                      {item.header !== "icon" ? (
                        <th
                          className="border-b-2 border-black cursor-pointer text-sm flex items-start"
                          style={{ width: item.width || "auto" }} // Set column width
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
                        </th>
                      ) : (
                        <th style={{ width: item.width || "auto" }}></th> // Set column width
                      )}
                    </Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.map((item, key) => (
                  <tr
                    key={key}
                    className="flex flex-row gap-3 w-fit cursor-pointer mt-1 h-full"
                    onClick={() => onRowClick(item)}>
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        style={{ width: column.width || "auto" }}
                        className={`text-sm h-full ${
                          column.header === "icon"
                            ? ""
                            : "border-b-2 border-graycustom"
                        } flex justify-start items-start h-full`}>
                        {column.header !== "icon" ? (
                          column.accessor !== "id" ? (
                            (truncateParagraph(item[column.accessor] as ReactNode as string, 25))
                          ) : (
                            key + 1
                          )
                        ) : (
                          <div className="flex justify-between items-start h-full">
                            {onEditClick && (
                              <CreateIcon
                                className="text-gray-500 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditClick(item);
                                }}
                              />
                            )}

                            {onDeleteClick && (
                              <HighlightOffIcon
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteClick(item);
                                }}
                                sx={{ color: "#cf2338" }}
                                className="cursor-pointer"
                              />
                            )}
                            {onReturnClick && (
                              <ReplayIcon
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onReturnClick(item);
                                }}
                                sx={{ color: "blue" }}
                                className="cursor-pointer"
                              />
                            )}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReusableList;
