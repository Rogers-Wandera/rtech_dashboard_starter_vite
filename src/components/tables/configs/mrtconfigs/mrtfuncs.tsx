import { MRT_ColumnDef, MRT_TableInstance } from "material-react-table";
import { TableColumnConfigs, TableColumns } from "./mrtserverside.configs";
import { IconButton, Tooltip } from "@mui/material";
import { Refresh } from "@mui/icons-material";

export function GenerateColumns<TData extends Record<string, any>>(
  tablecolumns: TableColumns<TData>[],
  other: TableColumnConfigs<TData>[]
): MRT_ColumnDef<TData>[] {
  if (tablecolumns.length > 0) {
    const columns: MRT_ColumnDef<TData>[] = tablecolumns.map((column) => {
      const header = column?.header ? column.header : column.accessorKey;
      let otherconfigs = {};
      if (other && other.length > 0) {
        const exists = other.find(
          (item) => item.accessorKey === column.accessorKey
        );
        exists && (otherconfigs = exists);
      }
      return {
        ...column,
        header: header,
        filterVariant: column.type,
        ...otherconfigs,
      };
    });
    return columns;
  }
  return [];
}

export function RenderTopBarComponents<T extends Record<string, any>>({
  table,
  refetch = () => {},
}: {
  table: MRT_TableInstance<T>;
  refetch?: () => void;
}) {
  return (
    <Tooltip arrow title="Refresh Data">
      <IconButton
        onClick={() => {
          table.setColumnFilters([]);
          refetch();
        }}
      >
        <Refresh />
      </IconButton>
    </Tooltip>
  );
}
