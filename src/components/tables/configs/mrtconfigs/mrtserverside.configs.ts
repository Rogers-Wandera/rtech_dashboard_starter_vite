import {
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  MRT_TableOptions,
} from "material-react-table";

export type TableColumnConfigs<T extends Record<string, any>> = Omit<
  MRT_ColumnDef<T>,
  "header"
> & {
  accessorKey: keyof T & string;
  header?: string;
};

export type TableColumns<T extends Record<string, any>> = {
  accessorKey: keyof T & string;
  type:
    | "autocomplete"
    | "checkbox"
    | "date"
    | "date-range"
    | "datetime"
    | "datetime-range"
    | "multi-select"
    | "range"
    | "range-slider"
    | "select"
    | "text"
    | "time"
    | "time-range"
    | undefined;
  header?: string;
};

export type OtherTableOptions<T extends Record<string, any>> = Omit<
  MRT_TableOptions<T>,
  | "columns"
  | "data"
  | "enableEditing"
  | "rowCount"
  | "getRowId"
  | "onRowSelectionChange"
  | "onColumnFiltersChange"
  | "onGlobalFilterChange"
  | "onPaginationChange"
  | "onSortingChange"
  | "renderTopToolbarCustomActions"
  | "muiToolbarAlertBannerProps"
  | "state"
>;
export interface ServerSideProps<T extends Record<string, any>> {
  tablecolumns: TableColumns<T>[];
  columnConfigs?: TableColumnConfigs<T>[];
  refetch?: () => void;
  enableEditing?: boolean;
  idField?: string | null;
  otherTableOptions?: OtherTableOptions<T>;
  enableRowSelection?: boolean | ((row: MRT_Row<T>) => boolean);
  showback?: boolean;
  showCreateBtn?: boolean;
}

export type TopToolBarProps<T extends Record<string, any>> = {
  table: MRT_TableInstance<T>;
  refetch?: () => void;
  showback?: boolean;
  showCreateBtn?: boolean;
  otherTableOptions?: OtherTableOptions<T>;
};
