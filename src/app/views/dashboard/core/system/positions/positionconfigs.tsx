import { TableColumns } from "@/components/tables/configs/mrtconfigs/mrtserverside.configs";
import { Position } from "@/types/app/core/position.type";

export const PositionColumns: TableColumns<Position>[] = [
  { accessorKey: "position", type: "text", header: "Position" },
  {
    accessorKey: "creationDate",
    type: "text",
    header: "Date",
    Edit: () => null,
  },
];
