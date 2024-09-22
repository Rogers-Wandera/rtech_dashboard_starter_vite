import { TableColumnConfigs } from "@/components/tables/configs/mrtconfigs/mrtserverside.configs";
import { MRT_ServerTable } from "@/components/tables/mrtserverside";
import RouteRoles from "@/hocs/verifyroles";
import { User } from "@/types/app/core/user.type";

const ManageUsers = () => {
  const moretableconfigs: TableColumnConfigs<User>[] = [
    { accessorKey: "gender", filterSelectOptions: ["Male", "Female"] },
  ];
  return (
    <div>
      <h1>Hello Users</h1>
      <MRT_ServerTable<User>
        tablecolumns={[
          { accessorKey: "userName", header: "Full Name", type: "text" },
          { accessorKey: "gender", type: "select", header: "Gender" },
        ]}
        columnConfigs={moretableconfigs}
      />
    </div>
  );
};

export default RouteRoles(ManageUsers);
