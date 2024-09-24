import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { useEffect, useMemo } from "react";
import { ServerSideProps } from "../configs/mrtconfigs/mrtserverside.configs";
import { GenerateColumns } from "../configs/mrtconfigs/mrtfuncs";
import { useMRTTableContext } from "@/lib/context/table/mrttable.context";
import { RenderTable } from "./servertable";

export const MRT_ServerTable = <TData extends Record<string, any>>(
  options: ServerSideProps<TData>
) => {
  const { tablecolumns, columnConfigs = [] } = options;
  const columns = useMemo<MRT_ColumnDef<TData>[]>(
    () => GenerateColumns(tablecolumns, columnConfigs),
    [columnConfigs, tablecolumns]
  );

  const { setManual, pagination, sorting, globalFilter } = useMRTTableContext();

  const table = RenderTable({ columns, ...options });

  useEffect(() => {
    setManual(true);
  }, [pagination, sorting, globalFilter]);
  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
};
