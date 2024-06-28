import DetailModal from "@components/modal";
import { Button } from "@components/ui/button";
import React, { FC } from "react";

interface ModalConfirmProps {
  showModalConfirm: boolean;
  setShowModalConfirm: (value: boolean) => void;
  handleDisableUser: () => void;
}

const ModalConfirmUser: FC<ModalConfirmProps> = (props) => {
  const { showModalConfirm, setShowModalConfirm, handleDisableUser } = props;
  return (
    <DetailModal
      isOpen={showModalConfirm}
      onClose={() => setShowModalConfirm(false)}
      isShowCloseIcon={true}
      title="Are you sure ?">
      <div className="p-3">
        <div className="sm:flex sm:items-start">
          <p className="text-md text-gray-500">
            Do you want to disable this user?
          </p>
        </div>
      </div>
      <div className="sm:flex sm:flex-row gap-4">
        <Button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
          onClick={handleDisableUser}>
          Disable
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => setShowModalConfirm(false)}>
          Cancel
        </Button>
      </div>
    </DetailModal>
  );
};

export default ModalConfirmUser;
