/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import ModalConfirmAssignment from "../components/modal/modalConfirm";
import { useLoading } from "@providers/loading";
import EditForm from "../components/form/editForm";

const CreateAssignment = () => {
  const { setLoading }: any = useLoading();
  setLoading(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);

  return (
    <>
      <div className="ml-14 w-1/2 space-y-6">
        <h1 className="text-nashtech font-semibold mb-5">
          Edit Assignment
        </h1>
        <EditForm setShowModalConfirm={setShowModalConfirm} />
        <ModalConfirmAssignment
          showModalConfirm={showModalConfirm}
          setShowModalConfirm={setShowModalConfirm}
        />
      </div>
    </>
  );
};

export default CreateAssignment;
