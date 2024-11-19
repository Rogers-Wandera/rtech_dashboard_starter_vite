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
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const initialState: MRT_TableContextState<unknown> = {
  manual: true,
  setManual: () => {},
  columnFilters: [],
  setColumnFilters: () => {},
  globalFilter: "",
  setGlobalFilter: () => {},
  sorting: [],
  setSorting: () => {},
  pagination: { pageIndex: 0, pageSize: 5 },
  setPagination: () => {},
  setRowSelection: () => {},
  rowSelection: {},
  data: undefined,
  setData: () => {},
  isLoading: false,
  setIsLoading: () => {},
  isFetching: false,
  setIsFetching: () => {},
  isError: false,
  setIsError: () => {},
  setError: () => {},
  error: null,
  columnVisibility: {},
  setColumnVisibility: () => {},
};
const MRT_TableContext =
  createContext<MRT_TableContextState<any>>(initialState);

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

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    {}
  );
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [data, setData] = useState<PaginateResponse<any> | undefined>(
    undefined
  );
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  useEffect(() => {
    setRowSelection({});
    setGlobalFilter("");
    // setPagination({ pageIndex: 0, pageSize: 5 });
    setSorting([]);
    setData(undefined);
    setColumnFilters([]);
    setColumnVisibility({});
    setError(null);
    setIsError(false);
    setIsFetching(false);
    setIsLoading(false);
    setManual(true);
  }, [location.pathname]);

  useEffect(() => {
    if (!manual) {
      setManual(true);
    }
  }, [pagination, sorting, globalFilter]);
  return (
    <MRT_TableContext.Provider
      value={{
        manual,
        rowSelection,
        setRowSelection,
        setManual,
        columnFilters,
        setColumnFilters,
        globalFilter,
        setGlobalFilter,
        sorting,
        setSorting,
        pagination,
        setPagination,
        data,
        setData,
        isError,
        isFetching,
        setIsError,
        setIsFetching,
        setIsLoading,
        isLoading,
        error,
        setError,
        columnVisibility,
        setColumnVisibility,
      }}
    >
      {children}
    </MRT_TableContext.Provider>
  );
};

export const useMRTTableContext = <T extends Record<string, any>>() => {
  const context = useContext<MRT_TableContextState<T>>(MRT_TableContext);
  if (context === undefined) {
    throw new Error(
      "useMRTTableContext must be used within a MRT_TableContextProvider"
    );
  }
  return context;
};

export default MRT_TableContextProvider;
