/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { ASSIGNMENT_STATUS } from "../../../types/enum.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@providers/auth";
import { CreateAssignmentType } from "../../../types/assignment.type";
import { TextArea } from "@components/ui/text-area";

const CreateAssignment = () => {
  const { user } = useAuth();

  const form = useForm<CreateAssignmentType>({
    // resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      assetCode: "",
      assetName: "",
      assetId: 0,
      assignedToId: 0,
      assignedById: user?.id,
      state: ASSIGNMENT_STATUS.WAITING_FOR_ACCEPTANCE,
      assignedDate: "",
      note: ""

    },
  });
  return (
    <>
      <div className="ml-14 w-1/2 space-y-6">
        <h1 className="text-nashtech font-semibold mb-5">
          Create New Asignment
        </h1>
        <Form {...form}>
          <FormField
            name="assignedToId"
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="flex items-center gap-5 cursor-pointer">
                  <FormLabel className="w-[120px]">User</FormLabel>
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
            name="asset"
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="flex items-center gap-5 cursor-pointer">
                  <FormLabel className="w-[120px]">Asset</FormLabel>
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
              name="assignedDate"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center gap-5">
                    <FormLabel className="w-[120px]">Assigned Date</FormLabel>
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
            <FormField
              control={form.control}
              name="note"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center gap-5">
                    <FormLabel className="w-[120px]">Note</FormLabel>
                    <FormControl>
                      <TextArea/>
                    </FormControl>
                  </div>
                  <FormMessage className="text-nashtech float-left ml-26">
                    {fieldState.error?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
        </Form>
      </div>
    </>
  );
};

export default CreateAssignment;
