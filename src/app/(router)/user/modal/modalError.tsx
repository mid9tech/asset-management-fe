import DetailModal from "@components/modal";
import React, { FC } from "react";

interface Props {
  showModalConfirm: boolean;
  setShowModalConfirm: (value: boolean) => void;
}

const ModalError: FC<Props> = (props) => {
  const { showModalConfirm, setShowModalConfirm } = props;
  return (
    <DetailModal
      isOpen={showModalConfirm}
      onClose={() => setShowModalConfirm(false)}
      title="Cannot disable user">
      <div className="p-3">
        <div className="sm:flex sm:items-start">
          <span className="text-md text-gray-500">
            There are valid assignments belonging to this user. Please close all
            assignments before disabling user.
          </span>
        </div>
      </div>
    </DetailModal>
  );
};

export default ModalError;
