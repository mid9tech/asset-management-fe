import { ASSIGNMENT_STATUS } from "./enum.type";
export type AssignmentType = {
  assetCode: string;
  assetName: string;
  assetId: number;
  assignedToId: string;
  assignedById: number;
  state: ASSIGNMENT_STATUS;
  assignedDate: string;
  note: string;
};
