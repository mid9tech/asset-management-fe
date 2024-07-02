/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import ModalConfirmAssignment from "../components/modal/modalConfirm";
import { useLoading } from "@providers/loading";
import EditForm from "../components/form/editForm";
import { Assignment } from "../../../__generated__/graphql";
import { loadDetailAssignment } from "@services/assignment";
import { toast } from "react-toastify";

const EditAssignment = ({ params }: { params: { id: string } }) => {
  const { setLoading }: any = useLoading();
  setLoading(false);

  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [assignment, setAssignment] = useState<Assignment>();

  useEffect(() => {
    loadAssignment(parseInt(params.id as string));
  }, [params.id]);

  const loadAssignment = async (id: number) => {
    const data = await loadDetailAssignment(id);
    if (!data) {
      toast.error("load failed");
      return;
    }
    const formattedAssignment = {
      ...data,
      assignedDate: new Date(parseInt(data.assignedDate))
        .toISOString()
        .slice(0, 10),
    };
    setAssignment(formattedAssignment);
  };

  return (
    <>
      <div className="ml-14 w-1/2 space-y-6">
        <h1 className="text-nashtech font-semibold mb-5">Edit Assignment</h1>
        <EditForm data={assignment} setShowModalConfirm={setShowModalConfirm} />
        <ModalConfirmAssignment
          showModalConfirm={showModalConfirm}
          setShowModalConfirm={setShowModalConfirm}
        />
      </div>
    </>
  );
};

export default EditAssignment;
