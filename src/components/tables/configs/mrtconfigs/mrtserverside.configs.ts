import { ButtonOwnProps } from "@mui/material";
import {
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  MRT_TableOptions,
} from "material-react-table";
import { ReactNode } from "react";

export type TableColumnConfigs<T extends Record<string, any>> = Omit<
  MRT_ColumnDef<T>,
  "header"
> & {
  accessorKey: keyof T & string;
  header?: string;
};

export interface addeditprops {
  edittitle?: string;
  addtitle?: string;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "button"
    | "caption"
    | "overline";
}

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

export interface additionaltopbaractions<T extends Record<string, any>> {
  label: string;
  icon: ReactNode;
  visible?: boolean | ((row: MRT_Row<T>) => boolean);
  onClick: (
    table: MRT_TableInstance<T>,
    row: MRT_Row<T>,
    rows: MRT_Row<T>[]
  ) => void;
  show?: "text" | "icon";
  buttonconfigs?: {
    variant?: "outlined" | "contained";
    color?:
      | "inherit"
      | "primary"
      | "secondary"
      | "success"
      | "error"
      | "info"
      | "warning";
    size?: "small" | "medium" | "large";
    otherprops?: ButtonOwnProps;
    iconplacement?: "start" | "end";
  };
}

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
  | "enableRowActions"
  | "renderRowActions"
  | "renderRowActionMenuItems"
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
  additionaltopbaractions?: additionaltopbaractions<T>[];
  addeditprops?: addeditprops;
  title: string;
  menuitems?: RowMenuItems<T>[];
  rowactions?: rowactionconfigs<T>;
}

export type TopToolBarProps<T extends Record<string, any>> = {
  table: MRT_TableInstance<T>;
  refetch?: () => void;
  showback?: boolean;
  showCreateBtn?: boolean;
  otherTableOptions?: OtherTableOptions<T>;
  additionaltopbaractions?: additionaltopbaractions<T>[];
};

export type actiontypeprops<T extends Record<string, any>> = {
  row: MRT_Row<T>;
  table: MRT_TableInstance<T>;
  closeMenu?: () => void;
};

export type RowMenuItems<T extends Record<string, any>> = {
  label: string | ((row: MRT_Row<T>) => string);
  icon: React.ReactNode | ((row: MRT_Row<T>) => React.ReactNode);
  onClick: (row: MRT_Row<T>, table: MRT_TableInstance<T>) => void;
  render?: boolean | ((row: MRT_Row<T>) => boolean);
};

export interface rowactionconfigs<T extends Record<string, any>> {
  actiontype?: "menu" | "inline";
  deleterender?: boolean | ((row: MRT_Row<T>) => boolean);
  editrender?: boolean | ((row: MRT_Row<T>) => boolean);
}
