import Error401 from "@/app/components/error/error401";
import Error404 from "@/app/components/error/error404";
import { RouteObject } from "react-router-dom";

export const ErrorRoutes: RouteObject[] = [
  {
    path: "*",
    element: <Error404 />,
  },
  {
    path: "/unauthorized",
    element: <Error401 />,
  },
];
