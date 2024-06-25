import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { AssignmentType } from "../../../../types/assignment.type";
import { ASSIGNMENT_STATUS } from "../../../../types/enum.type";
import { useAuth } from "@providers/auth";
import { TextArea } from "@components/ui/text-area";

interface CreateFormProps {
  setShowModalConfirm: (value: boolean) => void;
}

const CreateForm: FC<CreateFormProps> = (props) => {
  const { setShowModalConfirm } = props;
  const { user } = useAuth();

  const form = useForm<AssignmentType>({
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
      note: "",
    },
  });

  return (
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
            <div className="flex items-center">
              <FormLabel className="w-[150px]">Assigned Date</FormLabel>
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
            <div className="flex items-start gap-5">
              <FormLabel className="w-[120px]">Note</FormLabel>
              <FormControl>
                <TextArea />
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
        <Button
          onClick={() => setShowModalConfirm(true)}
          type="button"
          variant="outline">
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default CreateForm;
