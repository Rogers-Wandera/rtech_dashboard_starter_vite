import {
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_RowSelectionState,
  MRT_SortingState,
  MRT_VisibilityState,
} from "material-react-table";

export const DEFAULT_PAGINATION: MRT_PaginationState = {
  pageIndex: 0,
  pageSize: 5,
};
export const DEFAULT_SORTING: MRT_SortingState = [];
export const DEFAULT_COLUMN_FILTERS: MRT_ColumnFiltersState = [];
export const DEFAULT_ROW_SELECTION: MRT_RowSelectionState = {};
export const DEFAULT_COLUMN_VISIBILITY: MRT_VisibilityState = {};
