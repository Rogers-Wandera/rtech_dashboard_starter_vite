import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import { useEffect, useMemo } from "react";
import { ServerSideProps } from "./configs/mrtconfigs/mrtserverside.configs";
import {
  GenerateColumns,
  RenderTopBarComponents,
} from "./configs/mrtconfigs/mrtfuncs";
import { useMRTTableContext } from "@/lib/context/table/mrttable.context";

export const MRT_ServerTable = <TData extends Record<string, any>>({
  tablecolumns,
  columnConfigs = [],
  refetch = () => {},
  enableEditing = false,
  idField = "id",
  otherTableOptions = {},
  enableRowSelection = false,
}: ServerSideProps<TData>) => {
  const {
    columnFilters,
    globalFilter,
    sorting,
    pagination,
    setColumnFilters,
    setGlobalFilter,
    setManual,
    setPagination,
    setRowSelection,
    setSorting,
    rowSelection,
    data,
    isError,
    isFetching,
    isLoading,
    error,
    setColumnVisibility,
    columnVisibility,
  } = useMRTTableContext<TData>();

  const columns = useMemo<MRT_ColumnDef<TData>[]>(
    () => GenerateColumns(tablecolumns, columnConfigs),
    [columnConfigs, tablecolumns]
  );

  const table = useMaterialReactTable({
    columns,
    enableEditing,
    data: data?.docs || [],
    rowCount: data?.totalDocs || 0,
    getRowId: (row) => row[idField as string],
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    enableRowActions: enableEditing,
    enableRowSelection,
    renderTopToolbarCustomActions: ({ table }) =>
      RenderTopBarComponents({ table, refetch }),
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: error?.message || "Error! Failed to fetch data",
        }
      : undefined,
    ...otherTableOptions,
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      rowSelection,
      columnFilters,
      globalFilter,
      sorting,
      pagination,
      columnVisibility,
    },
  });

  useEffect(() => {
    setManual(true);
  }, [pagination, sorting, globalFilter]);
  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
};
