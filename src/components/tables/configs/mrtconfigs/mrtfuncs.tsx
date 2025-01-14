import {
  MRT_ActionMenuItem,
  MRT_ColumnDef,
  MRT_EditActionButtons,
  MRT_Row,
  MRT_TableInstance,
} from "material-react-table";
import {
  actiontypeprops,
  addeditprops,
  rowactionconfigs,
  RowMenuItems,
  TableColumnConfigs,
  TableColumns,
} from "./shared.config";
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ReactNode } from "react";
import { Edit, Delete } from "@mui/icons-material";
import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCapsuleHorizontalFilled } from "@tabler/icons-react";

export function GenerateColumns<TData extends Record<string, any>>(
  tablecolumns: TableColumns<TData>[],
  other: TableColumnConfigs<TData>[],
  validationErrors: Record<string, string | undefined>,
  setValidationErrors: React.Dispatch<
    React.SetStateAction<Record<string, string | undefined>>
  >
): MRT_ColumnDef<TData>[] {
  if (tablecolumns.length > 0) {
    const columns: MRT_ColumnDef<TData>[] = tablecolumns.map((column) => {
      const header = column?.header ? column.header : column.accessorKey;
      let otherconfigs: Record<string, any> = {};
      let valError = undefined;
      if (other && other.length > 0) {
        const exists = other.find(
          (item) => item.accessorKey === column.accessorKey
        );
        exists && (otherconfigs = exists);
      }
      if (Object.keys(validationErrors).length > 0) {
        valError = validationErrors[column.accessorKey];
        if (valError) {
          if (otherconfigs?.muiEditTextFieldProps) {
            otherconfigs["muiEditTextFieldProps"] = {
              ...otherconfigs["muiEditTextFieldProps"],
              error: !!valError,
              helperText: valError,
              onFocus: () =>
                setValidationErrors({
                  ...validationErrors,
                  [column.accessorKey]: undefined,
                }),
            };
          } else {
            otherconfigs["muiEditTextFieldProps"] = {
              error: !!valError,
              helperText: valError,
              onFocus: () =>
                setValidationErrors({
                  ...validationErrors,
                  [column.accessorKey]: undefined,
                }),
            };
          }
        }
      }
      return {
        ...column,
        header: header,
        filterVariant: column.type,
        ...otherconfigs,
      };
    });
    return columns;
  }
  return [];
}

export function HandleRenderAddEditDialogs<T extends Record<string, any>>({
  addtitle = undefined,
  edittitle = undefined,
  variant = undefined,
  title = "Data",
}: addeditprops & { title?: string }) {
  return {
    renderCreateRowDialogContent: ({
      table,
      row,
      internalEditComponents,
    }: {
      table: MRT_TableInstance<T>;
      row: MRT_Row<T>;
      internalEditComponents: ReactNode;
    }) => (
      <>
        <DialogTitle variant={variant || "h5"} sx={{ textAlign: "center" }}>
          {addtitle || "Add New " + title}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({
      internalEditComponents,
      row,
      table,
    }: {
      table: MRT_TableInstance<T>;
      row: MRT_Row<T>;
      internalEditComponents: ReactNode;
    }) => (
      <>
        <DialogTitle variant={variant || "h5"} sx={{ textAlign: "center" }}>
          {edittitle || "Edit Data " + title}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
  };
}

type rowactions<T extends Record<string, any>> = {
  rowactions?: rowactionconfigs<T>;
  HandleDeleteData?: (row: MRT_Row<T>) => void;
  menuitems?: RowMenuItems<T>[];
  title: string;
  deleteModalProps?: {
    title?: string | ((row: MRT_Row<T>) => string);
    message?: string | ((row: MRT_Row<T>) => string);
    confirmLabel?: string | ((row: MRT_Row<T>) => string);
    cancelLabel?: string;
  };
};

export const HandleRenderRowActionMenus = <T extends Record<string, any>>({
  title,
  HandleDeleteData = () => {},
  rowactions = {
    editrender: true,
    deleterender: true,
    actiontype: "menu",
  },
  menuitems = [],
  deleteModalProps = {
    title: undefined,
    message: undefined,
    confirmLabel: undefined,
    cancelLabel: undefined,
  },
}: rowactions<T>) => {
  const text = title && title.endsWith("s") ? title.slice(0, -1) : title || "";

  const openDeleteModal = (row: MRT_Row<T>) => {
    let title = "Delete " + text.toLowerCase();
    let message = `Are you sure you want to delete your ${text.toLowerCase()}? This action
          is destructive and you will have to contact support to restore your
          data.`;
    let confirmLabel = "Confirm";
    if (deleteModalProps.title) {
      if (typeof deleteModalProps.title === "function") {
        title = deleteModalProps.title(row);
      } else {
        title = deleteModalProps.title;
      }
    }
    if (deleteModalProps.message) {
      if (typeof deleteModalProps.message === "function") {
        message = deleteModalProps.message(row);
      } else {
        message = deleteModalProps.message;
      }
    }
    if (deleteModalProps.title) {
      if (typeof deleteModalProps.title === "function") {
        title = deleteModalProps.title(row);
      } else {
        title = deleteModalProps.title;
      }
    }

    if (deleteModalProps.confirmLabel) {
      if (typeof deleteModalProps.confirmLabel === "function") {
        confirmLabel = deleteModalProps.confirmLabel(row);
      } else {
        confirmLabel = deleteModalProps.confirmLabel;
      }
    }
    return modals.openConfirmModal({
      title: title,
      centered: true,
      children: <Text size="sm">{message}</Text>,
      labels: {
        confirm: confirmLabel,
        cancel: deleteModalProps.cancelLabel
          ? deleteModalProps.cancelLabel
          : "Cancel",
      },
      confirmProps: { color: "red" },
      onConfirm: () => HandleDeleteData(row),
    });
  };

  if (rowactions.actiontype === "menu") {
    return {
      renderRowActionMenuItems: ({
        row,
        table,
        closeMenu = () => {},
      }: actiontypeprops<T>) => {
        const editText =
          typeof rowactions.editText === "function"
            ? rowactions.editText(row)
            : rowactions.editText || "Edit";
        const deleteText =
          typeof rowactions.deleteText === "function"
            ? rowactions.deleteText(row)
            : rowactions.deleteText || "Delete";
        const editrender =
          typeof rowactions.editrender === "function"
            ? rowactions.editrender(row)
            : rowactions.editrender === true;
        const deleterender =
          typeof rowactions.deleterender === "function"
            ? rowactions.deleterender(row)
            : rowactions.deleterender === true;
        const additionalcolumns = menuitems.map((item, index) => {
          const render =
            item.render === undefined
              ? true
              : typeof item.render === "function"
              ? item.render(row)
              : item.render;
          if (render) {
            return (
              <MRT_ActionMenuItem
                key={`${item.label}-${index}`}
                icon={
                  item.icon ? (
                    typeof item.icon === "function" ? (
                      item.icon(row)
                    ) : (
                      item.icon
                    )
                  ) : (
                    <IconCapsuleHorizontalFilled />
                  )
                }
                label={
                  typeof item.label === "function"
                    ? item.label(row)
                    : item.label
                }
                table={table}
                onClick={() => {
                  item.onClick && item.onClick(row, table);
                  closeMenu();
                }}
              />
            );
          }
        });
        return [
          editrender && (
            <MRT_ActionMenuItem
              icon={<Edit sx={{ color: "green" }} />}
              key="edit"
              label={editText}
              onClick={() => {
                closeMenu();
                table.setEditingRow(row);
              }}
              table={table}
            />
          ),
          deleterender && (
            <MRT_ActionMenuItem
              icon={<Delete sx={{ color: "red" }} />}
              key="delete"
              label={deleteText}
              onClick={() => {
                closeMenu();
                openDeleteModal(row);
              }}
              table={table}
            />
          ),
          ...additionalcolumns,
        ];
      },
    };
  } else {
    return {
      renderRowActions: ({ row, table }: actiontypeprops<T>) => {
        const editText =
          typeof rowactions.editText === "function"
            ? rowactions.editText(row)
            : rowactions.editText || "Edit " + title;
        const deleteText =
          typeof rowactions.deleteText === "function"
            ? rowactions.deleteText(row)
            : rowactions.deleteText || "Delete " + title;
        const editrender =
          typeof rowactions.editrender === "function"
            ? rowactions.editrender(row)
            : rowactions.editrender === true;
        const deleterender =
          typeof rowactions.deleterender === "function"
            ? rowactions.deleterender(row)
            : rowactions.deleterender === true;
        const additionalcolumns = menuitems.map((item, index) => {
          const render =
            item.render === undefined
              ? true
              : typeof item.render === "function"
              ? item.render(row)
              : item.render;
          if (render) {
            return (
              <Tooltip
                key={`${item.label}-${index}`}
                title={
                  typeof item.label === "function"
                    ? item.label(row)
                    : item.label
                }
              >
                {item.icon ? (
                  <IconButton
                    color="primary"
                    onClick={() => {
                      item.onClick && item.onClick(row, table);
                    }}
                  >
                    {typeof item.icon === "function"
                      ? item.icon(row)
                      : item.icon}
                  </IconButton>
                ) : (
                  <IconButton
                    color="primary"
                    onClick={() => {
                      item.onClick && item.onClick(row, table);
                    }}
                  >
                    <IconCapsuleHorizontalFilled />
                  </IconButton>
                )}
              </Tooltip>
            );
          }
        });
        return (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            {editrender && (
              <Tooltip title={editText}>
                <IconButton onClick={() => table.setEditingRow(row)}>
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
            {deleterender && (
              <Tooltip title={deleteText}>
                <IconButton color="error" onClick={() => openDeleteModal(row)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            )}
            {additionalcolumns}
          </Box>
        );
      },
    };
  }
};
