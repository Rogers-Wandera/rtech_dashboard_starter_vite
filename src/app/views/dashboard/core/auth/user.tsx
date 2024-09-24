import { TableColumnConfigs } from "@/components/tables/configs/mrtconfigs/mrtserverside.configs";
import { MRT_ServerTable } from "@/components/tables/mrttables/mrtserverside";
import RouteRoles from "@/hocs/verifyroles";
import { useMRTPaginateTable } from "@/hooks/usefetch.hook";
import { User } from "@/types/app/core/user.type";
import { PaginateResponse } from "@/types/server/server.main.types";

const ManageUsers = () => {
  const moretableconfigs: TableColumnConfigs<User>[] = [
    { accessorKey: "gender", filterSelectOptions: ["Male", "Female"] },
  ];

  const { refetch } = useMRTPaginateTable<PaginateResponse<User>>({
    queryKey: "users",
    endPoint: "core/auth/user",
  });

  return (
    <div>
      <MRT_ServerTable<User>
        tablecolumns={[
          { accessorKey: "userName", header: "Full Name", type: "text" },
          { accessorKey: "gender", type: "select", header: "Gender" },
        ]}
        columnConfigs={moretableconfigs}
        refetch={refetch}
      />
    </div>
  );
};

export default RouteRoles(ManageUsers);
