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
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import {
  IAssignmentForm,
} from "../../../types/assignment.type";
import {
  Asset,
  CreateAssignmentInput,
  User,
} from "../../../__generated__/graphql";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoading } from "@providers/loading";
import { createAssignment } from "@services/assignment";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { usePushUp } from "../pushUp";
import { validationSchema } from "./schema";
import ModalUserPicker from "../modal/modalPickUser";
import ModalAssetPicker from "../modal/modalPickAsset";
import { Badge } from '@components/ui/badge';

interface CreateFormProps {
  setShowModalConfirm: (value: boolean) => void;
}

const CreateForm: FC<CreateFormProps> = (props) => {
  const { setShowModalConfirm } = props;
  const { setLoading }: any = useLoading();
  const { pushUp }: any = usePushUp();

  const route = useRouter();

  const [openModalUser, setOpenModalUser] = useState(false);
  const [openModalAsset, setOpenModalAsset] = useState(false);
  const [submissionInProgress, setSubmissionInProgress] = useState(false);

  const [userSelected, setUserSelected] = useState<User>();
  const [assetSelected, setAssetSelected] = useState<Asset>();
  const [noteValue, setNoteValue] = useState<string>();
  const [inputText, setInputText] = useState("");
  const characterLimit = 200;
  const handleChange = (event: any) => {
    setInputText(event.target.value);
    form.setValue('note', event.target.value, { shouldValidate: true });
  };
  const form = useForm({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      asset: null,
      user: null,
      note: null,
      assignedDate: new Date().toISOString().slice(0, 10),
    },
  });

  const allFieldsFilled =
    !!userSelected && !!assetSelected && !!form.watch("assignedDate");

  const onSubmit = async (value: IAssignmentForm) => {
    if (submissionInProgress) return;
    setSubmissionInProgress(true);
    setLoading(true);
    const variables: CreateAssignmentInput = {
      assetCode: assetSelected?.assetCode || "",
      assetName: assetSelected?.assetName || "",
      assetId: parseInt(assetSelected?.id as string),
      assignedToId: parseInt(userSelected?.id as string),
      assignedToUsername: userSelected?.username || "",
      assignedDate: value.assignedDate,
      note: noteValue || "",
    };
    const { data }: any = await createAssignment(variables);
    if (data) {
      const assignmentId = data.id;
      pushUp(parseInt(assignmentId));
      toast.success("Assignment created successfully");
      route.push('/assignment');
    } else {
      toast.error("create assignment failed");
    }
  };
  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="user"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex items-center gap-5 cursor-pointer">
                <FormLabel className="w-[120px]">User</FormLabel>
                <FormControl>
                  <Button
                    id="select-user-assignment"
                    type="button"
                    variant="outline"
                    className="w-full flex justify-start"
                    onClick={() => setOpenModalUser(true)}>
                    {userSelected
                      ? userSelected.firstName + " " + userSelected.lastName
                      : ""}
                  </Button>
                </FormControl>
              </div>
              <ModalUserPicker
                isOpen={openModalUser}
                setOpenModal={setOpenModalUser}
                setUserSelected={setUserSelected}
              />
              <FormMessage className="text-nashtech float-left ml-26">
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="asset"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex items-center gap-5 cursor-pointer">
                <FormLabel className="w-[120px]">Asset</FormLabel>
                <FormControl>
                  <Button
                    id="select-asset-assignment"
                    type="button"
                    variant="outline"
                    className="w-full flex justify-start"
                    onClick={() => setOpenModalAsset(true)}>
                    {assetSelected ? assetSelected.assetName : ""}
                  </Button>
                </FormControl>
              </div>
              <ModalAssetPicker
                isOpen={openModalAsset}
                setOpenModal={setOpenModalAsset}
                setAssetSelected={setAssetSelected}
              />
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
                    id="assigned-date-assignment"
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
        <div className="flex flex-row justify-between items-start w-full gap-20">
          <label>Note</label>
          <textarea
            // onChange={(e) => setNoteValue(e.target.value)}
            id="note-assignment"
            rows={5}
            value={inputText}
            onChange={handleChange}
            maxLength={200}
            className="flex h-auto w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
          <div><Badge className='flex flex-row w-full gap-20 justify-end -mt-4 border-0 shadow-none'>{inputText.length}/{characterLimit}</Badge></div>
        <div className="float-right">
          <Button
            id="save-btn-assignment"
            type="submit"
            className="bg-nashtech text-white mr-4 cursor-pointer"
            disabled={!allFieldsFilled}>
            Save
          </Button>
          <Button
            id="cancel-btn-assignment"
            onClick={() => setShowModalConfirm(true)}
            type="button"
            variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateForm;
