/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState } from "react";
import CreateForm from "../components/form/createForm";
import ModalConfirmAssignment from "../components/modal/modalConfirm";

const CreateAssignment = () => {
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  return (
    <>
      <div className="ml-14 w-1/2 space-y-6">
        <h1 className="text-nashtech font-semibold mb-5">
          Create New Asignment
        </h1>
        <CreateForm setShowModalConfirm={setShowModalConfirm} />
        <ModalConfirmAssignment
          showModalConfirm={showModalConfirm}
          setShowModalConfirm={setShowModalConfirm}
        />
      </div>
    </>
  );
};

export default CreateAssignment;
