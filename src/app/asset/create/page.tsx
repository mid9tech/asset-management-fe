"use client";
import { useForm } from "react-hook-form";
import { Button } from "@components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DetailModal from "@components/modal";
import FormCreateAsset from "./form";

enum State {
    AVAILABLE = "AVAILABLE",
    NOT_AVAILABLE = "NOT_AVAILABLE"
}

interface FormData {
    name: string;
    categoryId: string;
    specification: string;
    installedDate: string;
    state: State;
}

const CreateAsset = () => {
    const [showModalCancel, setShowModalCancel] = useState(false);
    const router = useRouter();

    const handleCloseCancelModal = () => {
        setShowModalCancel(false);
    };
    const form = useForm<FormData>({
        mode: "onChange",
        defaultValues: {
            name: "",
            categoryId: "",
            specification: "",
            installedDate: "",
            state: State.AVAILABLE,
        },
    });

    const handleDiscard = () => {
        form.reset();
        setShowModalCancel(false);
        router.push("/asset");
    };

    return (
        <>
            <div className="ml-14 w-1/2 space-y-6">
                <h1 className="text-nashtech font-semibold mb-5">Create New Asset</h1>
                <FormCreateAsset/>
            </div>
        </>
    );
};
export default CreateAsset;