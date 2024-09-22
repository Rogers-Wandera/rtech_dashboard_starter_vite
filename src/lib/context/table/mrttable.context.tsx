import { MRT_TableContextState } from "@/types/app/mrttable/mrttable.types";
import {
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_RowSelectionState,
  MRT_SortingState,
} from "material-react-table";
import { createContext, useContext, useState } from "react";

const initialState: MRT_TableContextState = {
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
};
const MRT_TableContext = createContext<MRT_TableContextState>(initialState);

const MRT_TableContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [manual, setManual] = useState(true);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<MRT_SortingState>([
    { id: "id", desc: true },
  ]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
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
      }}
    >
      {children}
    </MRT_TableContext.Provider>
  );
};

export const useMRTTableContext = () => {
  const context = useContext(MRT_TableContext);
  if (context === undefined) {
    throw new Error(
      "useMRTTableContext must be used within a MRT_TableContextProvider"
    );
  }
  return context;
};

export default MRT_TableContextProvider;
