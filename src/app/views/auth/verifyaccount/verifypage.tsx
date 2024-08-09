import verifyimage from "@/assets/images/auth/03.jpeg";
import ErrorImage from "@/assets/images/error/PngItem_2529729.png";
import { useResendVerificationLinkMutation } from "@/lib/store/services/auth/auth.api";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import { helpers } from "@/lib/utils/helpers/helper";
import { notifier } from "@/lib/utils/notify/notification";
import { ServerErrorResponse } from "@/types/server/server.main.types";
import { Box, Image } from "@mantine/core";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

type props = {
  resend: boolean;
  userId: string;
  setResend: React.Dispatch<React.SetStateAction<boolean>>;
};

function VerifyPage({ resend, userId, setResend }: props) {
  const [Resend] = useResendVerificationLinkMutation({});
  const navigate = useNavigate();
  const HandleResendLink = async () => {
    try {
      const decrypt = helpers.decryptUrl(userId);
      const response = await Resend({ userId: decrypt });
      if (response.error) {
        throw response.error;
      }
      setResend(false);
      navigate("/");
      notifier.success({ message: response.data.emailsent });
    } catch (error) {
      HandleError(error as ServerErrorResponse);
    }
  };
  return (
    <div className="rtw-bg-white">
      <div className="rtw-mx-auto rtw-max-w-7xl rtw-py-6 sm:rtw-px-6 sm:rtw-py-10 lg:rtw-px-6">
        <div className="rtw-relative rtw-isolate rtw-overflow-hidden rtw-bg-gray-900 rtw-px-6 rtw-pt-16 rtw-shadow-2xl sm:rtw-rounded-3xl sm:rtw-px-16 md:rtw-pt-24 lg:rtw-flex lg:rtw-gap-x-20 lg:rtw-px-24 lg:rtw-pt-0">
          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="rtw-absolute rtw-left-1/2 rtw-top-1/2 -rtw-z-10 rtw-h-[64rem] rtw-w-[64rem] -rtw-translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:rtw-left-full sm:-rtw-ml-80 lg:rtw-left-1/2 lg:rtw-ml-0 lg:-rtw-translate-x-1/2 lg:rtw-translate-y-0"
          >
            <circle
              r={512}
              cx={512}
              cy={512}
              fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
          <div className="rtw-mx-auto rtw-max-w-md rtw-text-center lg:rtw-mx-0 lg:rtw-flex-auto lg:rtw-py-32 lg:rtw-text-left">
            <h2 className="rtw-text-3xl rtw-font-bold rtw-tracking-tight rtw-text-white sm:rtw-text-4xl">
              {resend ? "The token has already expired" : "Hello Username"}
              <br />
              {resend
                ? "please generate new one"
                : "Your account has been verified"}
            </h2>
            <p className="rtw-mt-6 rtw-text-lg rtw-leading-8 rtw-text-gray-300">
              {resend
                ? "Please click the button below to generate link again"
                : "Please navigate back to login and access your dashboard"}
            </p>
            <div className="rtw-mt-10 rtw-flex rtw-items-center rtw-justify-center rtw-gap-x-6 lg:rtw-justify-start">
              {resend ? (
                <Button onClick={HandleResendLink}>Resend Link</Button>
              ) : (
                <Box className="rtw-mt-10 rtw-flex rtw-items-center rtw-justify-center rtw-gap-x-6 lg:rtw-justify-start">
                  <Link
                    to="/"
                    className="rtw-rounded-md rtw-bg-white rtw-px-3.5 rtw-py-2.5 rtw-text-sm rtw-font-semibold rtw-text-gray-900 rtw-shadow-sm rtw-hover:bg-gray-100 rtw-focus-visible:rtw-outline rtw-focus-visible:rtw-outline-2 rtw-focus-visible:rtw-outline-offset-2 rtw-focus-visible:rtw-outline-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/"
                    className="rtw-text-sm rtw-font-semibold rtw-leading-6 rtw-text-white"
                  >
                    Auto redirection in 2 seconds
                    <span aria-hidden="true">→</span>
                  </Link>
                </Box>
              )}
            </div>
          </div>
          <div className="rtw-relative rtw-mt-16 rtw-h-80 lg:rtw-mt-8">
            <Image
              alt={resend ? "resend" : "verified"}
              src={resend ? ErrorImage : verifyimage}
              w="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyPage;
