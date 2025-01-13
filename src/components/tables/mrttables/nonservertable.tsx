import { useMaterialReactTable } from "material-react-table";
import { tableProps } from "../configs/mrtconfigs/mrtserverside.configs";
import { useMRTTableContext } from "@/lib/context/table/mrttable.context";
import {
  HandleRenderAddEditDialogs,
  HandleRenderRowActionMenus,
  RenderTopBarComponents,
} from "../configs/mrtconfigs/mrtfuncs";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { NoServertableProps } from "../configs/mrtconfigs/nonserver.config";

export function RenderNonServerTable<TData extends Record<string, any>>({
  columns,
  title,
  data,
  refetch = () => {},
  idField = "id",
  otherTableOptions = {},
  enableRowSelection = false,
  showback = false,
  showCreateBtn = true,
  additionaltopbaractions = [],
  addeditprops = {},
  menuitems = [],
  rowactions = { editrender: true, deleterender: true, actiontype: "menu" },
  enableRowActions = false,
  HandleDeleteData = () => {},
  customCallBack = () => {},
  HandleCreate = () => {},
  setValidationErrors = () => {},
  HandleUpdate = () => {},
  deleteModalProps = {},
}: NoServertableProps<TData>) {
  const {
    // filters,
    // pagination,
    // sorting,
    rowSelection,
    visibility,
    status,
  } = useMRTTableContext<TData>();

  const theme = useSelector(
    (state: RootState) => state.setting.setting.theme_scheme.value
  );

  const rowmenuactions = HandleRenderRowActionMenus({
    title,
    menuitems,
    rowactions,
    HandleDeleteData,
    deleteModalProps,
  });

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    rowCount: data?.length || 0,
    getRowId: (row) => row[idField as string],
    onRowSelectionChange: rowSelection.setRowSelection,
    // onColumnFiltersChange: filters.setColumnFilters,
    // onGlobalFilterChange: filters.setGlobalFilter,
    // onPaginationChange: pagination.setPagination,
    // onSortingChange: sorting.setSorting,
    // manualFiltering: false,
    // manualPagination: false,
    // manualSorting: false,
    onColumnVisibilityChange: visibility.setColumnVisibility,
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: HandleCreate,
    onEditingRowSave: HandleUpdate,
    enableRowActions,
    enableRowSelection,
    ...HandleRenderAddEditDialogs<TData>({ ...addeditprops, title }),
    ...rowmenuactions,
    // renderTopToolbarCustomActions: ({ table }) =>
    //   RenderTopBarComponents({
    //     table,
    //     refetch,
    //     showback,
    //     showCreateBtn,
    //     otherTableOptions,
    //     additionaltopbaractions,
    //     customCallBack,
    //     title,
    //   }),
    muiToolbarAlertBannerProps: status.isError
      ? {
          color: "error",
          children: status.error?.message || "Error! Failed to fetch data",
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
      isLoading: status.isLoading,
      showAlertBanner: status.isError,
      showProgressBars: status.isFetching,
      rowSelection: rowSelection.rowSelection,
      //   columnFilters: filters.columnFilters,
      //   globalFilter: filters.globalFilter,
      //   sorting: sorting.sorting,
      //   pagination: pagination.pagination,
      columnVisibility: visibility.columnVisibility,
    },
  });
  return table;
}
