import { MRT_ColumnDef } from "material-react-table";
import {
  TableColumnConfigs,
  TableColumns,
  TopToolBarProps,
} from "./mrtserverside.configs";
import { Box, IconButton, Tooltip } from "@mui/material";
import { ArrowBack, Refresh } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";

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
  showback = false,
  showCreateBtn = true,
  otherTableOptions = {},
}: TopToolBarProps<T>) {
  const navigate = useNavigate();
  return (
    <Box>
      {showback && (
        <Tooltip arrow title="Go back">
          <IconButton
            onClick={() => {
              navigate(-1);
            }}
            color="secondary"
          >
            <ArrowBack />
          </IconButton>
        </Tooltip>
      )}
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
      {showCreateBtn && (
        <Tooltip arrow title={"Add New"}>
          <IconButton
            onClick={() => {
              table.setCreatingRow(true);
              if (otherTableOptions?.createDisplayMode === "custom") {
                // if (customCallback) {
                //   customCallback(table);
                // }
              }
            }}
          >
            <AddBoxIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}
