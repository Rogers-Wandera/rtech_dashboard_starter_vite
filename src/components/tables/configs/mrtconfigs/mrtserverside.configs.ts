import { ButtonOwnProps } from "@mui/material";
import {
  MRT_Cell,
  MRT_Column,
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  MRT_TableOptions,
} from "material-react-table";
import React, { ReactNode } from "react";

/**
 * Configuration for a table column.
 * @template T The type of data represented in the table.
 */
export type TableColumnConfigs<T extends Record<string, any>> = Omit<
  MRT_ColumnDef<T>,
  "header"
> & {
  /** The key to access the column data in the row. */
  accessorKey: keyof T & string;
  /** The header label for the column. */
  header?: string;
};

/**
 * Properties for add/edit modal components.
 */
export interface addeditprops {
  /** Title for the edit action modal. */
  edittitle?: string;
  /** Title for the add action modal. */
  addtitle?: string;
  /** Typography variant to use for the title. */
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

/**
 * Configuration for defining table columns.
 * @template T The type of data represented in the table.
 */
export type TableColumns<T extends Record<string, any>> = {
  /** The key to access the column data in the row. */
  accessorKey: keyof T & string;
  /** The type of editor or input field to use for this column. */
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
  /** The header label for the column. */
  header?: string;
  /** A custom editor component for the column. */
  Edit?: (props: {
    cell: MRT_Cell<T, unknown>;
    column: MRT_Column<T, unknown>;
    row: MRT_Row<T>;
    table: MRT_TableInstance<T>;
  }) => ReactNode;
};

/**
 * Configuration for additional top bar actions in the table.
 * @template T The type of data represented in the table.
 */
export interface additionaltopbaractions<T extends Record<string, any>> {
  /** The label for the action. */
  label: string;
  /** The icon to display for the action. */
  icon: ReactNode;
  /** Determines the visibility of the action. */
  visible?: boolean | ((row: MRT_Row<T>) => boolean);
  /** Callback to execute when the action is clicked. */
  onClick: (
    table: MRT_TableInstance<T>,
    row: MRT_Row<T>,
    rows: MRT_Row<T>[]
  ) => void;
  /** Whether to show text, icon, or both. */
  show?: "text" | "icon";
  /** Configuration for the action button. */
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

/**
 * Additional options for configuring the Material React Table.
 * @template T The type of data represented in the table.
 */
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
  | "onCreatingRowSave"
>;

/**
 * Props for server-side table configuration.
 * @template T The type of data represented in the table.
 */
export interface ServerSideProps<T extends Record<string, any>> {
  /** The table columns to render data in the table. */
  tablecolumns: TableColumns<T>[];
  /** Column configurations for updates and modal editing. */
  columnConfigs?: TableColumnConfigs<T>[];
  /** Function to refetch data. */
  refetch?: () => void;
  /** Whether editing is enabled. */
  enableEditing?: boolean;
  /** The field used as a unique identifier. */
  idField?: string | null;
  /** Additional table options. */
  otherTableOptions?: OtherTableOptions<T>;
  /** Whether row selection is enabled. */
  enableRowSelection?: boolean | ((row: MRT_Row<T>) => boolean);
  /** Whether to show a back button. */
  showback?: boolean;
  /** Whether to show a create button. */
  showCreateBtn?: boolean;
  /** Additional actions for the top bar. */
  additionaltopbaractions?: additionaltopbaractions<T>[];
  /** Properties for the add/edit modal. */
  addeditprops?: addeditprops;
  /** Title of the table. */
  title: string;
  /** Menu items for rows. */
  menuitems?: RowMenuItems<T>[];
  /** Configurations for row actions. */
  rowactions?: rowactionconfigs<T>;
  /** Whether row actions are enabled. */
  enableRowActions?: boolean;
  HandleDeleteData?: (row: MRT_Row<T>) => void;
  customCallBack?: (table: MRT_TableInstance<T>) => void;
  serveractions?: {
    addEndPoint?: string;
    editEndPoint?: string | ((row: MRT_Row<T>) => string);
    postFields?: string[];
    postType?: "Array" | "Object";
    addCallback?: (values: any, table: MRT_TableInstance<T>) => typeof values;
    editCallback?: (values: any, table: MRT_TableInstance<T>) => typeof values;
  };
  validateData?: (
    data: any,
    table: MRT_TableInstance<T>
  ) => Record<string, string>;
}

/**
 * Props for the top toolbar in the table.
 * @template T The type of data represented in the table.
 */
export type TopToolBarProps<T extends Record<string, any>> = {
  /** The table instance. */
  table: MRT_TableInstance<T>;
  /** Function to refetch data. */
  refetch?: () => void;
  /** Whether to show a back button. */
  showback?: boolean;
  /** Whether to show a create button. */
  showCreateBtn?: boolean;
  /** Additional table options. */
  otherTableOptions?: OtherTableOptions<T>;
  /** Additional actions for the top bar. */
  additionaltopbaractions?: additionaltopbaractions<T>[];
  /** Custom callback for overriding the built in create mode */
  customCallBack?: (table: MRT_TableInstance<T>) => void;
};

/**
 * Props for action types in the row menu.
 * @template T The type of data represented in the table.
 */
export type actiontypeprops<T extends Record<string, any>> = {
  /** The current row. */
  row: MRT_Row<T>;
  /** The table instance. */
  table: MRT_TableInstance<T>;
  /** Function to close the menu. */
  closeMenu?: () => void;
};

/**
 * Configuration for menu items in a row.
 * @template T The type of data represented in the table.
 */
export type RowMenuItems<T extends Record<string, any>> = {
  /** The label for the menu item. */
  label: string | ((row: MRT_Row<T>) => string);
  /** The icon for the menu item. */
  icon: React.ReactNode | ((row: MRT_Row<T>) => React.ReactNode);
  /** Callback to execute when the menu item is clicked. */
  onClick: (row: MRT_Row<T>, table: MRT_TableInstance<T>) => void;
  /** Whether the menu item should be rendered. */
  render?: boolean | ((row: MRT_Row<T>) => boolean);
};

/**
 * Configuration for row actions in the table.
 * @template T The type of data represented in the table.
 */
export interface rowactionconfigs<T extends Record<string, any>> {
  /** The type of action (menu or inline). */
  actiontype?: "menu" | "inline";
  /** Whether the delete action should be rendered. */
  deleterender?: boolean | ((row: MRT_Row<T>) => boolean);
  /** Whether the edit action should be rendered. */
  editrender?: boolean | ((row: MRT_Row<T>) => boolean);
}

export type tableProps<TData extends Record<string, any>> =
  ServerSideProps<TData> & {
    columns: MRT_ColumnDef<TData, any>[];
    HandleDeleteData?: (row: MRT_Row<TData>) => void;
    customCallBack?: (table: MRT_TableInstance<TData>) => void;
    HandleCreate?: ({
      values,
      table,
    }: {
      values: any;
      table: MRT_TableInstance<TData>;
    }) => void;
    setValidationErrors?: React.Dispatch<
      React.SetStateAction<Record<string, string | undefined>>
    >;
  };
