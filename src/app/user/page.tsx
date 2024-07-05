/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import UserManagement from "./view";
import { useLoading } from "@providers/loading";
import {
  Fragment,
  Suspense,
  useEffect,
  useState,
} from "react";
import { SORT_ORDER, USER_TYPE } from "../../types/enum.type";
import { loadData, loadDetail } from "@services/user";
import { User } from "../../__generated__/graphql";
import { redirect, usePathname, useRouter } from "next/navigation";
import { usePushUp } from "./pushUp";
import { formatUser } from "./formatUser";
import { USER_PATH_DEFAULT } from "../../constants";
import { toast } from "react-toastify";



export const dynamic = "force-dynamic";

export default function Index({
  searchParams,
}: {
  searchParams: {
    Type?: string[];
    query?: string;
    page?: string;
  };
}) {
  const { setLoading }: any = useLoading();
  const [listUser, setListUsers] = useState<User[]>();
  const filterType = searchParams?.Type || [];
  const queryString = searchParams?.query || "";
  const currentPage = searchParams?.page || '1';
  const [sortOrder, setSortOder] = useState(SORT_ORDER.ASC);
  const [sortBy, setSortBy] = useState("firstName");
  const [totalPages, setTotalPages] = useState<number>();
  const { pushUpId, pushUp }: any = usePushUp()
  const router = useRouter();
  useEffect(() => {
    pushUp(null);
    loadUserList();
  }, [searchParams, sortBy, sortOrder]);
  const loadUserList = async () => {
    try {
      setLoading(true);
      const newUserId = pushUpId
      let request: { [k: string]: any } = {};
      request.page = parseInt(currentPage);
      if (isNaN(request.page) || request.page < 1) {
        router.push(USER_PATH_DEFAULT)
        return
      }
      request.sort = sortBy;
      request.sortOrder = sortOrder;
      request.type = filterType;
      request.limit = 20
      if (queryString) {
        request.query = queryString;
      }
      let detailUser: any = null;
      //push item up
      if (newUserId) {
        detailUser = await loadDetail(newUserId);
      }

      const { data }: any = await loadData(request);
      if (detailUser) {
        const newUserIndex = data?.users.findIndex((user: User) => user.id === newUserId.toString());
        if (newUserIndex !== -1) {
          data?.users.splice(newUserIndex, 1);
        }
        detailUser.joinedDate = parseInt(detailUser?.joinedDate);
        detailUser.dateOfBirth = parseInt(detailUser?.dateOfBirth);
        data?.users.unshift(formatUser(detailUser));
      } else {
        pushUp(null)
      }
      //store data
      setTotalPages(data?.totalPages);
      setListUsers(data?.users);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }

  };
  return (
    <Fragment>
      <Suspense>
        <UserManagement
          data={listUser as User[]}
          totalPages={totalPages as number}
          currentPage={parseInt(currentPage)}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOder={setSortOder}
        />
      </Suspense>
    </Fragment>
  );
}
