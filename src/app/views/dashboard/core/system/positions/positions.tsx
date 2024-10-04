import { MRT_ServerTable } from "@/components/tables/mrttables/mrtserverside";
import { useMRTPaginateTable } from "@/hooks/usefetch.hook";
import { Position } from "@/types/app/core/position.type";
import { Box } from "@mantine/core";
import { PositionColumns } from "./positionconfigs";

const ManagePositions = () => {
  const { refetch } = useMRTPaginateTable<Position>({
    queryKey: "users",
    endPoint: "core/system/positions",
  });

  return (
    <Box>
      <MRT_ServerTable
        title="Position"
        tablecolumns={PositionColumns}
        refetch={refetch}
        enableRowActions={true}
      />
    </Box>
  );
};

export default ManagePositions;
