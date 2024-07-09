/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect, useState } from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@components/ui/form";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@components/ui/input";
import { RadioGroup } from "@components/ui/radio-group";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import { EDIT_ASSET_MUTATION, FIND_ONE_ASSET_QUERY } from "@services/query/asset.query";
import { useLoading } from '@providers/loading';
import { useMutation, useQuery } from '@apollo/client';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { usePushUp } from '../pushUp';
import { ASSET_PATH_DEFAULT } from '../../../constants';
import { ASSET_TYPE_EDIT } from '../../../types/enum.type';
import { formatText } from '@utils/formatText';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './schema';

interface FormData {
    assetName: string;
    installedDate: string;
    state: ASSET_TYPE_EDIT;
    specification: string;
    category: {
        categoryName: string;
        categoryCode: string;
    };
}

const FormEdit = ({ params }: { params: { id: string } }) => {
    const { setLoading }: any = useLoading();
    const [editAssetMutation] = useMutation(EDIT_ASSET_MUTATION);
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [abbreviation, setAbbreviation] = useState("");
    const [dataUpdate, setDataUpdate] = useState<FormData | null>(null);
    const [submissionInProgress, setSubmissionInProgress] = useState(false);
    const router = useRouter();
    const { pushUp }: any = usePushUp();
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: dataUpdate || {
            assetName: "",
            installedDate: "",
            state: ASSET_TYPE_EDIT.Available,
            specification: "",
            category: {
                categoryName: "",
                categoryCode: ""
            }
        },
    });

    const handleAddNewCategory = () => {
        setShowNewCategoryInput(true);
    };

    const handleSaveNewCategory = () => {
        setShowNewCategoryInput(false);
    };
    const handleCancelNewCategory = () => {
        setShowNewCategoryInput(false);
        setNewCategory("");
        setAbbreviation("");
    };

    const onSubmit = async (data: FormData) => {
        if (submissionInProgress) return;
        setSubmissionInProgress(true);
        setLoading(true);
        try {
            const variables: any = {
                id: parseInt(params.id),
                updateAssetInput: {
                    assetName: data.assetName,
                    installedDate: data.installedDate,
                    state: data.state,
                    specification: data.specification || "", // Ensure specification is sent even if it's an empty string
                },
            };

            const response = await editAssetMutation({ variables });

            if (response.errors) {
                response.errors.forEach((error: any) => {
                    console.error(`GraphQL error message: ${error.message}`);
                });
            } else {
                const assetId = response.data.updateAsset.id;
                pushUp(parseInt(assetId));
                router.push(ASSET_PATH_DEFAULT);
                toast.success("Edit Asset Successfully");
            }
        } catch (error) {
            toast.error("Something went wrong! Please try again");
            console.error("Error updating asset:", error);
        } finally {
            setLoading(false);
        }
    };

    const { data: assetData, error } = useQuery(FIND_ONE_ASSET_QUERY, {
        variables: { id: parseInt(params.id, 10) },
    });

    useEffect(() => {
        if (assetData) {
            setDataUpdate(assetData.findOneAsset);
            form.reset({
                assetName: assetData.findOneAsset.assetName,
                installedDate: assetData.findOneAsset.installedDate.substring(0, 10),
                state: assetData.findOneAsset.state,
                specification: assetData.findOneAsset.specification,
                category: {
                    categoryName: assetData.findOneAsset.category.categoryName,
                    categoryCode: assetData.findOneAsset.category.categoryCode,
                },
            });
        }
    }, [assetData]);

    return (
        <>
            <Form {...form}>
                <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="assetName"
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
                        name="category"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <div className="flex items-center gap-5">
                                    <FormLabel className="w-[150px]">Category <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Controller
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value.categoryName}
                                                    disabled
                                                >
                                                    <SelectTrigger className="bg-disable">
                                                        <SelectValue>
                                                            {field.value.categoryName}
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent className="text-black w-full">
                                                        {showNewCategoryInput ? (
                                                            <div className="relative text-black mt-4 border-t-2 border-black flex flex-col items-center w-full">
                                                                <div className="flex mr-10">
                                                                    <Input
                                                                        value={newCategory}
                                                                        onChange={(e) => setNewCategory(e.target.value)}
                                                                        className="h-fit w-full mt-1 bg-gray-50 border border-gray-100 text-gray-900 text-sm block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black rounded-none"
                                                                    />
                                                                    <Input
                                                                        value={abbreviation}
                                                                        readOnly
                                                                        className="h-fit mt-1 bg-gray-50 b-l-0 border border-gray-100 text-gray-900 text-sm block w-[60px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black rounded-none"
                                                                    />
                                                                </div>
                                                                <div className="absolute inset-y-0 end-0 flex items-center">
                                                                    <CheckIcon onClick={handleSaveNewCategory} className="text-nashtech font-bold cursor-pointer" />
                                                                    <ClearIcon onClick={handleCancelNewCategory} className="cursor-pointer" />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="p-2 text-nashtech border-t-2 border-gray bg-input-gray text-sm italic underline py-1 cursor-pointer" onClick={handleAddNewCategory}>
                                                                Add New Category
                                                            </p>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
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
                        name="specification"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <div className="flex items-start gap-5">
                                    <FormLabel className="w-[150px]">Specification <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        {/* <Input
                                            {...field}
                                            type="text"
                                            className={`h-[100px] flex justify-end cursor-pointer flex-col ${fieldState.error ? "border-nashtech" : ""}`}
                                        /> */}
                                        <textarea
                                            {...field}
                                            id="specification"
                                            rows={5}
                                            maxLength={200}
                                            className={`flex h-auto w-full rounded-md border border-input bg-transparent px-3 py-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${fieldState.error ? "border-nashtech" : ""}`}
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
                                <FormMessage className="text-nashtech float-left ml-32">
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
                                    <FormLabel className="w-[120px]">State <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            {...field}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            defaultValue={ASSET_TYPE_EDIT.Available}
                                            className="cursor-pointer">
                                            {Object.values(ASSET_TYPE_EDIT).map((type, index) => (
                                                <div key={index} className="flex items-center space-x-2">
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
                                <FormMessage className="text-nashtech float-left ml-32">
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
                        <Button type="button" onClick={() => router.push(ASSET_PATH_DEFAULT)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default FormEdit;
