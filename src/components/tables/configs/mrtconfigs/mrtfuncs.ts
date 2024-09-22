import { MRT_ColumnDef } from "material-react-table";
import { TableColumnConfigs, TableColumns } from "./mrtserverside.configs";

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
