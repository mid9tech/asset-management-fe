import DetailModal from "@components/modal";
import { Button } from "@components/ui/button";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import { ASSIGNMENT_PATH_DEFAULT } from "../../../../constants";

interface ModalConfirmProps {
  showModalConfirm: boolean;
  setShowModalConfirm: (value: boolean) => void;
}

const ModalConfirmAssignment: FC<ModalConfirmProps> = (props) => {
  const { showModalConfirm, setShowModalConfirm } = props;
  const router = useRouter();
  const handleDiscard = () => {
    setShowModalConfirm(false);
    router.push(ASSIGNMENT_PATH_DEFAULT);
  };
  return (
    <DetailModal
      isOpen={showModalConfirm}
      onClose={() => setShowModalConfirm(false)}
      title="Are you sure ?">
      <div className="bg-white sm:p-6 sm:pb-4">
        <p className="text-md text-gray-500">Do you want to discard changes ?</p>
      </div>
      <div className="bg-gray-50 sm:flex sm:flex-row-reverse gap-4">
        <Button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={() => setShowModalConfirm(false)}>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleDiscard}
          className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
          Discard
        </Button>
      </div>
    </DetailModal>
  );
};

export default ModalConfirmAssignment;
