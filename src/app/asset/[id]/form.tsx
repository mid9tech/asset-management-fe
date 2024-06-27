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
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
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
enum State {
    AVAILABLE = "AVAILABLE",
    NOT_AVAILABLE = "NOT_AVAILABLE",
    WAITING_FOR_RECYCLING = "WAITING_FOR_RECYCLING",
    RECYCLED = "RECYCLED",
    ASSIGNED = "ASSIGNED"
}

interface FormData {
    assetName: string;
    installedDate: string;
    state: State;
    specification: string;
    category: {
        categoryName: string;
        categoryCode: string;
    };
}


const FormEdit = ({ params }: { params: { id: string } }) => {
    const { setLoading }: any = useLoading();
    const [editAssetMutation] = useMutation(EDIT_ASSET_MUTATION);
    const [showModalCancel, setShowModalCancel] = useState(false);
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [abbreviation, setAbbreviation] = useState("");
    const [dataUpdate, setDataUpdate] = useState<FormData | null>(null);
    const router = useRouter();
    const form = useForm<FormData>({
        mode: "onChange",
        defaultValues: dataUpdate || {
            assetName: "",
            installedDate: "",
            state: State.AVAILABLE,
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
        setLoading(true);
        try {
            const variables: any = {
                id: parseInt(params.id),
                updateAssetInput: {
                    assetName: data.assetName,
                    installedDate: data.installedDate,
                    state: data.state,
                    specification: data. specification
                },
            };

            const response = await editAssetMutation({ variables });

            if (response.errors) {
                response.errors.forEach((error: any) => {
                    console.error(`GraphQL error message: ${error.message}`);
                });
            } else {
                const assetId = response.data.updateAsset.id;
                localStorage.setItem("newAssetId", '"' + assetId.toString() + '"');
                router.push("/asset");
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
                                        <FormLabel className="w-[150px]">Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder=""
                                                {...field}
                                                className={`cursor-pointer ${fieldState.error ? "border-nashtech" : ""
                                                    }`}
                                            />
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
                            name="category"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <div className="flex items-center gap-5">
                                        <FormLabel className="w-[150px]">Category</FormLabel>
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
                                        <FormLabel className="w-[150px]">Specification</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                className={`h-[100px] flex justify-end cursor-pointer flex-col ${fieldState.error ? "border-nashtech" : ""
                                                    }`}
                                            />
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
                            name="installedDate"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <div className="flex items-center gap-5">
                                        <FormLabel className="w-[150px]">Installed Date</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder=""
                                                {...field}
                                                type="date"
                                                className={`flex justify-end cursor-pointer flex-col ${fieldState.error ? "border-nashtech" : ""
                                                    }`}
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
                                        <FormLabel className="w-[120px]">State</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                {...field}
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                defaultValue={State.AVAILABLE}
                                                className="cursor-pointer">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value={State.AVAILABLE} id="option-one" className={field.value === State.AVAILABLE ? 'text-nashtech' : ''} />
                                                    <Label htmlFor="option-one" className="">Available</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value={State.NOT_AVAILABLE} id="option-two" className={field.value === State.NOT_AVAILABLE ? 'text-nashtech' : ''} />
                                                    <Label htmlFor="option-two" className="">Not Available</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value={State.WAITING_FOR_RECYCLING} id="option-three" className={field.value === State.WAITING_FOR_RECYCLING ? 'text-nashtech' : ''} />
                                                    <Label htmlFor="option-three" className="">Waiting for recycling</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value={State.RECYCLED}
                                                        id="option-four"
                                                        className={field.value === State.RECYCLED ? 'text-nashtech' : ''} />
                                                    <Label htmlFor="option-four">Recycled</Label>
                                                </div>
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
                            // disabled={!allFieldsFilled}
                            >
                                Save
                            </Button>
                            <Button type="button" onClick={() => setShowModalCancel(true)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
    </>
  )
}

export default FormEdit