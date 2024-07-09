/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { RadioGroup } from "@components/ui/radio-group";
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
import { Gender, Type, Location } from "../../../types/enum.type";
import { formSchema } from "./schema";
import { usePushUp, PushUp } from '../pushUp';
import { USER_PATH_DEFAULT } from "../../../constants";




interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  joinedDate: string;
  type: Type;
  location: Location;
}

const CreateUser = () => {
  const { pushUp }: any = usePushUp()
  const [createUserMutation] = useMutation(CREATE_USER_MUTATION);
  const [submissionInProgress, setSubmissionInProgress] = useState(false);
  const { setLoading }: any = useLoading();
  setLoading(false);

  const [showModalCancel, setShowModalCancel] = useState(false);
  const router = useRouter();

  const handleCloseCancelModal = () => {
    setShowModalCancel(false);
  };

  const handleDiscard = () => {
    form.reset();
    setShowModalCancel(false);
    router.back();
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
      location: Location.HCM,
    },
  });

  const allFieldsFilled =
    !!form.watch("firstName") &&
    !!form.watch("lastName") &&
    !!form.watch("dateOfBirth") &&
    !!form.watch("gender") &&
    !!form.watch("joinedDate") &&
    (!!form.watch("location") || form.watch("type") === Type.Staff);

  const onSubmit = async (data: FormData) => {
    if (submissionInProgress) return;
    setSubmissionInProgress(true);
    setLoading(true);

    try {
      const capitalize = (str: string) =>
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      const capitalizedFirstName = capitalize(data.firstName);
      const capitalizedLastName = capitalize(data.lastName);

      const variables: any = {
        createUserInput: {
          firstName: capitalizedFirstName,
          lastName: capitalizedLastName,
          gender: data.gender,
          joinedDate: data.joinedDate,
          dateOfBirth: data.dateOfBirth,
          type: data.type,
          location: data.location,
        },
      };

      if (data.type === Type.Admin) {
        variables.createUserInput.location = data.location;
      }

      const response = await createUserMutation({ variables });

      if (response.errors) {
        response.errors.forEach((error: any) => {
          console.error(`GraphQL error message: ${error.message}`);
        });
      } else {
        const userId = response.data.createUser.id;
        pushUp(parseInt(userId))
        // localStorage.setItem("newUserId", '"' + userId.toString() + '"');
        toast.success("Create User Successfully");
        router.push(USER_PATH_DEFAULT);
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again");
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="ml-14 w-1/2 space-y-6">
        <h1 className="text-nashtech font-semibold mb-5">Create New User</h1>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center gap-5 cursor-pointer">
                    <FormLabel className="w-[120px]">First Name <span className="text-red-500">*</span></FormLabel>
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
              name="lastName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center gap-5">
                    <FormLabel className="w-[120px]">Last Name <span className="text-red-500">*</span></FormLabel>
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
              name="dateOfBirth"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormLabel className="w-[125px]">Date Of Birth <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Select a date"
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
              name="gender"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="w-[110px]">Gender <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <RadioGroup
                        {...field}
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <label className="custom-radio flex h-[20px]">
                            <input
                              type="radio"
                              value={Gender.Male}
                              checked={field.value === Gender.Male}
                              onChange={field.onChange}
                              className={`focus:ring ${field.value === Gender.Male ? "border-nashtech" : ""}`}
                            />
                            <div className="checkmark mt-2"></div>
                            <Label htmlFor="option-one">Male</Label>
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="custom-radio flex h-[20px]">
                            <input
                              type="radio"
                              value={Gender.Female}
                              checked={field.value === Gender.Female}
                              onChange={field.onChange}
                              className={`focus:ring ${field.value === Gender.Female ? "border-nashtech" : ""}`}
                            />
                            <div className="checkmark mt-2"></div>
                            <Label htmlFor="option-one">Female</Label>
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="custom-radio flex h-[20px]">
                            <input
                              type="radio"
                              value={Gender.Other}
                              checked={field.value === Gender.Other}
                              onChange={field.onChange}
                              className={`focus:ring ${field.value === Gender.Other ? "border-nashtech" : ""}`}
                            />
                            <div className="checkmark mt-2"></div>
                            <Label htmlFor="option-one">Other</Label>
                          </label>
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
                    <FormLabel className="w-[120px]">Joined Date <span className="text-red-500">*</span></FormLabel>
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
            <FormField
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center gap-5 mt-14">
                    <FormLabel className="w-[120px]">Type <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={Type.Staff}
                      >
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
                      <FormLabel className="w-[120px]">Location <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue
                              className="cursor-pointer"
                              ref={field.ref}
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-black text-white">
                            <SelectItem value={Location.HCM}>
                              Ho Chi Minh
                            </SelectItem>
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
                disabled={!allFieldsFilled}
              >
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
        title="Are you sure"
      >
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
            onClick={() => setShowModalCancel(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            onClick={handleDiscard}
          >
            Discard
          </Button>
        </div>
      </DetailModal>
    </>
  );
};

export default CreateUser;
