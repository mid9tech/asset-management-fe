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
  AssignmentType,
  IAssignmentForm,
} from "../../../../types/assignment.type";
import { ASSIGNMENT_STATUS } from "../../../../types/enum.type";
import { useAuth } from "@providers/auth";
import { TextArea } from "@components/ui/text-area";
import {
  Asset,
  CreateAssignmentInput,
  User,
} from "../../../../__generated__/graphql";
import ModalUserPicker from "../modal/modalPickUser";
import ModalPikcAsset from "../modal/modalPickAsset";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateCreateSchema } from "../../create/validation";
import { useLoading } from "@providers/loading";
import { createAssignment } from "@services/assignment";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { usePushUp } from "../../pushUp";

interface CreateFormProps {
  setShowModalConfirm: (value: boolean) => void;
}

const CreateForm: FC<CreateFormProps> = (props) => {
  const { setShowModalConfirm } = props;
  const { setLoading }: any = useLoading();
  const {pushUp}: any = usePushUp()

  const route = useRouter();

  const [openModalUser, setOpenModalUser] = useState(false);
  const [openModalAsset, setOpenModalAsset] = useState(false);

  const [userSelected, setUserSelected] = useState<User>();
  const [assetSelected, setAssetSelected] = useState<Asset>();

  const form = useForm<IAssignmentForm>({
    resolver: zodResolver(validateCreateSchema),
    mode: "onChange",
    defaultValues: {
      asset: null,
      user: null,
      assignedDate: new Date().toISOString().slice(0, 10),
      note: "",
    },
  });

  const allFieldsFilled =
    !!userSelected && !!assetSelected && !!form.watch("assignedDate");

  const onSubmit = async (value: IAssignmentForm) => {
    setLoading(true);
    const variables: CreateAssignmentInput = {
      assetCode: assetSelected?.assetCode || "",
      assetName: assetSelected?.assetName || "",
      assetId: parseInt(assetSelected?.id as string),
      assignedToId: parseInt(userSelected?.id as string),
      assignedToUsername: userSelected?.username || "",
      assignedDate: value.assignedDate,
      note: value.note || "",
    };
    console.log("value: ", variables);
    const { data }: any = await createAssignment(variables);

    if (data) {
      pushUp(data?.id)
      setLoading(false);
      toast.success("Assignment created success");
      route.push("/assignment");
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
              <ModalPikcAsset
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
                  <TextArea id="note-assignment" {...field} />
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
