import { useMemo } from "react";
import { GenerateColumns } from "../configs/mrtconfigs/mrtfuncs";
import { NoServerSideProps } from "../configs/mrtconfigs/nonserver.config";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { useMRTTableContext } from "@/lib/context/table/mrttable.context";
import { RenderNonServerTable } from "./nonservertable";

const MRT_NoServerTable = <TData extends Record<string, any>>(
  options: NoServerSideProps<TData>
) => {
  const {
    tablecolumns,
    columnConfigs = [],
    serveractions = {
      addEndPoint: "add",
      editEndPoint: "edit",
      postFields: [],
      postType: "Object",
      deleteEndPoint: "delete",
    },
    validateData = undefined,
  } = options;

  const idField = options.idField ? options.idField : "id";

  const { validation } = useMRTTableContext<TData>();

  const columns = useMemo<MRT_ColumnDef<TData>[]>(
    () =>
      GenerateColumns(
        tablecolumns,
        columnConfigs,
        validation.validationErrors,
        validation.setValidationErrors
      ),
    [
      columnConfigs,
      tablecolumns,
      validation.validationErrors,
      validation.setValidationErrors,
    ]
  );
  const table = RenderNonServerTable({
    columns,
    ...options,
    HandleCreate: () => {},
    HandleUpdate: () => {},
    HandleDeleteData: () => {},
  });
  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

export default MRT_NoServerTable;
