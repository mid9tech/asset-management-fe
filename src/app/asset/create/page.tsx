/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z, ZodSchema } from "zod";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { toast } from "react-toastify";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { differenceInYears, isAfter, isWeekend } from "date-fns";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DetailModal from "@components/modal";
import { CREATE_USER_MUTATION } from "@services/user";
import { useMutation } from "@apollo/client";
import { useLoading } from "@providers/loading";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

enum State {
    AVAILABLE = "AVAILABLE",
    NOT_AVAILABLE = "NOT_AVAILABLE"
}

const formSchema: ZodSchema = z
    .object({
        firstName: z
            .string()
            .min(1, { message: "First Name is missing" })
            .regex(/^[a-zA-Z0-9_ ]+$/, {
                message: "Must contain alphabetic characters",
            })
            .max(128, {
                message: "First Name can't be more than 128 characters",
            })
            .refine((val) => /[a-zA-Z]/.test(val), {
                message: "First Name is invalid",
            }),
        lastName: z
            .string()
            .min(1, { message: "Last Name is missing" })
            .regex(/^[a-zA-Z0-9_ ]+$/, {
                message: "Must contain only alphabetic characters",
            })
            .max(128, {
                message: "Last Name can't be more than 128 characters",
            })
            .refine((val) => /[a-zA-Z]/.test(val), {
                message: "Last Name is invalid"
            })
        ,
        dateOfBirth: z
            .string()
            .min(1, { message: "Date of birth is missing" })
            .refine(
                (val) => {
                    const date = new Date(val);
                    return differenceInYears(new Date(), date) >= 18;
                },
                { message: "User is under 18." }
            ),
        joinedDate: z
            .string()
            .min(1, { message: "Joined Date is missing" })
            .refine(
                (val) => {
                    const date = new Date(val);
                    return !isWeekend(date);
                },
                {
                    message:
                        "Joined date cannot be Saturday or Sunday. Please select a different date",
                }
            ),
        type: z.string().min(1, { message: "Type is missing" }),
        location: z.string().optional()
    })
    .superRefine((values, ctx) => {
        const dobDate = new Date(values.dateOfBirth);
        const joinedDate = new Date(values.joinedDate);

        if (differenceInYears(joinedDate, dobDate) < 18) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                    "Joined date is not later than Date of Birth. Please select a different date",
                path: ["joinedDate"],
            });
        }

        if (isAfter(dobDate, joinedDate)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                    "Joined date is not later than Date of Birth. Please select a different date",
                path: ["joinedDate"],
            });
        }
    });

interface FormData {
    name: string;
    category: string;
    specification: string;
    installedDate: string;
    state: State;
}

const CreateAsset = () => {
    const [createUserMutation] = useMutation(CREATE_USER_MUTATION);
    const { setLoading }: any = useLoading();

    const [showModalCancel, setShowModalCancel] = useState(false);
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [abbreviation, setAbbreviation] = useState("");
    const router = useRouter();

    const handleCloseCancelModal = () => {
        setShowModalCancel(false);
    };

    const handleDiscard = () => {
        form.reset();
        setShowModalCancel(false);
        router.push("/user");
    };

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

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            category: "",
            specification: "",
            installedDate: "",
            state: State.AVAILABLE,
        },
    });

    useEffect(() => {
        const words = newCategory.split(" ");
        const abbreviation = words.map(word => word.charAt(0)).join("").toUpperCase();
        setAbbreviation(abbreviation);
    }, [newCategory]);

    const allFieldsFilled = !!form.watch("name") &&
        !!form.watch("category") &&
        !!form.watch("specification") &&
        !!form.watch("installedDate") &&
        (!!form.watch("state"));

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            const capitalizedName = capitalize(data.name);
            const capitalizedCategory = capitalize(data.category);

            const variables: any = {
                createUserInput: {
                    name: capitalizedName,
                    category: capitalizedCategory,
                    specification: data.specification,
                    installedDate: data.installedDate,
                    state: data.state,
                }
            };

            const response = await createUserMutation({ variables });
            console.log("Response from FE: ", response);

            if (response.errors) {
                response.errors.forEach((error: any) => {
                    console.error(`GraphQL error message: ${error.message}`);
                });
            } else {
                // Save user ID to local storage
                const userId = response.data.createUser.id;
                localStorage.setItem('userId', userId);

                toast.success("Create User Successfully");
                console.log('User created successfully:', response);

                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const newUser = {
                    ...response.data.createUser,
                    index: users.length + 1
                };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                router.push('/user')
            }
        } catch (error) {
            toast.error("Something went wrong! Please try again");
            console.error('Error creating user:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="ml-14 w-1/2 space-y-6">
                <h1 className="text-nashtech font-semibold mb-5">Create New Asset</h1>
                <Form {...form}>
                    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
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
                                            <>
                                                <Select
                                                    {...field}
                                                    value={field.value}
                                                    onValueChange={field.onChange}>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            className="cursor-pointer"
                                                            ref={field.ref}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-graycustom2 text-black w-full">
                                                        <SelectItem value="laptop">Laptop</SelectItem>
                                                        <SelectItem value="monitor">Monitor</SelectItem>
                                                        <SelectItem value="personal-computer">Personal Computer</SelectItem>
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
                                                </Select>
                                            </>
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
                                        <FormLabel className="w-[110px]">State</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                {...field}
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                className="cursor-pointer">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value={State.AVAILABLE} id="option-one" />
                                                    <Label htmlFor="option-one" className="">Available</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value={State.NOT_AVAILABLE}
                                                        id="option-two"
                                                    />
                                                    <Label htmlFor="option-two">Not Available</Label>
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
                                disabled={!allFieldsFilled}>
                                Save
                            </Button>
                            <Button type="button" onClick={() => setShowModalCancel(true)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
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

export default CreateAsset;
