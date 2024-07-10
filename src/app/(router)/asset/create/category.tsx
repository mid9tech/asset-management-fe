"use client";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_CATEGORY_MUTATION, GET_CATEGORY_QUERY } from "@services/query/category.query";
import { SelectContent, SelectItem } from "@components/ui/select";
import { Input } from "@components/ui/input";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { truncateParagraph } from "@utils/truncate";
import { Category as CategoryType } from "../../../../__generated__/graphql";

const Category = () => {
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const { data, refetch } = useQuery(GET_CATEGORY_QUERY);
  const [createCategoryMutation] = useMutation(CREATE_CATEGORY_MUTATION);
  const [newCategory, setNewCategory] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCancelNewCategory = () => {
    setShowNewCategoryInput(false);
    setNewCategory("");
    setAbbreviation("");
  };

  const handleAddNewCategory = () => {
    setShowNewCategoryInput(true);
  };

  useEffect(() => {
    if (showNewCategoryInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showNewCategoryInput]);

  useEffect(() => {
    if (data) {
      const baseAbbreviation = newCategory
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();

      let abbreviation = baseAbbreviation;
      let counter = 1;

      while (
        data.getCategories.some(
          (category: CategoryType) => category.categoryCode === abbreviation
        )
      ) {
        abbreviation = `${baseAbbreviation}${counter}`;
        counter++;
      }

      setAbbreviation(abbreviation);
    }
  }, [newCategory, data]);

  const handleSaveNewCategory = async () => {
    try {
      if (!newCategory.trim()) {
        toast.error("Category name is required");
        return;
      }
      const variables = {
        createCategoryInput: {
          categoryCode: abbreviation,
          categoryName: newCategory,
        },
      };
      const response = await createCategoryMutation({ variables });
      if (response.errors) {
        response.errors.forEach((error) => {
          toast.error(error.message);
        });
      } else {
        await refetch();
        setNewCategory("")
        setAbbreviation("")
        setShowNewCategoryInput(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong! Please try again");
      console.error("Error creating new category:", error);
    }
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z0-9\s]*$/; // Allow only letters, numbers, and spaces
    if (regex.test(value) && value.length <= 20) {
      setNewCategory(value);
    }
  };

  const handleCategoryInputBlur = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <SelectContent className="bg-graycustom2 text-black w-full">
      <div className="h-[100px] overflow-scroll">
        {data?.getCategories.map((category: CategoryType) => (
          <SelectItem key={category?.id} value={category?.id}>
            {truncateParagraph(`${category?.categoryName}`, 25)}
          </SelectItem>
        ))}
      </div>
      {showNewCategoryInput ? (
        <div className="relative text-nashtech mt-4 border-t-2 border-black bg-input-gray flex flex-col items-center">
          <div className="flex w-2/3">
            <Input
              ref={inputRef}
              value={newCategory}
              id="newCategory"
              onChange={handleCategoryInputChange}
              onBlur={handleCategoryInputBlur}
              className="h-fit w-3/5 mt-1 bg-gray-50 border border-gray-100 text-gray-900 text-sm block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black rounded-none"
            />
            <Input
              value={abbreviation}
              readOnly
              id="abbreviation"
              className="h-fit mt-1 bg-gray-50 b-l-0 border border-gray-100 text-gray-900 text-sm block w-[60px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black rounded-none"
            />
          </div>
          <div className="absolute inset-y-0 end-0 flex items-center px-4">
            {newCategory ? (
              <CheckIcon
                onClick={handleSaveNewCategory}
                className="text-nashtech font-bold cursor-pointer stroke-red-600"
              />
            ) : (
              <CheckIcon className="text-gray-400" />
            )}
            <ClearIcon
              onClick={handleCancelNewCategory}
              className="cursor-pointer text-black stroke-black"
            />
          </div>
        </div>
      ) : (
        <div
          className="p-2 text-nashtech border-t-2 border-gray bg-input-gray text-sm italic underline py-1 cursor-pointer"
          onClick={handleAddNewCategory}
        >
          Add New Category
        </div>
      )}
    </SelectContent>
  );
};

export default Category;
