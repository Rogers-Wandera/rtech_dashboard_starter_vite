import { MRT_ColumnDef } from "material-react-table";

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

export interface ServerSideProps<T extends Record<string, any>> {
  tablecolumns: TableColumns<T>[];
  columnConfigs?: TableColumnConfigs<T>[];
}
