"use client";
import React, { Fragment, ReactNode, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CreateIcon from "@mui/icons-material/Create";
import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ReplayIcon from "@mui/icons-material/Replay";
import { SORT_ORDER } from "../types/enum.type";
import { Button } from "./ui/button";
import DetailModal from "./modal";
import { useMutation } from "@apollo/client";
import { CREATE_REQUEST_RETURN } from "@services/query/requestReturn.query";
import { toast } from "react-toastify";
import { actionType } from "../types/action.type";
import { Icon } from "@mui/material";

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
  sortBy: string;
  sortOrder: string;
  fontSize?: number;
}

const TableComponent = <T extends {}>({
  columns,
  data,
  onRowClick,
  onSortClick = () => {},
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
                    {item.header !== "icon" ? (
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
                  className="flex flex-row gap-3 cursor-pointer mt-1 h-full">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      onClick={() =>
                        column.header !== "icon" && onRowClick(item)
                      }
                      style={{
                        minWidth: column.width || "auto",
                        maxWidth: column.width,
                      }}
                      className={`text-sm h-full min-h-6 ${
                        column.header === "icon"
                          ? ""
                          : "border-b-2 border-graycustom"
                      } flex justify-start items-start h-full  truncate`}>
                      {column.header !== "icon" ? (
                        <div>
                          {getNestedValue(item, column.accessor) as string}
                        </div>
                      ) : (
                        <div className="flex justify-between items-start h-full">
                          {item.actions?.map(
                            (item: actionType, index: number) => (
                              <div key={index}>{item.icon}</div>
                            )
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
    
    </>
  );
};

export default TableComponent;
