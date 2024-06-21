'use client'
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

import { useAuth } from "@providers/auth";

enum Gender {
  Male = "MALE",
  Female = "FEMALE",
  Other = "OTHER",
}

enum Type {
  Admin = "ADMIN",
  Staff = "USER",
}

enum Location {
    HCM = "HCM",
    HN = "HN",
    DN = "DN"
}

enum Location {
    HCM = "HCM",
    HN = "HN",
    DN = "DN"
}

const formSchema: ZodSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First Name is missing" })
      .regex(/^[a-zA-Z0-9_ ]+$/, {
        message: "Must contain only alphabetic characters",
      })
      .max(128, {
        message: "First Name can't be more than 128 characters",
      }),
    lastName: z
      .string()
      .min(1, { message: "Last Name is missing" })
      .regex(/^[a-zA-Z0-9_ ]+$/, {
        message: "Must contain only alphabetic characters",
      })
      .max(128, {
        message: "Last Name can't be more than 128 characters",
      }),
    dateOfBirth: z
      .string()
      .min(1, { message: "Date of birth is missing" })
      .refine(
        (val) => {
          const date = new Date(val);
          return differenceInYears(new Date(), date) >= 18;
        },
        { message: "User is under 18. Please select a different date" }
      ),
    gender: z.nativeEnum(Gender, { message: "Gender is missing" }),
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
  
    if (values.type === Type.Admin && !values.location) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Location is required when Type is Admin",
            path: ["location"],
        });
    }

    if (values.type === Type.Admin && !values.location) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Location is required when Type is Admin",
            path: ["location"],
        });
    }
});

interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  joinedDate: string;
  type: Type;
    location: Location
}

const CreateUser = () => {
    const [createUserMutation] = useMutation(CREATE_USER_MUTATION);
    const { setLoading }: any = useLoading()

  const [showModalCancel, setShowModalCancel] = useState(false);
  const router = useRouter();
  const {setActiveItem} = useAuth();

  useEffect(() => {
    setActiveItem({ name: "Manage User", path: "/user" });
  }, []);

  const handleCloseCancelModal = () => {
    setShowModalCancel(false);
  };

  const handleDiscard = () => {
    form.reset();
    setShowModalCancel(false);
    router.push("/user");
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: Gender.Female,
      joinedDate: "",
      type: Type.Staff,
            location: Location.HCM 
    },
  });

    const allFieldsFilled = !!form.watch("firstName") && !!form.watch("lastName") && !!form.watch("dateOfBirth") && !!form.watch("gender") && !!form.watch("joinedDate") && (!!form.watch("location") || form.watch("type") === Type.Staff);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            console.log(data);
            
            const variables: any = {
                createUserInput: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    gender: data.gender,
                    joinedDate: data.joinedDate,
                    dateOfBirth: data.dateOfBirth,
                    type: data.type,
                }
            };
    
            if (data.type === Type.Admin) {
                variables.createUserInput.location = data.location;
            }
    
            const response = await createUserMutation({ variables });
            console.log("Response from FE: ", response);
    
            if (response.errors) {
                response.errors.forEach((error: any) => {
                    console.error(`GraphQL error message: ${error.message}`);
                });
            } else {
                router.push('/user');
                toast.success("Create User Successfully");
                console.log('User created successfully:', response);
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
      <div className="-mt-8 ml-14 w-1/2">
        <h1 className="text-nashtech font-semibold mb-5">Create New User</h1>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center gap-5 cursor-pointer">
                    <FormLabel className="w-[120px]">First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        className={`cursor-pointer ${
                          fieldState.error ? "border-nashtech" : ""
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
              name="lastName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center gap-5">
                    <FormLabel className="w-[120px]">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        className={`cursor-pointer ${
                          fieldState.error ? "border-nashtech" : ""
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
              name="dateOfBirth"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center gap-5">
                    <FormLabel className="w-[120px]">Date Of Birth</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Select a date"
                        {...field}
                        type="date"
                        className={`flex justify-end cursor-pointer flex-col ${
                          fieldState.error ? "border-nashtech" : ""
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
              name="gender"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="w-[110px]">Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        {...field}
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={Gender.Male} id="option-one" />
                          <Label htmlFor="option-one">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={Gender.Female}
                            id="option-two"
                          />
                          <Label htmlFor="option-two">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={Gender.Other}
                            id="option-three"
                          />
                          <Label htmlFor="option-three">Other</Label>
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
            <FormField
              control={form.control}
              name="joinedDate"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center gap-5">
                    <FormLabel className="w-[120px]">Joined Date</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        type="date"
                        className={`flex justify-end cursor-pointer flex-col ${
                          fieldState.error ? "border-nashtech" : ""
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
              name="type"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center gap-5 mt-14">
                    <FormLabel className="w-[120px]">Type</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={Type.Staff}>
                        <SelectTrigger>
                          <SelectValue
                            className="cursor-pointer"
                            ref={field.ref}
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-black text-white">
                          <SelectItem value={Type.Admin}>Admin</SelectItem>
                          <SelectItem value={Type.Staff}>Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage className="text-nashtech float-left ml-26">
                    {fieldState.error?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
                        {form.watch("type") === Type.Admin && (
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <div className="flex items-center gap-5 mt-12">
                                            <FormLabel className="w-[120px]">Location</FormLabel>
                                            <FormControl>
                                                <Select
                                                    {...field}
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue className="cursor-pointer" ref={field.ref} />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-black text-white">
                                                        <SelectItem value={Location.HCM}>Ho Chi Minh</SelectItem>
                                                        <SelectItem value={Location.HN}>Ha Noi</SelectItem>
                                                        <SelectItem value={Location.DN}>Da Nang</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <FormMessage className="text-nashtech float-left ml-26">
                                            {fieldState.error?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        )}
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

export default CreateUser;
