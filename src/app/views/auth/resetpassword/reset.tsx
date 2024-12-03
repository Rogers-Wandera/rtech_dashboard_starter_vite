import { useForm } from "@mantine/form";
import ResetPasswordPage from "./resetpassword";
import { ResetPasswordValues } from "@/types/app/auth/auth.types";
import { useFromLinkResetPasswordMutation } from "@/lib/store/services/auth/auth.api";
import { Navigate, useNavigate, useParams } from "react-router";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import { ServerErrorResponse } from "@/types/server/server.main.types";
import { notifier } from "@/lib/utils/notify/notification";

type params = { token: string; userId: string };

const ResetPassword = () => {
  const [Reset] = useFromLinkResetPasswordMutation({});
  const params = useParams() as params;
  const navigate = useNavigate();
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
      const response = await Reset({
        token: encodeURIComponent(params.token),
        userId: encodeURIComponent(params.userId),
        ...values,
      });
      if (response.error) {
        const error = response.error as ServerErrorResponse;
        if (error.message.toLowerCase().includes("expired")) {
          navigate("/pwreset");
          notifier.error({
            message:
              "Password reset link has expired, please generate a new link",
          });
          return;
        }
        throw response.error;
      }
      const msg = response.data.msg;
      form.reset();
      notifier.success({ message: String(msg) });
      navigate("/");
    } catch (error) {
      HandleError(error as ServerErrorResponse);
    }
  };

  if (!params.token && !params.userId) {
    return <Navigate to="/" />;
  }
  return <ResetPasswordPage form={form} HandleSubmit={HandleSubmit} />;
};

export default ResetPassword;
