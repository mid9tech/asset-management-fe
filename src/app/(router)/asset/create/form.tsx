import React, { useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@components/ui/form";
import { useLoading } from "@providers/loading";
import { useMutation } from "@apollo/client";
import { CREATE_ASSET_MUTATION } from "@services/query/asset.query";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@components/ui/input";
import { toast } from "react-toastify";
import { Select, SelectTrigger, SelectValue } from "@components/ui/select";
import { RadioGroup } from "@components/ui/radio-group";
import { useRouter } from "next/navigation";
import Category from "./category";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import DetailModal from '@components/modal';
import { usePushUp } from '../pushUp';
import { zodResolver } from '@hookform/resolvers/zod';
import { ASSET_PATH_DEFAULT } from '../../../../constants';
import { ASSET_TYPE_CREATE } from '../../../../types/enum.type';
import { formatText } from '@utils/formatText';
import { formSchema } from './schema';
import { Badge } from '@components/ui/badge';

interface FormData {
    name: string;
    categoryId: string;
    specification: string;
    installedDate: string;
    state: ASSET_TYPE_CREATE;
}

const FormCreateAsset = () => {
    const [createAssetMutation] = useMutation(CREATE_ASSET_MUTATION);
    const [showModalCancel, setShowModalCancel] = useState(false);
    const [submissionInProgress, setSubmissionInProgress] = useState(false);
    const { setLoading }: any = useLoading();
    const router = useRouter();
    const { pushUp }: any = usePushUp();
    const [inputText, setInputText] = useState("");
    const characterLimit = 200;
    const handleChange = (event: any) => {
        setInputText(event.target.value);
        form.setValue('specification', event.target.value, { shouldValidate: true });
    };


    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            categoryId: "",
            specification: "",
            installedDate: "",
            state: ASSET_TYPE_CREATE.Available,
        },
    });

    const handleCloseCancelModal = () => {
        setShowModalCancel(false);
    };

    const handleDiscard = () => {
        form.reset();
        setShowModalCancel(false);
        router.back();
    };

    const onSubmit = async (data: FormData) => {
        if (submissionInProgress) return;
        setSubmissionInProgress(true);
        setLoading(true);
        try {
            const variables = {
                createAssetInput: {
                    assetName: data.name,
                    categoryId: parseInt(data.categoryId),
                    specification: data.specification,
                    installedDate: data.installedDate,
                    state: data.state,
                },
            };

            const response = await createAssetMutation({ variables });

            if (response.errors) {
                response.errors.forEach((error: any) => {
                    console.error(`GraphQL error message: ${error.message}`);
                });
                toast.error("Error creating asset");
            } else {
                const assetId = response.data.createAsset.id;
                pushUp(parseInt(assetId));
                toast.success("Asset created successfully");
                router.push(`${ASSET_PATH_DEFAULT}`);
            }
        } catch (error) {
            toast.error("Something went wrong! Please try again");
            console.error("Error creating asset:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Form {...form}>
                <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <div className="flex items-center gap-5">
                                    <FormLabel className="w-[150px]">Name <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder=""
                                            {...field}
                                            className={`cursor-pointer ${fieldState.error ? "border-nashtech" : ""}`}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage className="text-nashtech float-left ml-32">
                                    {fieldState.error?.message}
                                </FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <div className="flex items-center gap-5">
                                    <FormLabel className="w-[150px]">Category <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue className="cursor-pointer" ref={field.ref} />
                                            </SelectTrigger>
                                            <Category />
                                        </Select>
                                    </FormControl>
                                </div>
                                <FormMessage className="text-nashtech float-left ml-26">
                                    {fieldState.error?.message}
                                </FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="specification"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <div className="flex items-start gap-5">
                                    <FormLabel className="w-[150px]">Specification <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <textarea
                                            {...field}
                                            id="specification"
                                            rows={5}
                                            value={inputText}
                                            onChange={handleChange}
                                            maxLength={200}
                                            className={`flex h-auto w-full rounded-md border border-input bg-transparent px-3 py-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${fieldState.error ? "border-nashtech" : ""}`}
                                        />
                                    </FormControl>
                                </div>
                                <Badge className='mt-3 float-right border-0 shadow-none'>{inputText.length}/{characterLimit}</Badge>
                                <FormMessage className="text-nashtech float-left ml-32">
                                    {fieldState.error?.message}
                                </FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="installedDate"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <div className="flex items-center gap-5">
                                    <FormLabel className="w-[150px]">Installed Date <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder=""
                                            {...field}
                                            type="date"
                                            className={`flex justify-end cursor-pointer flex-col ${fieldState.error ? "border-nashtech" : ""}`}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage className="text-nashtech float-left ml-26">
                                    {fieldState.error?.message}
                                </FormMessage>
                            </FormItem>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="state"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <div className="flex">
                                    <FormLabel className="w-[125px]">State <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            {...field}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            className="cursor-pointer">
                                            {Object.values(ASSET_TYPE_CREATE).map((type, index) => (<div key={index} className="flex items-center space-x-2">
                                                <label className="custom-radio flex h-[20px]">
                                                    <input
                                                        id={`option-${index}`}
                                                        type="radio"
                                                        value={type}
                                                        checked={field.value === type}
                                                        onChange={field.onChange}
                                                        className={`focus:ring ${field.value === type ? "border-nashtech" : ""}`}
                                                    />
                                                    <div className="checkmark mt-2"></div>
                                                    <Label className='cursor-pointer' htmlFor={`option-${index}`}>{formatText(type)}</Label>
                                                </label>
                                            </div>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                                <FormMessage className="text-nashtech float-left ml-26">
                                    {fieldState.error?.message}
                                </FormMessage>
                            </FormItem>
                        )}
                    />
                    <div className="float-right">
                        <Button
                            type="submit"
                            className="bg-nashtech text-white mr-4 cursor-pointer"
                            disabled={!form.formState.isValid}
                        >
                            Save
                        </Button>
                        <Button variant="outline" type="button" onClick={() => setShowModalCancel(true)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
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
                        variant="outline"
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

export default FormCreateAsset;
