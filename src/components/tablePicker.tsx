"use client";
import React, { Fragment } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { SORT_ORDER } from "../types/enum.type";

type Column = {
  header: string;
  accessor: string;
  width?: string; // Optional width property for columns
  sortField?: string;
};

interface ReusableTableProps<T> {
  columns: Column[];
  data: any[];
  onRowClick: (item: T) => void;
  onSortClick?: (item: string) => void;
  selected: any;
  sortBy: string;
  sortOrder: string;
  fontSize?: number;
}

const TablePickerComponent = <T extends {}>({
  columns,
  data,
  onRowClick,
  onSortClick = () => {},
  selected,
  sortBy,
  sortOrder,
  fontSize,
}: ReusableTableProps<T>) => {
  // get nested value of accessor
  // for example: accessor == category.categoryName ?? column will go through category obj to get category name and display it
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const genSortField = (sortField: string) => {
    return sortBy === sortField && sortOrder === SORT_ORDER.ASC ? (
      <ArrowDropUpIcon />
    ) : (
      <ArrowDropDownIcon />
    );
  };

  const handleSortClick = (sortField: string | undefined) => {
    if (sortField) return onSortClick(sortField);
    else return null;
  };

  return (
    <>
      <div>
        <div className="bg-white h-auto">
          <table className="w-full table-fixed">
            {" "}
            {/* Add table-fixed class */}
            <thead>
              <tr className="flex flex-row gap-3">
                {columns.map((item, key) => (
                  <Fragment key={key}>
                    {item.header !== "radio" ? (
                      <th
                        className="border-b-2 border-black cursor-pointer text-sm flex items-start"
                        style={{
                          minWidth: item.width || "auto",
                          maxWidth: item.width,
                          fontSize: fontSize || 15,
                        }} // Set column width
                        onClick={() => handleSortClick(item.sortField)}>
                        <span className="font-bold">
                          {item.header}
                          {item.sortField && genSortField(item.sortField)}
                        </span>
                      </th>
                    ) : (
                      <th
                        style={{
                          minWidth: item.width || "auto",
                          maxWidth: item.width,
                          fontSize: fontSize || 15,
                        }}></th> // Set column width
                    )}
                  </Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.map((item, key) => (
                <tr
                  key={key}
                  className={`flex flex-row gap-3 cursor-pointer mt-1 h-full ${
                    item.isReadyAssigned == false
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}>
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      onClick={
                        item.isReadyAssigned == false
                          ? () => {}
                          : () => onRowClick(item)
                      }
                      style={{
                        minWidth: column.width || "auto",
                        maxWidth: column.width,
                      }}
                      className={`text-sm h-full min-h-8 truncate ${
                        column.header === "radio"
                          ? ""
                          : "border-b-2 border-graycustom"
                      } flex justify-start items-center h-full`}>
                      {column.header !== "radio" ? (
                        <div className="text-ellipsis overflow-hidden">
                          {getNestedValue(item, column.accessor) as string}
                        </div>
                      ) : (
                        <div className="flex">
                          <label className="custom-radio">
                            <input
                              type="radio"
                              disabled={item.isReadyAssigned == false}
                              checked={selected?.id == item.id}
                              onChange={
                                item.isReadyAssigned == false
                                  ? () => {}
                                  : () => onRowClick(item)
                              }
                            />
                            <span className="checkmark"></span>
                          </label>
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
    </>
  );
};

export default TablePickerComponent;
