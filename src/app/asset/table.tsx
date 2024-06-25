/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import DetailModal from "@components/modal";
import ReusableTable from "@components/table";
import { disableUser } from "@services/user";
import { convertEnumToMap } from "@utils/enumToMap";
import Filter from "@components/filter";
import { useLoading } from "@providers/loading";
import Search from "@components/search";

import { ASSET_TYPE, SORT_ORDER, USER_TYPE } from "../../types/enum.type";
import { Asset, User } from "../../__generated__/graphql";
import { formatDate } from "../../utils/timeFormat";
import Pagination from "@components/pagination";
import { Button } from "@components/ui/button";
import { toast } from "react-toastify";

interface AssetManagementProps {
    data: Asset[];
    totalPages: number;
    currentPage: number;
    sortOrder: SORT_ORDER;
    sortBy: string;
    setSortBy: (value: any) => void;
    setSortOder: (value: any) => void;
    setCurrentPage: (value: number) => void;
}

const assetColumns = [
    { header: "Asset Code", accessor: "assetCode" as keyof Asset },
    { header: "Asset Name", accessor: "assetName" as keyof Asset },
    { header: "Category", accessor: "category" as keyof Asset },
    { header: "State", accessor: "state" as keyof Asset },
];

const historyColumns = [
    { header: "Date", accessor: "date" as keyof Asset },
    { header: "Assigned To", accessor: "assignedTo" as keyof Asset },
    { header: "Assigned By", accessor: "assignedBy" as keyof Asset },
    { header: "Returned Date", accessor: "returnedDate" as keyof Asset },
];

const AssetManagement: React.FC<AssetManagementProps> = (props) => {
    const {
        data,
        totalPages,
        currentPage,
        sortOrder,
        sortBy,
        setSortBy,
        setSortOder,
        setCurrentPage,
    } = props;
    const [showModalRemoveAsset, setShowModalRemoveAsset] = useState(false);
    const [showModalDetailAsset, setShowModalDetailAsset] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<User | null>(null);
    const [listUser, setListUsers] = useState<User[] | []>();
    const [dataUpdate, setDataUpdate] = useState<User | User[] | null>(null);

    const router = useRouter();
    const { setLoading }: any = useLoading();


    const handleNavigateEditUser = (user: User) => {
        setDataUpdate(user);
        console.log("asset data update table: ", user);
        router.push(`/asset/${user.id}`);
    };



    const handleSortClick = (item: string) => {
        let defaultOrder = SORT_ORDER.ASC;
        if (sortBy === item || (sortBy === "firstName" && item === "fullName")) {
            defaultOrder =
                sortOrder === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
        }
        setSortOder(defaultOrder);
        if (item === "fullName") {
            setSortBy("firstName");
        } else {
            setSortBy(item);
        }
    };

    const handleDeleteClick = (user: User) => {
        setSelectedAsset(user);
        setShowModalRemoveAsset(true);
    };

    const handleCloseModal = () => {
        setShowModalRemoveAsset(false);
    };

    const handleConfirmDelete = async () => {
        try {
            setLoading(true);
            const response = await disableUser(parseInt(selectedAsset?.id as string));
            console.log("Response disable: ", response);
            if (response) {
                setShowModalRemoveAsset(false);
                toast.success("Disable User Successfully");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error disabling user:", error);
        }
    };

    const handleRowClick = (user: User) => {
        setSelectedAsset(user);
        setShowModalDetailAsset(true);
    };

    const handleCloseDetailModal = () => {
        setShowModalDetailAsset(false);
    };

    const handleNavigateCreateAsset = () => {
        setLoading(true);
        router.push("asset/create");
        setLoading(false);
    };

    return (
        <>
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4 text-nashtech">Asset List</h2>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="relative w-70 flex">
                            <Filter
                                setCurrentPage={setCurrentPage}
                                label="Type"
                                data={convertEnumToMap(ASSET_TYPE)}
                            />
                            <div className="ml-4">
                            <Filter
                                setCurrentPage={setCurrentPage}
                                label="Type"
                                data={convertEnumToMap(ASSET_TYPE)}
                            />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-10">
                        <Search setCurrentPage={setCurrentPage}/>
                        <button
                            className="bg-red-600 text-white rounded px-4 py-1 cursor-pointer"
                            onClick={handleNavigateCreateAsset}>
                            Create new asset
                        </button>
                    </div>
                </div>
                {/* <ReusableTable
                    columns={assetColumns}
                    data={data ?? []}
                    onRowClick={handleRowClick}
                    onDeleteClick={handleDeleteClick}
                    onSortClick={handleSortClick}
                    onEditClick={handleNavigateEditUser}
                    sortBy={sortBy === "firstName" ? "fullName" : sortBy}
                    sortOrder={sortOrder}
                /> */}
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
            <DetailModal
                isOpen={showModalRemoveAsset}
                onClose={handleCloseModal}
                isShowCloseIcon={true}
                title="Are you sure ?">
                <div className="p-3">
                    <div className="sm:flex sm:items-start">
                        <p className="text-md text-gray-500">
                            Do you want to disable this user?
                        </p>
                    </div>
                </div>
                <div className="sm:flex sm:flex-row gap-4">
                    <Button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={handleConfirmDelete}>
                        Disable
                    </Button>
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => setShowModalRemoveAsset(false)}>
                        Cancel
                    </Button>
                </div>
            </DetailModal>
            {selectedAsset && (
                <DetailModal
                    isOpen={showModalDetailAsset}
                    onClose={handleCloseDetailModal}
                    title="Detailed Asset Information">
                    <div className="text-gray">
                        <div className="flex mb-2">
                            <span className="text-sm w-40">Asset Code</span>{" "}
                            <span className="text-sm">{selectedAsset.staffCode}</span>
                        </div>
                        <div className="flex mb-2">
                            <span className="text-sm w-40">Asset Name</span>{" "}
                            <span className="text-sm">
                                {selectedAsset.lastName} {selectedAsset.firstName}
                            </span>
                        </div>
                        <div className="flex mb-2">
                            <span className="text-sm w-40">Category</span>{" "}
                            <span className="text-sm">{selectedAsset.username}</span>
                        </div>
                        <div className="flex mb-2">
                            <span className="text-sm w-40">Installed Date</span>{" "}
                            <span className="text-sm">
                                {formatDate(new Date(selectedAsset.dateOfBirth))}
                            </span>
                        </div>
                        <div className="flex mb-2">
                            <span className="text-sm w-40">Location</span>{" "}
                            <span className="text-sm">{selectedAsset.gender}</span>
                        </div>
                        <div className="flex mb-2">
                            <span className="text-sm w-40">Specification</span>{" "}
                            <span className="text-sm">
                                {formatDate(new Date(selectedAsset.joinedDate))}
                            </span>
                        </div>
                        <div className="flex mb-2">
                            <span className="text-sm w-40">History</span>{" "}
                            <span className="text-sm">
                                
                            </span>
                        </div>
                    </div>
                </DetailModal>
            )}
        </>
    );
};

export default AssetManagement;
