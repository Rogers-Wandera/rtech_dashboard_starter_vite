import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_Row,
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

  const HandleDataToPost = (values: any, table: MRT_TableInstance<TData>) => {
    const newValidationErrors =
      (validateData && validateData(values, table)) || {};

    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    let dataToPost: Record<string, any> | Array<Record<string, any>> = {};
    if (Object.keys(values).length > 0) {
      if (serveractions?.postFields && serveractions?.postFields?.length > 0) {
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
    }
    return { values, dataToPost };
  };

  const handleCreate = async ({
    values,
    table,
  }: {
    values: any;
    table: MRT_TableInstance<TData>;
  }) => {
    try {
      dispatch(setLoading(true));
      const postData = HandleDataToPost(values, table);
      if (postData && Object.keys(postData.values).length > 0) {
        if (serveractions?.addCallback) {
          values = serveractions.addCallback(postData.dataToPost, table);
        }
        const addUrl = serveractions.addEndPoint
          ? serveractions.addEndPoint
          : "";
        await postAsync({ endPoint: addUrl, payload: postData.values });
        table.setCreatingRow(null);
        options.refetch && options.refetch();
        notifier.success({
          message: (data?.msg as string) || "Operation successful",
          timer: 6000,
        });
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
        return;
      }
    } catch (error) {
      dispatch(setLoading(false));
      HandleError(error as ServerErrorResponse);
    }
  };

  const HandleUpdate = async ({
    table,
    values,
    row,
  }: {
    values: any;
    table: MRT_TableInstance<TData>;
    row: MRT_Row<TData>;
  }) => {
    try {
      dispatch(setLoading(true));
      const postData = HandleDataToPost(values, table);
      if (postData && Object.keys(postData.values).length > 0) {
        if (serveractions?.editCallback) {
          values = serveractions.editCallback(postData.dataToPost, table, row);
        }
        let editUrl = `Update/${row.original[options.idField as string]}`;
        if (serveractions?.editEndPoint) {
          if (typeof serveractions.editEndPoint === "function") {
            editUrl = serveractions.editEndPoint(row);
          } else {
            editUrl =
              serveractions.editEndPoint +
              `/${row.original[options.idField as string]}`;
          }
        }
        await postAsync({
          endPoint: editUrl,
          payload: postData.values,
          method: "PATCH",
        });
        table.setEditingRow(null);
        options.refetch && options.refetch();
        notifier.success({
          message: (data?.msg as string) || "Operation successful",
          timer: 6000,
        });
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
        return;
      }
    } catch (error) {
      dispatch(setLoading(false));
      HandleError(error as ServerErrorResponse);
    }
  };

  const table = RenderTable({
    columns,
    ...options,
    HandleCreate: handleCreate,
    HandleUpdate: HandleUpdate,
  });

  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
};
