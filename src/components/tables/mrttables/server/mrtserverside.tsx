import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
} from "material-react-table";
import { useMemo } from "react";
import { ServerSideProps } from "../../configs/mrtconfigs/shared.config";
import { GenerateColumns } from "../../configs/mrtconfigs/mrtfuncs";
import { RenderTable } from "./servertable";
import { useMutateData } from "@/hooks/usemutatehook";
import { notifier } from "@/lib/utils/notify/notification";
import {
  ServerErrorResponse,
  ServerResponse,
} from "@/types/server/server.main.types";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import { useAppDispatch } from "@/hooks/store.hooks";
import { useDeleteData } from "@/hooks/usedelete.hook";
import { useMRTTableContext } from "@/lib/context/table/mrttable.context";
import { USE_MUTATE_METHODS } from "@/types/enums/enum.types";

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
      deleteEndPoint: "delete",
    },
    validateData = undefined,
  } = options;

  const { validation } = useMRTTableContext<TData>();

  const idField = options.idField ? options.idField : "id";

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

  const { postAsync, data } = useMutateData<ServerResponse>({
    queryKey: columns.map((column) => column.accessorKey),
  });

  const { deleteAsync, data: deleteData } = useDeleteData({
    queryKey: [...columns.map((column) => column.accessorKey), "delete"],
  });

  const HandleDataToPost = (values: any, table: MRT_TableInstance<TData>) => {
    const newValidationErrors =
      (validateData && validateData(values, table)) || {};

    if (Object.values(newValidationErrors).some((error) => error)) {
      validation.setValidationErrors(newValidationErrors);
      return;
    }
    validation.setValidationErrors({});
    let dataToPost: Record<string, any> | Array<Record<string, any>> = {};
    if (Object.keys(values).length > 0) {
      if (serveractions?.postFields && serveractions?.postFields?.length > 0) {
        if (typeof serveractions.postFields === "function") {
          const fields = serveractions.postFields(values, table);
          dataToPost = fields.map((field) => {
            return {
              [field]: values[field],
            };
          });
        } else {
          dataToPost = serveractions.postFields.map((field) => {
            return {
              [field]: values[field],
            };
          });
        }
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
        if (serveractions?.addCreateCallback) {
          values = serveractions.addCreateCallback(postData.dataToPost, table);
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
        options.actioncallbacks?.addCallBack &&
          options.actioncallbacks?.addCallBack(data);
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
        if (serveractions?.editCreateCallback) {
          values = serveractions.editCreateCallback(
            postData.dataToPost,
            table,
            row
          );
        }
        let editUrl = `Update/${row.original[idField]}`;
        if (serveractions?.editEndPoint) {
          if (typeof serveractions.editEndPoint === "function") {
            editUrl = serveractions.editEndPoint(row);
          } else {
            editUrl = serveractions.editEndPoint.endsWith("/")
              ? serveractions.editEndPoint + `${row.original[idField]}`
              : serveractions.editEndPoint + `/${row.original[idField]}`;
          }
        }
        await postAsync({
          endPoint: editUrl,
          payload: postData.values,
          method: USE_MUTATE_METHODS.PATCH,
        });
        table.setEditingRow(null);
        options.refetch && options.refetch();
        notifier.success({
          message: (data?.msg as string) || "Operation successful",
          timer: 6000,
        });
        options.actioncallbacks?.editCallBack &&
          options.actioncallbacks?.editCallBack(data, row);
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

  const HandleDelete = async (row: MRT_Row<TData>) => {
    try {
      dispatch(setLoading(true));
      let url = `Delete/${row.original[idField]}`;
      let payload = undefined;
      if (serveractions.deleteEndPoint) {
        if (typeof serveractions.deleteEndPoint === "function") {
          url = serveractions.deleteEndPoint(row);
        } else {
          url = serveractions.deleteEndPoint.endsWith("/")
            ? serveractions.deleteEndPoint + `${row.original[idField]}`
            : serveractions.deleteEndPoint + `/${row.original[idField]}`;
        }
      }

      if (serveractions.deletePayload) {
        if (typeof serveractions.deletePayload === "function") {
          payload = serveractions.deletePayload(row);
        } else {
          payload = serveractions.deletePayload;
        }
      }
      await deleteAsync({ endPoint: url, payload });
      options.refetch && options.refetch();
      notifier.success({
        message: (deleteData?.msg as string) || "Operation successful",
        timer: 6000,
      });
      options.actioncallbacks?.deleteCallBack &&
        options.actioncallbacks?.deleteCallBack(data, row);
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
    HandleUpdate: HandleUpdate,
    HandleDeleteData: HandleDelete,
  });

  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
};
