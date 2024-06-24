import { USER_TYPE } from "./enum.type";

interface User {
  username: string;
  id: number;
  role: string;
  firstName: string;
  lastName: string;
  isActived: boolean;
}

export type UserStoreType = {
  id: number;
  username: string;
  role: USER_TYPE;
  lastName: string;
  firstName: string;
  isActived: boolean;
}
