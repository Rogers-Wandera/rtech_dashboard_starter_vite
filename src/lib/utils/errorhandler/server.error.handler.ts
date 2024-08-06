import { ServerErrorResponse } from "@/types/server/server.main.types";
import { notifier } from "../notify/notification";
import { HelperClass } from "../helpers/helper";

export const HandleError = (error: ServerErrorResponse) => {
  const { isDevelopment } = new HelperClass().checkEnviroment();
  notifier.error({
    message: `${error.statusCode || 500} ${error.message}`,
  });
  if (isDevelopment) {
    console.log(error);
  }
};
