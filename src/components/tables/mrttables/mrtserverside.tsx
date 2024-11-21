import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_TableInstance,
} from "material-react-table";
import { useMemo, useState } from "react";
import { ServerSideProps } from "../configs/mrtconfigs/mrtserverside.configs";
import { GenerateColumns } from "../configs/mrtconfigs/mrtfuncs";
import { RenderTable } from "./servertable";
import { usePostData } from "@/hooks/usepost.hook";
import { notifier } from "@/lib/utils/notify/notification";
import {
  ServerErrorResponse,
  ServerResponse,
} from "@/types/server/server.main.types";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import { useAppDispatch } from "@/hooks/store.hooks";

export const MRT_ServerTable = <TData extends Record<string, any>>(
  options: ServerSideProps<TData>
) => {
  const dispatch = useAppDispatch();
  const {
    tablecolumns,
    columnConfigs = [],
    serveractions = {
      addEndPoint: "add",
      editEndPoint: "edit",
      postFields: [],
      postType: "Object",
    },
    validateData = undefined,
  } = options;

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<MRT_ColumnDef<TData>[]>(
    () =>
      GenerateColumns(
        tablecolumns,
        columnConfigs,
        validationErrors,
        setValidationErrors
      ),
    [columnConfigs, tablecolumns, setValidationErrors]
  );

  const { postAsync, data } = usePostData<ServerResponse>({
    queryKey: columns.map((column) => column.accessorKey),
  });

  const handleCreate = async ({
    values,
    table,
  }: {
    values: any;
    table: MRT_TableInstance<TData>;
  }) => {
    try {
      dispatch(setLoading(true));
      const newValidationErrors =
        (validateData && validateData(values, table)) || {};

      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      let dataToPost: Record<string, any> | Array<Record<string, any>> = {};
      if (Object.keys(values).length > 0) {
        if (
          serveractions?.postFields &&
          serveractions?.postFields?.length > 0
        ) {
          dataToPost = serveractions.postFields.map((field) => {
            return {
              [field]: values[field],
            };
          });
        } else {
          dataToPost = values;
        }
        if (
          serveractions.postType === "Object" ||
          serveractions.postType === undefined
        ) {
          const postdata = {};
          if (dataToPost instanceof Array) {
            dataToPost.forEach((item: any) => {
              Object.assign(postdata, item);
            });
          } else {
            Object.assign(postdata, dataToPost);
          }
          dataToPost = postdata;
        }
        values = dataToPost;
        if (serveractions?.addCallback) {
          values = serveractions.addCallback(dataToPost, table);
        }
        const addUrl = serveractions.addEndPoint
          ? serveractions.addEndPoint
          : "";
        await postAsync({ endPoint: addUrl, payload: values });
        table.setCreatingRow(null);
        options.refetch && options.refetch();
        notifier.success({ message: data?.msg as string, timer: 6000 });
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      HandleError(error as ServerErrorResponse);
    }
  };

  const table = RenderTable({
    columns,
    ...options,
    HandleCreate: handleCreate,
  });

  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
};
