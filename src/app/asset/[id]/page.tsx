"use client";
import { useForm } from "react-hook-form";
import { Button } from "@components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DetailModal from "@components/modal";
import FormEdit from "./form";
import { usePushUp } from "../pushUp";
import { ASSET_TYPE } from "../../../types/enum.type";



interface FormData {
    assetName: string;
    installedDate: string;
    state: ASSET_TYPE;
    specification: string;
    category: {
        categoryName: string;
        categoryCode: string;
    };
}

const EditAsset = ({ params }: { params: { id: string } }) => {
    const [showModalCancel, setShowModalCancel] = useState(false);
    const router = useRouter();
    const [dataUpdate, setDataUpdate] = useState<FormData | null>(null);

    const handleCloseCancelModal = () => {
        setShowModalCancel(false);
    };

    const handleDiscard = () => {
        form.reset();
        setShowModalCancel(false);
        router.push("/asset");
    };

    const form = useForm<FormData>({
        mode: "onChange",
        defaultValues: dataUpdate || {
            assetName: "",
            installedDate: "",
            state: ASSET_TYPE.Available,
            specification: "",
            category: {
                categoryName: "",
                categoryCode: ""
            }
        },
    });

    return (
        <>
            <div className="ml-14 w-1/2 space-y-6">
                <h1 className="text-nashtech font-semibold mb-5">Edit Asset</h1>
                <FormEdit params={params}/>
            </div>
            <DetailModal
                isOpen={showModalCancel}
                onClose={handleCloseCancelModal}
                title="Are you sure">
                <div className="bg-white sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <p className="text-md text-gray-500">
                                Do you want to cancel changes?
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 sm:flex sm:flex-row-reverse gap-4">
                    <Button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => setShowModalCancel(false)}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={handleDiscard}>
                        Discard
                    </Button>
                </div>
            </DetailModal>
        </>
    );
};

export default EditAsset;
