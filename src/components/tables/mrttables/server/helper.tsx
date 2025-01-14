import { useNavigate } from "react-router";
import { TopToolBarProps } from "../../configs/mrtconfigs/shared.config";
import { Box } from "@mantine/core";
import { Button, IconButton, Tooltip } from "@mui/material";
import { ArrowBack, Refresh } from "@mui/icons-material";
import AddBoxIcon from "@mui/icons-material/AddBox";

export function RenderTopBarComponents<T extends Record<string, any>>({
  table,
  refetch = () => {},
  showback = false,
  showCreateBtn = true,
  otherTableOptions = {},
  additionaltopbaractions = [],
  customCallBack = undefined,
  title = "Data",
}: TopToolBarProps<T> & { title?: string }) {
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
        <Tooltip arrow title={"Add New " + title}>
          <IconButton
            onClick={() => {
              table.setCreatingRow(true);
              if (otherTableOptions?.createDisplayMode === "custom") {
                if (customCallBack) {
                  customCallBack(table);
                }
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
