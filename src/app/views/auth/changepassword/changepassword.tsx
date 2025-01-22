import { useForm } from "@mantine/form";
import Changepasswordpage from "./changepasswordpage";
import { ResetPasswordValues } from "@/types/app/auth/auth.types";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import { ServerErrorResponse } from "@/types/server/server.main.types";
import { useResetPasswordMutation } from "@/lib/store/services/auth/auth.api";
import { useAuth } from "@/hooks/auth/auth.hooks";
import { notifier } from "@/lib/utils/notify/notification";
import { useAppDispatch } from "@/hooks/store.hooks";
import { logOut } from "@/lib/store/services/auth/auth.slice";
import { Navigate } from "react-router";

const ChangePassword = () => {
  const [Reset] = useResetPasswordMutation({});
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const form = useForm<ResetPasswordValues>({
    initialValues: {
      password: "",
      confirmpassword: "",
    },
    validate: {
      password: (value) => (value.length <= 0 ? "Password is required" : null),
      confirmpassword: (value) =>
        value.length <= 0 ? "Password is required" : null,
    },
  });
  const HandleSubmit = async (values: ResetPasswordValues) => {
    try {
      if (!user) {
        throw new Error("No user found");
      }
      const response = await Reset({ ...values, userId: user.id });
      if (response.error) {
        throw response.error;
      }
      form.reset();
      notifier.success({ message: String(response.data.msg) });
      dispatch(logOut());
    } catch (error) {
      HandleError(error as ServerErrorResponse);
    }
  };

  if (user?.adminCreated != 1) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Changepasswordpage form={form} HandleSubmit={HandleSubmit} />;
};

export default ChangePassword;
