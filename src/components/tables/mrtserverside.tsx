import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo } from "react";
import { ServerSideProps } from "./configs/mrtconfigs/mrtserverside.configs";
import { GenerateColumns } from "./configs/mrtconfigs/mrtfuncs";

export const MRT_ServerTable = <TData extends Record<string, any>>({
  tablecolumns,
  columnConfigs = [],
}: ServerSideProps<TData>) => {
  // const {
  //   columnFilters,
  //   globalFilter,
  //   sorting,
  //   setColumnFilters,
  //   setGlobalFilter,
  //   setManual,
  //   setPagination,
  //   setRowSelection,
  //   setSorting,
  //   rowSelection,
  // } = useMRTTableContext();

  const columns = useMemo<MRT_ColumnDef<TData>[]>(
    () => GenerateColumns(tablecolumns, columnConfigs),
    [columnConfigs, tablecolumns]
  );

  const table = useMaterialReactTable({
    columns,
    data: [],
  });
  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
};
