import { useAuth } from "@/hooks/auth.hooks";
import {
  useGetUserModulesQuery,
  usePermissionsQuery,
} from "@/lib/store/services/auth/auth.api";
import { ROLES } from "@/types/enums/enum.types";
import { LoadingOverlay } from "@mantine/core";
import { useEffect } from "react";

function WithUserModules<P extends Object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function WithModules(props) {
    const { isLoggedIn, user } = useAuth();
    const { refetch, isLoading, isFetching, data } = useGetUserModulesQuery(
      String(user?.id),
      {
        skip: !isLoggedIn,
      }
    );
    // console.log(user?.roles);
    const {
      refetch: refetchPermissions,
      isLoading: isLoadingPermissions,
      isFetching: isFetchingPermissions,
      data: permissions,
    } = usePermissionsQuery(String(user?.id), {
      skip: !isLoggedIn || user?.roles.includes(ROLES.ADMIN),
    });

    useEffect(() => {
      if (isLoggedIn) {
        refetch();
      }
    }, [isLoggedIn]);

    useEffect(() => {
      if (isLoggedIn && !user?.roles.includes(ROLES.ADMIN)) {
        refetchPermissions();
      }
    }, [isLoggedIn, user]);

    if (
      isLoading &&
      isFetching &&
      isLoadingPermissions &&
      isFetchingPermissions &&
      !data &&
      !permissions
    ) {
      return (
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ color: "blue", type: "bars" }}
        />
      );
    }
    return <Component {...props} />;
  };
}

export default WithUserModules;
