'use client'
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_CATEGORY_MUTATION, GET_CATEGORY_QUERY } from "@services/query/category.query";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,
} from "@components/ui/select";
import { Input } from "@components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const Category = () => {
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const { data, refetch } = useQuery(GET_CATEGORY_QUERY);
    const [createCategoryMutation] = useMutation(CREATE_CATEGORY_MUTATION);
    const [newCategory, setNewCategory] = useState("");
    const [abbreviation, setAbbreviation] = useState("");

    const handleCancelNewCategory = () => {
        setShowNewCategoryInput(false);
        setNewCategory("");
        setAbbreviation("");
    };

    const handleAddNewCategory = () => {
        setShowNewCategoryInput(true);
    };

    useEffect(() => {
        const words = newCategory.split(" ");
        const abbreviation = words.map(word => word.charAt(0)).join("").toUpperCase();
        setAbbreviation(abbreviation);
    }, [newCategory]);

    const handleSaveNewCategory = async () => {
        try {
            const variables: any = {
                createCategoryInput: {
                    categoryCode: abbreviation,
                    categoryName: newCategory
                }
            }
            const response = await createCategoryMutation({ variables });
            if (response.errors) {
                response.errors.forEach((error: any) => {
                    toast.error(error.message);
                });
            } else {
                await refetch();
                setShowNewCategoryInput(false);
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong! Please try again");
            console.error("Error creating new category:", error);
        }
    };

    return (
        <SelectContent className="bg-graycustom2 text-black w-full h-[250px] overflow-scroll">
            {data?.getCategories.map((category: any) => (
                <SelectItem key={category?.id} value={category?.id}>
                    {category?.categoryName}
                </SelectItem>
            ))}
            {showNewCategoryInput ? (
                <div className="relative text-black mt-4 border-t-2 border-black bg-input-gray flex flex-col items-center w-full">
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
    )
}

export default Category