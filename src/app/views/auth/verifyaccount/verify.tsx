import { Navigate, useNavigate, useParams } from "react-router-dom";
import VerifyPage from "./verifypage";
import { useVerifyAccountMutation } from "@/lib/store/services/auth/auth.api";
import { useAuth } from "@/hooks/auth.hooks";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import { ServerErrorResponse } from "@/types/server/server.main.types";
import { useTimeout } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { notifier } from "@/lib/utils/notify/notification";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

type params = { token: string; userId: string };

const VerifyAccount = () => {
  const loading = useSelector(
    (state: RootState) => state.appState.defaultstate.isLoading
  );
  const { token, isLoggedIn } = useAuth();
  const params = useParams() as params;
  const [resend, setResend] = useState(false);

  const [Verify] = useVerifyAccountMutation({});
  const navigate = useNavigate();
  const { start, clear } = useTimeout(() => navigate("/"), 2000);
  const hasVerified = useRef(false);

  const HandleVerifyUser = async () => {
    try {
      if (!token && !isLoggedIn && !hasVerified.current) {
        hasVerified.current = true;
        const response = await Verify({
          userId: encodeURIComponent(params.userId),
          token: encodeURIComponent(params.token),
        });
        if (response.error) {
          throw response.error;
        }
        notifier.success({ message: "Account has been verified" });
        start();
      }
    } catch (error) {
      const err = error as ServerErrorResponse;
      if (err.message.startsWith("User already")) {
        notifier.info({ message: "Account has already been verified" });
        navigate("/");
        return;
      } else if (err.message.includes("expired")) {
        setResend(true);
      }
      HandleError(error as ServerErrorResponse);
    }
  };

  useEffect(() => {
    HandleVerifyUser();
    return clear();
  }, []);

  if (loading) {
    return <div className="rtw-text-center">Loading...</div>;
  }

  if (token && isLoggedIn && token !== "") {
    return <Navigate to="/dashboard" />;
  }
  if (!params.token && !params.userId) {
    return <Navigate to="/" />;
  }
  return (
    <VerifyPage resend={resend} userId={params.userId} setResend={setResend} />
  );
};

export default VerifyAccount;
