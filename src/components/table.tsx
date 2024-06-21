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
import { SORT_ORDER } from "../types/enum.type";

type Column<T> = {
  header: string;
  accessor: keyof T;
};

interface ReusableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick: (item: T) => void;
  onDeleteClick: (item: T) => void;
  onEditClick: (item: T) => void;
  onSortClick: (item: string) => void;
  sortBy: string;
  sortOrder: string;
}

const ReusableTable = <T extends {}>({
  columns,
  data,
  onRowClick,
  onDeleteClick,
  onEditClick,
  onSortClick,
  sortBy,
  sortOrder,
}: ReusableTableProps<T>) => {
  if (sortBy === "lastName") {
    sortBy = "fullName";
  } else if (sortBy === "joinedDate") {
    sortBy = "joinedAt";
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead
              key={index}
              className="w-[150px] cursor-pointer"
              onClick={() => onSortClick(column.accessor as string)}>
              {column.header}{" "}
              {sortBy === column.accessor && sortOrder === SORT_ORDER.ASC ? (
                <ArrowDropUpIcon />
              ) : (
                <ArrowDropDownIcon />
              )}
            </TableHead>
          ))}
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow
            key={index}
            className="cursor-pointer"
            onClick={() => onRowClick(row)}>
            {columns.map((column, colIndex) => (
              <TableCell key={colIndex} className="font-medium">
                {row[column.accessor] as ReactNode}
              </TableCell>
            ))}
            <TableCell onClick={(e) => e.stopPropagation()}>
              <CreateIcon
                className="text-gray-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick(row);
                }}
              />
              <HighlightOffIcon
                sx={{ color: "#cf2338" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick(row);
                }}
                className="cursor-pointer"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReusableTable;
