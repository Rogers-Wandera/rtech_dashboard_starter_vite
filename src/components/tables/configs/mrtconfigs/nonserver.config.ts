import {
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  MRT_TableOptions,
} from "material-react-table";
import {
  addeditprops,
  additionaltopbaractions,
  rowactionconfigs,
  RowMenuItems,
  TableColumnConfigs,
  TableColumns,
} from "./shared.config";

/**
 * Additional options for configuring the Material React Table.
 * @template T The type of data represented in the table.
 */
type OtherTableOptions<T extends Record<string, any>> = Omit<
  MRT_TableOptions<T>,
  | "columns"
  | "data"
  | "enableEditing"
  | "rowCount"
  | "getRowId"
  | "renderTopToolbarCustomActions"
  | "muiToolbarAlertBannerProps"
  | "enableRowActions"
  | "renderRowActions"
  | "renderRowActionMenuItems"
  | "onCreatingRowSave"
>;

export interface NoServerSideProps<T extends Record<string, any>> {
  /** The table columns to render data in the table. */
  tablecolumns: TableColumns<T>[];
  data?: T[];
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
    deleteEndPoint?: string | ((row: MRT_Row<T>) => string);
    postFields?:
      | string[]
      | ((values: any, table: MRT_TableInstance<T>) => string[]);
    postType?: "Array" | "Object";
    addCreateCallback?: (
      values: any,
      table: MRT_TableInstance<T>
    ) => typeof values;
    editCreateCallback?: (
      values: any,
      table: MRT_TableInstance<T>,
      row?: MRT_Row<T>
    ) => typeof values;
    deletePayload?:
      | Array<unknown>
      | Record<string, any>
      | ((row: MRT_Row<T>) => Array<unknown> | Record<string, any>);
  };
  actioncallbacks?: {
    addCallBack?: <TData>(response: TData) => void;
    editCallBack?: <TData>(response: TData, row: MRT_Row<T>) => void;
    deleteCallBack?: <TData>(response: TData, row: MRT_Row<T>) => void;
  };
  validateData?: (
    data: any,
    table: MRT_TableInstance<T>
  ) => Record<string, string>;
  deleteModalProps?: {
    title?: string | ((row: MRT_Row<T>) => string);
    message?: string | ((row: MRT_Row<T>) => string);
    confirmLabel?: string | ((row: MRT_Row<T>) => string);
    cancelLabel?: string;
  };
}

export type NoServertableProps<TData extends Record<string, any>> =
  NoServerSideProps<TData> & {
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
    HandleUpdate?: ({
      values,
      table,
      row,
    }: {
      values: any;
      table: MRT_TableInstance<TData>;
      row: MRT_Row<TData>;
    }) => void;
  };

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
