import DetailModal from "@components/modal";
import { Button } from "@components/ui/button";
import React, { FC } from "react";

interface ModalConfirmProps {
  showModalConfirm: boolean;
  setShowModalConfirm: (value: boolean) => void;
  handleDelete: () => void;
}

const ModalConfirmDeleteAssignment: FC<ModalConfirmProps> = (props) => {
  const { showModalConfirm, setShowModalConfirm, handleDelete } = props;
  return (
    <DetailModal
      isOpen={showModalConfirm}
      isShowCloseIcon={false}
      onClose={() => setShowModalConfirm(false)}
      title="Are you sure ?"
    >
      <div className="bg-white sm:p-6 sm:pb-4">
        <p className="text-md text-gray-500">
          Do you want to delete this assignment?
        </p>
      </div>
      <div className="bg-gray-50 sm:flex sm:flex-row-reverse gap-4">
        <Button
          type="button"
          variant="outline"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={() => setShowModalConfirm(false)}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleDelete}
          className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
        >
          Delete
        </Button>
      </div>
    </DetailModal>
  );
};

export default ModalConfirmDeleteAssignment;
