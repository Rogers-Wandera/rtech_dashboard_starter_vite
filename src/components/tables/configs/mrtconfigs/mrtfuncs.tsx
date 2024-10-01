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
  TopToolBarProps,
} from "./mrtserverside.configs";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ArrowBack, Refresh } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { ReactNode } from "react";
import { Edit, Delete } from "@mui/icons-material";

export function GenerateColumns<TData extends Record<string, any>>(
  tablecolumns: TableColumns<TData>[],
  other: TableColumnConfigs<TData>[]
): MRT_ColumnDef<TData>[] {
  if (tablecolumns.length > 0) {
    const columns: MRT_ColumnDef<TData>[] = tablecolumns.map((column) => {
      const header = column?.header ? column.header : column.accessorKey;
      let otherconfigs = {};
      if (other && other.length > 0) {
        const exists = other.find(
          (item) => item.accessorKey === column.accessorKey
        );
        exists && (otherconfigs = exists);
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

export function RenderTopBarComponents<T extends Record<string, any>>({
  table,
  refetch = () => {},
  showback = false,
  showCreateBtn = true,
  otherTableOptions = {},
  additionaltopbaractions = [],
}: TopToolBarProps<T>) {
  const navigate = useNavigate();
  return (
    <Box>
      {showback && (
        <Tooltip arrow title="Go back">
          <IconButton
            onClick={() => {
              navigate(-1);
            }}
            color="secondary"
          >
            <ArrowBack />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip arrow title="Refresh Data">
        <IconButton
          onClick={() => {
            table.setColumnFilters([]);
            refetch();
          }}
        >
          <Refresh />
        </IconButton>
      </Tooltip>
      {showCreateBtn && (
        <Tooltip arrow title={"Add New"}>
          <IconButton
            onClick={() => {
              table.setCreatingRow(true);
              if (otherTableOptions?.createDisplayMode === "custom") {
                // if (customCallback) {
                //   customCallback(table);
                // }
              }
            }}
          >
            <AddBoxIcon />
          </IconButton>
        </Tooltip>
      )}

      {additionaltopbaractions &&
        additionaltopbaractions.length > 0 &&
        additionaltopbaractions.map((action, index) => {
          let show = (
            <Tooltip arrow title={action.label} key={index}>
              <IconButton
                onClick={() => {
                  const rows = table.getSelectedRowModel().rows;
                  const row = rows[0];
                  action.onClick(table, row, rows);
                }}
              >
                {action.icon}
              </IconButton>
            </Tooltip>
          );
          if (action.show === "text") {
            const placement =
              action.buttonconfigs?.iconplacement === "end"
                ? { endIcon: action.icon }
                : { startIcon: action.icon };
            show = (
              <Tooltip arrow title={action.label} key={index}>
                <Button
                  {...placement}
                  // startIcon={action.icon}
                  variant={action.buttonconfigs?.variant || "contained"}
                  size={action.buttonconfigs?.size || "small"}
                  color={action.buttonconfigs?.color || "primary"}
                  {...action.buttonconfigs?.otherprops}
                  onClick={() => {
                    const rows = table.getSelectedRowModel().rows;
                    const row = rows[0];
                    action.onClick(table, row, rows);
                  }}
                >
                  {action.label}
                </Button>
              </Tooltip>
            );
          }
          return show;
        })}
    </Box>
  );
}

export function HandleRenderAddEditDialogs<T extends Record<string, any>>({
  addtitle = undefined,
  edittitle = undefined,
  variant = undefined,
}: addeditprops) {
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
          {addtitle || "Add New Data"}
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
          {edittitle || "Edit Data"}
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
};

export const HandleRenderRowActionMenus = <T extends Record<string, any>>({
  title,
  HandleDeleteData = () => {},
  rowactions = {
    editrender: false,
    deleterender: false,
    actiontype: "menu",
  },
  menuitems = [],
}: rowactions<T>) => {
  if (rowactions.actiontype === "menu") {
    return {
      renderRowActionMenuItems: ({
        row,
        table,
        closeMenu = () => {},
      }: actiontypeprops<T>) => {
        const editrender =
          typeof rowactions.editrender === "function"
            ? rowactions.editrender(row)
            : rowactions.editrender;
        const deleterender =
          typeof rowactions.deleterender === "function"
            ? rowactions.deleterender(row)
            : rowactions.deleterender;
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
                  typeof item.icon === "function" ? item.icon(row) : item.icon
                }
                label={
                  typeof item.label === "function"
                    ? item.label(row)
                    : item.label
                }
                table={table}
                onClick={() => {
                  item.onClick(row, table);
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
              label="Edit"
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
              label="Delete"
              onClick={() => {
                closeMenu();
                HandleDeleteData(row);
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
        const editrender =
          typeof rowactions.editrender === "function"
            ? rowactions.editrender(row)
            : rowactions.editrender;
        const deleterender =
          typeof rowactions.deleterender === "function"
            ? rowactions.deleterender(row)
            : rowactions.deleterender;
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
                <IconButton
                  color="primary"
                  onClick={() => {
                    item.onClick(row, table);
                  }}
                >
                  {typeof item.icon === "function" ? item.icon(row) : item.icon}
                </IconButton>
              </Tooltip>
            );
          }
        });
        return (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            {editrender && (
              <Tooltip title={"Edit " + title}>
                <IconButton onClick={() => table.setEditingRow(row)}>
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
            {deleterender && (
              <Tooltip title={"Delete " + title}>
                <IconButton color="error" onClick={() => HandleDeleteData(row)}>
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
