import Modulelinks from "@/app/views/dashboard/core/system/modulelinks/modulelinks";
import Modules from "@/app/views/dashboard/core/system/modules/modules";
import ManagePositions from "@/app/views/dashboard/core/system/positions/positions";
import { ROLES } from "@/types/enums/enum.types";
import { RouteObject } from "react-router";

export const SystemRoutes: RouteObject = {
  path: "/dashboard/core/system",
  children: [
    { path: "positions", element: <ManagePositions /> },
    {
      path: "modules",
      element: <Modules roles={[ROLES.PROGRAMMER]} />,
    },
    {
      path: "modulelinks/:id",
      element: <Modulelinks roles={[ROLES.PROGRAMMER]} />,
    },
  ],
};
