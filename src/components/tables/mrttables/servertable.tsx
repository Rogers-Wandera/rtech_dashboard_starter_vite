import {
  MRT_ColumnDef,
  MRT_Row,
  useMaterialReactTable,
} from "material-react-table";
import { ServerSideProps } from "../configs/mrtconfigs/mrtserverside.configs";
import { useMRTTableContext } from "@/lib/context/table/mrttable.context";
import {
  HandleRenderAddEditDialogs,
  HandleRenderRowActionMenus,
  RenderTopBarComponents,
} from "../configs/mrtconfigs/mrtfuncs";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

type tableProps<TData extends Record<string, any>> = ServerSideProps<TData> & {
  columns: MRT_ColumnDef<TData, any>[];
  HandleDeleteData?: (row: MRT_Row<TData>) => void;
};

export function RenderTable<TData extends Record<string, any>>({
  columns,
  title,
  refetch = () => {},
  enableEditing = false,
  idField = "id",
  otherTableOptions = {},
  enableRowSelection = false,
  showback = false,
  showCreateBtn = true,
  additionaltopbaractions = [],
  addeditprops = {},
  menuitems = [],
  rowactions = undefined,
  HandleDeleteData = () => {},
}: tableProps<TData>) {
  const {
    columnFilters,
    globalFilter,
    sorting,
    pagination,
    setColumnFilters,
    setGlobalFilter,
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
  const theme = useSelector(
    (state: RootState) => state.setting.setting.theme_scheme.value
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
    ...HandleRenderAddEditDialogs<TData>({ ...addeditprops }),
    ...HandleRenderRowActionMenus({
      title,
      menuitems,
      rowactions,
      HandleDeleteData,
    }),
    renderTopToolbarCustomActions: ({ table }) =>
      RenderTopBarComponents({
        table,
        refetch,
        showback,
        showCreateBtn,
        otherTableOptions,
        additionaltopbaractions,
      }),
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: error?.message || "Error! Failed to fetch data",
        }
      : undefined,
    ...otherTableOptions,
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        fontWeight: row.getIsSelected() ? "bold" : "normal",
      },
    }),
    muiTableBodyProps: {
      sx: {
        "& tr:nth-of-type(odd) > td": {
          backgroundColor: theme === "light" ? "#f5f5f5" : "#222738",
        },
      },
    },
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
  return table;
}
