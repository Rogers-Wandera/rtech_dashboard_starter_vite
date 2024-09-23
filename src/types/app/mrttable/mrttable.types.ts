import {
  PaginateResponse,
  ServerErrorResponse,
} from "@/types/server/server.main.types";
import {
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_RowSelectionState,
  MRT_SortingState,
  MRT_VisibilityState,
} from "material-react-table";

export interface MRT_TableContextState<T> {
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
  data: PaginateResponse<T> | undefined;
  setData: React.Dispatch<
    React.SetStateAction<PaginateResponse<T> | undefined>
  >;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
  error: ServerErrorResponse | null;
  setError: React.Dispatch<React.SetStateAction<ServerErrorResponse | null>>;
  columnVisibility: MRT_VisibilityState;
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<MRT_VisibilityState>
  >;
}
