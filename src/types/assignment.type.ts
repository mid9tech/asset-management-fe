import { Asset, User } from "../__generated__/graphql";
import { ASSIGNMENT_STATUS } from "./enum.type";
export type AssignmentType = {
  assetCode: string;
  assetName: string;
  assetId: number;
  assignedToId: number;
  assignedById: number;
  state: ASSIGNMENT_STATUS;
  assignedDate: string;
  note: string;
};

export interface IAssignmentForm {
  user: User | null;
  asset: Asset | null;
  assignedDate: string;
}
