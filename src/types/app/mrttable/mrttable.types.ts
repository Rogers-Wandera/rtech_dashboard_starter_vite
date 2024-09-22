import {
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_RowSelectionState,
  MRT_SortingState,
} from "material-react-table";

export interface MRT_TableContextState {
  manual: boolean;
  setManual: React.Dispatch<React.SetStateAction<boolean>>;
  columnFilters: MRT_ColumnFiltersState;
  setColumnFilters: React.Dispatch<
    React.SetStateAction<MRT_ColumnFiltersState>
  >;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  sorting: MRT_SortingState;
  setSorting: React.Dispatch<React.SetStateAction<MRT_SortingState>>;
  pagination: MRT_PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<MRT_PaginationState>>;
  rowSelection: MRT_RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>;
}
