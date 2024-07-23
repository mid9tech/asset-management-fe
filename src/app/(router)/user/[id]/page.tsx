/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import { useEffect, useState } from "react";
import DetailModal from "@components/modal";
import { useRouter } from "next/navigation";
import { EDIT_USER_MUTATION, GET_USER_BY_ID_QUERY } from "@services/user";
import { useMutation, useQuery } from "@apollo/client";
import { useLoading } from "@providers/loading";
import { useAuth } from "@providers/auth";
import { menuItem } from "../../../../types/menu.type";
import { usePushUp } from "../pushUp";
import { User } from "../../../../__generated__/graphql";
import { USER_PATH_DEFAULT } from "../../../../constants";
import { Gender, Location, Type } from "../../../../types/enum.type";
import { formSchema } from "./schema";
import { formatText } from "@utils/formatText";

interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  joinedDate: string;
  type: Type;
  location: Location;
}

const EditUser = ({ params }: { params: { id: string } }) => {
  const { pushUp }: any = usePushUp();
  const [editUserMutation] = useMutation(EDIT_USER_MUTATION);
  const { setLoading }: any = useLoading();
  const [showModalCancel, setShowModalCancel] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();
  const { setActiveItem, menuItems } = useAuth();
  setLoading(false);

  const { data: userData, error } = useQuery(GET_USER_BY_ID_QUERY, {
    variables: { id: parseInt(params.id, 10) },
  });

  if (error) router.push("/error");

  const [dataUpdate, setDataUpdate] = useState<FormData | null>(null);

  useEffect(() => {
    if (menuItems) {
      setActiveItem(
        menuItems?.find((item) => item.component === "User") as menuItem
      );
    }
    if (userData) {
      if (userData?.user?.type == "Admin") {
        alert("me");
      }
      setDataUpdate(userData.user);
    }
  }, [userData, setActiveItem]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (userData) {
      setDataUpdate({
        ...userData.user,
        dateOfBirth: new Date(parseInt(userData.user.dateOfBirth))
          .toISOString()
          .substring(0, 10),
        joinedDate: new Date(parseInt(userData.user.joinedDate))
          .toISOString()
          .substring(0, 10),
      });
      if (userData.user.type == Type.Admin) {
        router.back();
      }
    }
  }, [userData]);

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
    defaultValues: dataUpdate || {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: Gender.Female,
      joinedDate: "",
      type: Type.Staff,
      location: Location.HCM,
    },
  });

  useEffect(() => {
    if (dataUpdate) {
      form.reset(dataUpdate);
    }
  }, [dataUpdate]);

  const allFieldsFilled =
    !!form.watch("firstName") &&
    !!form.watch("lastName") &&
    !!form.watch("dateOfBirth") &&
    !!form.watch("gender") &&
    !!form.watch("joinedDate") &&
    (!!form.watch("location") || form.watch("type") === Type.Staff);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const variables: any = {
        id: parseFloat(params.id),
        updateUserInput: {
          gender: data.gender,
          joinedDate: data.joinedDate,
          dateOfBirth: data.dateOfBirth,
          type: data.type,
        },
      };

      if (data.type === Type.Admin) {
        variables.updateUserInput.location = data.location;
      }

      const response = await editUserMutation({ variables });

      if (response.errors) {
        response.errors.forEach((error: any) => {
          console.error(`GraphQL error message: ${error.message}`);
        });
      } else {
        const userId = response.data.updateUser.id;
        pushUp(parseInt(userId));
        router.push(USER_PATH_DEFAULT);
        toast.success("Edit User Successfully");
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="ml-14 w-1/2">
        <h1 className="text-gradient font-semibold mb-5">Edit User</h1>
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
                        disabled
                        className={`cursor-pointer bg-input-gray ${fieldState.error ? "border-nashtech" : ""
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
                        disabled
                        className={`cursor-pointer bg-input-gray ${fieldState.error ? "border-nashtech" : ""
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
                  <FormMessage className="text-gradient float-left ml-26">
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
                        defaultValue={Gender.Male}
                        className="flex cursor-pointer"
                      >
                        {Object.values(Gender).map((type, index) => (
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
                  <FormMessage className="text-gradient float-left ml-26">
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
                      <FormLabel className="w-[120px]">Location</FormLabel>
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
                className="bg-custom-gradient text-white mr-4 cursor-pointer"
                disabled={!allFieldsFilled}
              >
                Save
              </Button>
              <Button variant="outline" type="button" onClick={() => setShowModalCancel(true)}>
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
            variant="outline"
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

export default EditUser;
