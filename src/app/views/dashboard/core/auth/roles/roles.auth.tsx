import Meta from "@/components/shared/meta";
import { TableColumnConfigs } from "@/components/tables/configs/mrtconfigs/shared.config";
import { MRT_ServerTable } from "@/components/tables/mrttables/server/mrtserverside";
import RouteRoles from "@/hocs/auth/verifyroles";
import { useMRTPaginateTable } from "@/hooks/data/usefetch.hook";
import { validateRequired } from "@/lib/utils/helpers/utilfuncs";
import { SystemRole } from "@/types/server/server.main.types";
import { Box } from "@mantine/core";

const validate = (data: any) => ({
  rolename: !validateRequired(data.rolename) ? "Role is required" : "",
  value: !validateRequired(data.value?.toString()) ? "Value is required" : "",
  description: !validateRequired(data.description)
    ? "Description is required"
    : "",
  released: !validateRequired(data.released.toString())
    ? "Released is required"
    : "",
});
const RolesPage = () => {
  const { refetch } = useMRTPaginateTable<SystemRole>({
    endPoint: "/core/auth/roles",
    queryKey: "system_roles",
  });

  const columnconfigs: TableColumnConfigs<SystemRole>[] = [
    {
      accessorKey: "released",
      Cell: ({ row }) => (row.original.released === 1 ? "Yes" : "No"),
      editSelectOptions: [
        { label: "Yes", value: 1 },
        { label: "No", value: 0 },
      ],
      editVariant: "select",
      muiEditTextFieldProps: {
        select: true,
      },
    },
  ];

  return (
    <Box mb={20}>
      <Meta title="Roles" header="Manage System Roles" />
      <MRT_ServerTable<SystemRole>
        title="System Role"
        enableRowActions={true}
        enableEditing={true}
        refetch={refetch}
        columnConfigs={columnconfigs}
        tablecolumns={[
          { accessorKey: "rolename", type: "text", header: "Role" },
          { accessorKey: "value", type: "text", header: "Value" },
          { accessorKey: "description", type: "text", header: "Desription" },
          { accessorKey: "released", type: "text", header: "Released" },
        ]}
        serveractions={{
          addEndPoint: "/core/auth/roles",
          editEndPoint: "/core/auth/roles",
          deleteEndPoint: "/core/auth/roles",
        }}
        validateData={validate}
      />
    </Box>
  );
};

export default RouteRoles(RolesPage);
