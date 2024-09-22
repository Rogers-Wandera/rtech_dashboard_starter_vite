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
import { useEffect, useState } from "react";
import { HelperClass } from "@/lib/utils/helpers/helper";
import { useAppDispatch } from "@/hooks/store.hooks";
import {
  setNextRoute,
  setRememberMe,
} from "@/lib/store/services/defaults/defaults";

const AuthLogin = () => {
  const helper = new HelperClass();
  const dispatch = useAppDispatch();
  const { isLoggedIn, token } = useAuth();
  const { email, password } = useSelector(
    (state: RootState) => state.appState.defaultstate.rememberMe
  );
  const router = useNavigate();
  const [rememberMe, setRemember] = useState(email !== "" && password !== "");
  const location = useLocation();
  const originalRoute = (location.state?.from as string) || "/dashboard";
  const route =
    originalRoute === "/unauthorized" ? "/dashboard" : originalRoute;

  const form = useForm<ILoginValues>({
    initialValues: {
      email: email !== "" ? helper.decrypt(email) : "",
      password: password !== "" ? helper.decrypt(password) : "",
    },
    validate: {
      email: (value) => (value.length <= 0 ? "Email is required" : null),
      password: (value) => (value.length <= 0 ? "Password is required" : null),
    },
  });
  const [Login] = useLoginMutation({});
  const app_name = useSelector(
    (state: RootState) => state.setting.setting.app_name.value
  );
  const handleSubmit = async (values: ILoginValues) => {
    try {
      const response = await Login(values);
      if (response.error) {
        throw response.error;
      }
      if (rememberMe) {
        dispatch(setRememberMe({ ...values }));
      }
      dispatch(setNextRoute(route));
      form.reset();
      router("/dashboard");
    } catch (error) {
      HandleError(error as ServerErrorResponse);
    }
  };

  useEffect(() => {
    if (rememberMe === false) {
      dispatch(setRememberMe({ email: "", password: "" }));
    }
  }, [rememberMe]);

  if (isLoggedIn && token && token !== "") {
    return <Navigate to={route} replace />;
  }
  return (
    <>
      <LoginPage
        rememberMe={rememberMe}
        setRememberMe={setRemember}
        app_name={app_name}
        form={form}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default AuthLogin;
