import { MRT_TableContextState } from "@/types/app/mrttable/mrttable.types";
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
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import {
  DEFAULT_COLUMN_FILTERS,
  DEFAULT_COLUMN_VISIBILITY,
  DEFAULT_PAGINATION,
  DEFAULT_ROW_SELECTION,
  DEFAULT_SORTING,
} from "./table.defaults";

const MRT_TableContext = createContext<
  MRT_TableContextState<unknown> | undefined
>(undefined);

const MRT_TableContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const [manual, setManual] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ServerErrorResponse | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>(
    DEFAULT_ROW_SELECTION
  );
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    DEFAULT_COLUMN_VISIBILITY
  );
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    DEFAULT_COLUMN_FILTERS
  );
  const [data, setData] = useState<
    PaginateResponse<unknown> | unknown[] | undefined
  >(undefined);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<MRT_SortingState>(DEFAULT_SORTING);
  const [pagination, setPagination] =
    useState<MRT_PaginationState>(DEFAULT_PAGINATION);

  const contextValue = useMemo(
    () => ({
      manual,
      setManual,
      filters: {
        columnFilters,
        setColumnFilters,
        globalFilter,
        setGlobalFilter,
      },
      validation: {
        validationErrors,
        setValidationErrors,
      },
      sorting: { sorting, setSorting },
      pagination: { pagination, setPagination },
      rowSelection: { rowSelection, setRowSelection },
      data: { data, setData },
      status: {
        isLoading,
        setIsLoading,
        isFetching,
        setIsFetching,
        isError,
        setIsError,
        error,
        setError,
      },
      visibility: { columnVisibility, setColumnVisibility },
    }),
    [
      manual,
      columnFilters,
      globalFilter,
      sorting,
      pagination,
      rowSelection,
      data,
      isLoading,
      isFetching,
      isError,
      error,
      columnVisibility,
      validationErrors,
    ]
  );

  useEffect(() => {
    if (!manual) {
      setManual(true);
    }
  }, [pagination, sorting, globalFilter, columnFilters]);

  useEffect(() => {
    setManual(true);
    setData(undefined);
    setPagination(DEFAULT_PAGINATION);
    setSorting(DEFAULT_SORTING);
    setGlobalFilter("");
    setColumnFilters(DEFAULT_COLUMN_FILTERS);
    setRowSelection(DEFAULT_ROW_SELECTION);
    setColumnVisibility(DEFAULT_COLUMN_VISIBILITY);
    setError(null);
    setIsError(false);
    setIsFetching(false);
    setIsLoading(false);
    setValidationErrors({});
  }, [location.pathname]);

  return (
    <MRT_TableContext.Provider value={contextValue}>
      {children}
    </MRT_TableContext.Provider>
  );
};

export const useMRTTableContext = <T extends Record<string, any>>() => {
  const context = useContext(MRT_TableContext) as MRT_TableContextState<T>;
  if (context === undefined) {
    throw new Error(
      "useMRTTableContext must be used within a MRT_TableContextProvider"
    );
  }
  return context;
};

export default MRT_TableContextProvider;
