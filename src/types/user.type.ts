import { USER_TYPE } from "./enum.type";

export type UserStoreType = {
  id: number;
  username: string;
  role: USER_TYPE;
  lastName: string;
  firstName: string;
  isActived: boolean;
}
