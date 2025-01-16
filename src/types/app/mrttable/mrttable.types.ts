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
  filters: {
    columnFilters: MRT_ColumnFiltersState;
    setColumnFilters: React.Dispatch<
      React.SetStateAction<MRT_ColumnFiltersState>
    >;
    globalFilter: string;
    setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  };
  sorting: {
    sorting: MRT_SortingState;
    setSorting: React.Dispatch<React.SetStateAction<MRT_SortingState>>;
  };
  pagination: {
    pagination: MRT_PaginationState;
    setPagination: React.Dispatch<React.SetStateAction<MRT_PaginationState>>;
  };
  visibility: {
    columnVisibility: MRT_VisibilityState;
    setColumnVisibility: React.Dispatch<
      React.SetStateAction<MRT_VisibilityState>
    >;
  };
  manual: boolean;
  setManual: React.Dispatch<React.SetStateAction<boolean>>;
  rowSelection: {
    rowSelection: MRT_RowSelectionState;
    setRowSelection: React.Dispatch<
      React.SetStateAction<MRT_RowSelectionState>
    >;
  };
  data: {
    data: PaginateResponse<T> | T[] | undefined;
    setData: React.Dispatch<
      React.SetStateAction<PaginateResponse<T> | T[] | undefined>
    >;
  };
  status: {
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
    setIsError: React.Dispatch<React.SetStateAction<boolean>>;
    error: ServerErrorResponse | null;
    setError: React.Dispatch<React.SetStateAction<ServerErrorResponse | null>>;
  };
  validation: {
    validationErrors: Record<string, string | undefined>;
    setValidationErrors: React.Dispatch<
      React.SetStateAction<Record<string, string | undefined>>
    >;
  };
}
