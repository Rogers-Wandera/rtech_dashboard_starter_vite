import {
  RowMenuItems,
  TableColumns,
} from "@/components/tables/configs/mrtconfigs/shared.config";
import { User } from "@/types/app/core/user.type";
import { IconLock, IconLockOff, IconCheck } from "@tabler/icons-react";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { MRT_Row } from "material-react-table";
import {
  IAuthUser,
  ServerErrorResponse,
  ServerResponse,
} from "@/types/server/server.main.types";
import zod from "zod";
import { PostDataPayload } from "@/hooks/data/usemutatehook";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import { notifier } from "@/lib/utils/notify/notification";
import { useAppDispatch } from "@/hooks/store.hooks";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import ConfirmModal from "@/components/shared/dialogs/confirm";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { IconLockFilled } from "@tabler/icons-react";
import { useAuth } from "@/hooks/auth/auth.hooks";
import { logOut } from "@/lib/store/services/auth/auth.slice";
import { helpers } from "@/lib/utils/helpers/helper";
import { useNavigate } from "react-router";
import { USE_MUTATE_METHODS } from "@/types/enums/enum.types";
import { useMRTTableContext } from "@/lib/context/table/mrttable.context";
import { Dispatch, SetStateAction } from "react";

export const userscolumns: TableColumns<User>[] = [
  { accessorKey: "image", header: "Image", type: "text" },
  { accessorKey: "userName", header: "Full Name", type: "text" },
  { accessorKey: "gender", type: "select", header: "Gender" },
  { accessorKey: "verified", type: "text", header: "Verified" },
  { accessorKey: "position", type: "text", header: "Position" },
  { accessorKey: "last_active", type: "text", header: "Last Seen" },
];

export const usermenuitems = ({
  user,
  refetch,
  postAsync,
  open,
  setRow,
}: {
  user: IAuthUser | null;
  refetch: () => void;
  postAsync: UseMutateAsyncFunction<
    ServerResponse,
    AxiosError<ServerErrorResponse, any>,
    PostDataPayload<unknown>,
    unknown
  >;
  open: () => void;
  setRow: Dispatch<SetStateAction<MRT_Row<User> | null>>;
}): RowMenuItems<User>[] => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {} = useMRTTableContext();

  const { user: AuthUser } = useAuth();
  const HandleResetPassword = (row: MRT_Row<User>) => {
    return ConfirmModal({
      message: `Are you certain, you want to resend the reset password email 
      to ${row.original.userName}?, this action cannot be undone`,
      onConfirm: async () => {
        try {
          dispatch(setLoading(true));
          const endPoint = `core/auth/users/resetlink?admin=1&userId=${row.original.id}`;
          const response = await postAsync({
            endPoint,
            payload: {},
          });
          notifier.success({ message: response?.msg as string });
          refetch();
          dispatch(setLoading(false));
          if (AuthUser?.id === row.original.id) {
            dispatch(logOut());
          }
        } catch (error) {
          dispatch(setLoading(false));
          HandleError(error as ServerErrorResponse);
        }
      },
    });
  };

  const HandleResendVerification = (row: MRT_Row<User>) => {
    return ConfirmModal({
      message: `Are you certain, you want to resend the verification email 
      to ${row.original.userName}?, this action cannot be undone`,
      onConfirm: async () => {
        try {
          dispatch(setLoading(true));
          const endPoint = `core/auth/users/verification/resend/${row.original.id}?admin=1`;
          const response = await postAsync({
            endPoint,
            payload: {},
          });
          notifier.success({ message: response?.msg as string });
          refetch();
          dispatch(setLoading(false));
        } catch (error) {
          dispatch(setLoading(false));
          HandleError(error as ServerErrorResponse);
        }
      },
    });
  };
  const HandleConfirmLock = (row: MRT_Row<User>) => {
    if (row.original.isLocked == 1) {
      return ConfirmModal({
        message: `Are you certain, you want to unlock
       the user,  this will grant the user  access to the system again.
      `,
        onConfirm: async () => {
          try {
            dispatch(setLoading(true));

            const endPoint = `core/auth/users/lock/${row.original.id}`;
            const response = await postAsync({
              endPoint,
              payload: { isLocked: 0 },
              method: USE_MUTATE_METHODS.PATCH,
            });
            notifier.success({ message: response?.msg as string });
            refetch();
            dispatch(setLoading(false));
          } catch (error) {
            dispatch(setLoading(false));
            HandleError(error as ServerErrorResponse);
          }
        },
        type: "danger",
      });
    }
    open();
    setRow(row);
  };
  return [
    {
      label: (row: MRT_Row<User>) =>
        row.original.isLocked === 1 ? "UnLock" : "Lock",
      icon: (row: MRT_Row<User>) =>
        row.original.isLocked === 1 ? <IconLockOff /> : <IconLock />,
      onClick: HandleConfirmLock,
      render: (row: MRT_Row<User>) =>
        row.original.id === user?.id ? false : true,
    },
    {
      label: "Manage",
      icon: <ManageAccountsIcon color="secondary" />,
      onClick: (row) => {
        const url = "/dashboard/core/auth/user";
        const encrypted = helpers.encryptUrl(row.original.id as string);
        navigate(`${url}/${encrypted}`);
      },
      render: (row) =>
        row.original.isLocked === 0 && row.original.verified === 1
          ? true
          : false,
    },
    {
      label: "Verification Link",
      icon: <IconCheck />,
      onClick: HandleResendVerification,
      render: (row) =>
        row.original.verified === 0 && row.original.isLocked === 0
          ? true
          : false,
    },
    {
      label: "Reset Password",
      icon: <IconLockFilled />,
      onClick: HandleResetPassword,
      render: (row) =>
        row.original.verified === 1 && row.original.isLocked === 0
          ? true
          : false,
    },
  ];
};

export const user_schema = zod.object({
  firstname: zod.string().min(1, { message: "Firstname is required" }),
  lastname: zod.string().min(1, { message: "Lastname is required" }),
  positionId: zod.string().min(1, { message: "Position is required" }),
  tel: zod
    .string()
    .min(1, { message: "Tel number is required" })
    .regex(/^\d{9}$/, "Phone number must be exactly 9 digits"),
  gender: zod.string().min(1, { message: "Gender is required" }),
  email: zod.string().min(1, { message: "Email is required" }),
  password: zod.string().min(1, { message: "Password is required" }),
  confirmpassword: zod
    .string()
    .min(1, { message: "Confirm Password is required" }),
});

export type userformtype = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmpassword: string;
  gender: string;
  positionId: string;
  tel: string;
};
