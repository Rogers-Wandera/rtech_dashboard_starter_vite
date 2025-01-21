import { MRT_ServerTable } from "@/components/tables/mrttables/server/mrtserverside";
import { useMRTPaginateTable } from "@/hooks/usefetch.hook";
import { Position } from "@/types/app/core/position.type";
import { Box } from "@mantine/core";
import { PositionColumns } from "./positionconfigs";
import { validateRequired } from "@/lib/utils/helpers/utilfuncs";
import { usePermissions } from "@/lib/context/auth/permission.context";
import { POSITION_PERMISSION } from "@/types/enums/permissions.enum";
import { ErrorPage } from "@/components/pages/error/errorPage";

function validateData(data: Position) {
  return {
    position: !validateRequired(data.position) ? "Position is required" : "",
  };
}

const ManagePositions = () => {
  const { HasPermission } = usePermissions();
  const canFetch = HasPermission(POSITION_PERMISSION.VIEW_POSITIONS, "GET");
  const canCreate = HasPermission(POSITION_PERMISSION.ADD_POSITIONS, "POST");
  const canEdit = HasPermission(POSITION_PERMISSION.EDIT_POSITIONS, "PATCH");
  const canDelete = HasPermission(
    POSITION_PERMISSION.DELETE_POSITIONS,
    "DELETE"
  );

  const { refetch } = useMRTPaginateTable<Position>({
    queryKey: "postion",
    endPoint: "core/system/positions",
    skip: canFetch,
  });

  return (
    <Box>
      <MRT_ServerTable
        display={canFetch}
        title="Position"
        idField="id"
        enableEditing={true}
        tablecolumns={PositionColumns}
        refetch={refetch}
        enableRowActions={true}
        validateData={validateData}
        rowactions={{
          editrender: canEdit,
          deleterender: canDelete,
          actiontype: "menu",
        }}
        serveractions={{
          addEndPoint: "core/system/positions",
          editEndPoint: "core/system/positions",
          postFields: ["position"],
          deleteEndPoint: "core/system/positions",
        }}
        showCreateBtn={canCreate}
      />
      <div style={{ display: canFetch ? "none" : "block" }}>
        <ErrorPage
          type="401"
          title="No Permissions"
          message="You are not authorized to view this page"
        />
      </div>
    </Box>
  );
};

export default ManagePositions;
