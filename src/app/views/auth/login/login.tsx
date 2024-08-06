import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useForm } from "@mantine/form";
import { useLoginMutation } from "@/lib/store/services/auth/auth.api";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import LoginPage from "./loginpage";
import { ILoginValues } from "@/types/app/auth/auth.types";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ServerErrorResponse } from "@/types/server/server.main.types";
import { useAuth } from "@/hooks/auth.hooks";

const AuthLogin = () => {
  const { isLoggedIn, token } = useAuth();
  const location = useLocation();
  const originalRoute = (location.state?.from as string) || "/dashboard";

  const form = useForm<ILoginValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (value.length <= 0 ? "Email is required" : null),
      password: (value) => (value.length <= 0 ? "Password is required" : null),
    },
  });
  const [Login] = useLoginMutation({});
  const router = useNavigate();
  const app_name = useSelector(
    (state: RootState) => state.setting.setting.app_name.value
  );
  const handleSubmit = async (values: ILoginValues) => {
    try {
      const response = await Login(values);
      if (response.error) {
        throw response.error;
      }
      router(originalRoute, { replace: true });
    } catch (error) {
      HandleError(error as ServerErrorResponse);
    }
  };

  if (isLoggedIn && token && token !== "") {
    return <Navigate to={originalRoute} replace />;
  }
  return (
    <>
      <LoginPage app_name={app_name} form={form} handleSubmit={handleSubmit} />
    </>
  );
};

export default AuthLogin;
