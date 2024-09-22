import { useAuth } from "@/hooks/auth.hooks";
import { useGetUserModulesQuery } from "@/lib/store/services/auth/auth.api";
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
    useEffect(() => {
      if (isLoggedIn) {
        refetch();
      }
    }, [isLoggedIn]);

    if (isLoading && isFetching && !data) {
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
