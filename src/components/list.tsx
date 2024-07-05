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
  onDeleteClick?: (item: T) => void;
  onEditClick?: (item: T) => void;
  onReturnClick?: (item: T) => void;
  onCheckClick?: (item: T) => void;
  onSortClick?: (item: string) => void;
  sortBy: string;
  sortOrder: string;
  fontSize?: number;
}

const ReusableList = <T extends {}>({
  columns,
  data,
  onRowClick,
  onDeleteClick,
  onEditClick,
  onReturnClick,
  onCheckClick,
  onSortClick = () => {},
  sortBy,
  sortOrder,
  fontSize,
}: ReusableTableProps<T>) => {
  const [showModalCancel, setShowModalCancel] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [requestReturn] = useMutation(CREATE_REQUEST_RETURN);

  const handleCloseCancelModal = () => {
    setShowModalCancel(false);
  };

  const handleDiscard = () => {
    setShowModalCancel(false);
    setSelectedItem(null);
  };

  const handleConfirm = async () => {
    if (selectedItem) {
      await onSubmit(selectedItem);
      setShowModalCancel(false);
      setSelectedItem(null);
    }
  };
  const onSubmit = async (item: any) => {
    console.log("data item: ", item);

    try {
      const variables: any = {
        request: {
          assetId: parseInt(item.asset.id),
          assignmentId: parseInt(item.id),
          requestedById: parseInt(item.assignee.id),
          assignedDate: item.assignedDate,
        },
      };
      const { data } = await requestReturn({ variables });
      const successMessage =
        data.createRequestReturn?.message ||
        "Request return created successfully";
      toast.success(successMessage);
      console.log("Request return created: ", data.createRequestReturn);
    } catch (error: any) {
      const errorMessage =
        error.graphQLErrors?.[0]?.message || "Something went wrong";
      toast.error(errorMessage);
      console.error("Error creating request return: ", error);
    }
  };

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
                  className="flex flex-row gap-3 cursor-pointer mt-1 h-full"
                  onClick={() => onRowClick(item)}>
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
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
                        (getNestedValue(item, column.accessor) as string)
                      ) : (
                        <div className="flex justify-between items-start h-full">
                          {onCheckClick && (
                            <CheckIcon
                              className={`${
                                item.isDisabledIcon === true &&
                                "text-gray cursor-not-allowed"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                !item.isDisabledIcon && onCheckClick(item);
                              }}
                            />
                          )}

                          {onEditClick && (
                            <CreateIcon
                              className={`${
                                item.isDisabledIcon === true &&
                                "text-gray cursor-not-allowed"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                !item.isDisabledIcon && onEditClick(item);
                              }}
                            />
                          )}

                          {onDeleteClick && (
                            <HighlightOffIcon
                              className={`${
                                item.isDisabledIcon === true &&
                                "text-gray cursor-not-allowed"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                !item.isDisabledIcon && onDeleteClick(item);
                              }}
                              sx={{ color: "#cf2338" }}
                            />
                          )}
                          {onReturnClick && (
                            <ReplayIcon
                              className={`${
                                item.isDisabledIcon === true &&
                                "text-gray cursor-not-allowed"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (item.state === "Accepted") {
                                  setSelectedItem(item);
                                  setShowModalCancel(true);
                                }
                              }}
                              sx={{ color: "blue" }}
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
      <DetailModal
        isOpen={showModalCancel}
        onClose={handleCloseCancelModal}
        title="Are you sure?">
        <div className="bg-white sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <p className="text-md text-gray-500">
                Do you want to create a returning request for this asset?
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 sm:flex sm:flex-row-reverse gap-4">
          <Button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={handleCloseCancelModal}>
            Cancel
          </Button>
          <Button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </DetailModal>
    </>
  );
};

export default ReusableList;
