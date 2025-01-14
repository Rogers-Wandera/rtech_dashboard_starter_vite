import { MRT_ServerTable } from "@/components/tables/mrttables/server/mrtserverside";
import { useMRTPaginateTable } from "@/hooks/usefetch.hook";
import { Position } from "@/types/app/core/position.type";
import { Box } from "@mantine/core";
import { PositionColumns } from "./positionconfigs";
import { validateRequired } from "@/lib/utils/helpers/utilfuncs";

function validateData(data: Position) {
  return {
    position: !validateRequired(data.position) ? "Position is required" : "",
  };
}

const ManagePositions = () => {
  const { refetch } = useMRTPaginateTable<Position>({
    queryKey: "postion",
    endPoint: "core/system/positions",
  });

  return (
    <Box>
      <MRT_ServerTable
        title="Position"
        idField="id"
        enableEditing={true}
        tablecolumns={PositionColumns}
        refetch={refetch}
        enableRowActions={true}
        validateData={validateData}
        serveractions={{
          addEndPoint: "core/system/positions",
          editEndPoint: "core/system/positions",
          postFields: ["position"],
          deleteEndPoint: "core/system/positions",
        }}
      />
    </Box>
  );
};

export default ManagePositions;
