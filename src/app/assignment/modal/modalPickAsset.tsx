/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useDebouncedCallback } from "use-debounce";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import { Button } from "@components/ui/button";
import SearchIcon from "@public/icon/search.svg";
import { useLoading } from "@providers/loading";
import { loadDataAsset } from "@services/asset";
import Pagination from "@components/paginationByState";
import { toast } from "react-toastify";
import { Asset, FindAssetsInput } from "../../../__generated__/graphql";
import { SORT_ORDER, ASSET_TYPE } from "../../../types/enum.type";
import TablePickerComponent from "@components/tablePicker";

export const assetColumns = [
  {
    header: "radio",
    accessor: "" as keyof Asset,
    width: "4%",
  },
  {
    header: "Asset Code",
    accessor: "assetCode" as keyof Asset,
    width: "25%",
    sortField: "assetCode",
  },
  {
    header: "Asset Name",
    accessor: "assetName" as keyof Asset,
    width: "45%",
    sortField: "assetName",
  },
  {
    header: "Category",
    accessor: "category.categoryName" as keyof Asset,
    width: "20%",
    sortField: "category",
  },
];

interface ModalPickerProps {
  isOpen: boolean;
  setOpenModal: (value: boolean) => void;
  setAssetSelected: (value: Asset) => void;
}

const ModalAssetPicker: React.FC<ModalPickerProps> = ({
  isOpen,
  setOpenModal,
  setAssetSelected,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { setLoading }: any = useLoading();
  const [selected, setSelected] = useState<Asset>();
  const [list, setList] = useState<Asset[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("assetCode");
  const [sortOrder, setSortOrder] = useState<SORT_ORDER>(SORT_ORDER.ASC);
  const [currenPage, setCurrenPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);

  const handleSearch = useDebouncedCallback((term: string) => {
    setCurrenPage(1);
    setSearchTerm(term);
  }, 300);

  const handleSortClick = (item: any) => {
    let defaultOrder = SORT_ORDER.ASC;
    if (sortBy === item) {
      defaultOrder =
        sortOrder === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
    }
    setSortOrder(defaultOrder);
    setSortBy(item);
  };

  const loadData = async (filter: FindAssetsInput) => {
    try {
      setLoading(true);
      const { data }: any = await loadDataAsset(filter);
      setTotalPage(data.totalPages);
      setList(data.assets);
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong! Please try again");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpenModal(false);
      }
    };
    if (isOpen) {
      loadData({
        page: currenPage,
        query: searchTerm,
        limit: 10,
        sortField: sortBy,
        sortOrder: sortOrder,
        stateFilter: [ASSET_TYPE.Available],
      });

      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, searchTerm, sortBy, sortOrder, currenPage]);

  if (!isOpen) return null;

  const handleSelected = (item: Asset) => {
    setSelected(item);
  };

  const handleSave = () => {
    setAssetSelected(selected as Asset);
    setOpenModal(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white border border-black shadow-lg w-1/2 h-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-5">
          <div className="flex flex-row justify-between items-center">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 text-nashtech font-bold">
                Select Asset
              </h3>
            </div>
            <div className="px-4 sm:px-6">
              <div className="relative w-52 h-full">
                <input
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                  value={searchTerm || ""}
                  className="w-full pr-9 rounded border-solid border outline-none px-2 py-1 border-graycustom"
                />
                <button className="absolute top-0 p-2 h-full right-0 border-l-graycustom border-l">
                  <Image
                    src={SearchIcon}
                    width={15}
                    height={15}
                    alt={"search icon"}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center">
            <TablePickerComponent
              selected={selected}
              columns={assetColumns}
              data={list as Asset[]}
              onRowClick={handleSelected}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortClick={handleSortClick}
            />
          </div>
          <div className="flex justify-center">
            {totalPage > 1 && (
              <Pagination
                totalPages={totalPage}
                currentPage={currenPage}
                setCurrentPage={setCurrenPage}
              />
            )}
          </div>

          <div className="px-4 py-4 sm:px-6 flex justify-end gap-3">
            <Button
              disabled={!selected}
              className="bg-nashtech text-white"
              onClick={handleSave}>
              Save
            </Button>
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAssetPicker;
