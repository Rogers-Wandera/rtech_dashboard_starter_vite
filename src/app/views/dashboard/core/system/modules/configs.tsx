import TablerIconLoader from "@/components/shared/iconloader";
import TablerIconSelector from "@/components/shared/iconselector";
import {
  RowMenuItems,
  TableColumnConfigs,
  TableColumns,
} from "@/components/tables/configs/mrtconfigs/shared.config";
import { AppActions, AppReducerActions } from "@/lib/reducers/app/app.actions";
import { helpers } from "@/lib/utils/helpers/helper";
import { ModuleType } from "@/types/app/core/system.types";
import { NumberInput, TextInput } from "@mantine/core";
import { IconExchange } from "@tabler/icons-react";
import { useNavigate } from "react-router";

export const ModuleColumns: TableColumns<ModuleType>[] = [
  {
    accessorKey: "name",
    header: "Module Name",
    type: "text",
  },
  {
    accessorKey: "icon",
    type: "text",
    header: "Icon",
  },
  {
    accessorKey: "position",
    type: "text",
    header: "Position",
  },
  {
    accessorKey: "isActive",
    type: "text",
    header: "No Links",
  },
];

export const ModulesColumnConfigs = (
  validationErrors: Record<string, string | undefined>
): TableColumnConfigs<ModuleType>[] => {
  return [
    {
      accessorKey: "icon",
      Cell: ({ row }) => {
        return <TablerIconLoader iconName={row.original.icon} size={22} />;
      },
      Edit: ({ row, column, table }) => {
        const isediting = table.getState().editingRow?.original.icon;
        const onChange = (value: string | null) => {
          row._valuesCache[column.id] = value;
        };
        return (
          <TablerIconSelector
            comboboxProps={{ zIndex: "10000" }}
            onChange={onChange}
            value={isediting}
            error={validationErrors["icon"]}
          />
        );
      },
    },
    {
      accessorKey: "name",
      Edit: ({ row, column, table }) => {
        const isediting = table.getState().editingRow?.original.name;
        const onChange = (
          event: React.ChangeEvent<HTMLInputElement> | undefined
        ) => {
          row._valuesCache[column.id] = event?.target?.value;
        };
        return (
          <TextInput
            label="Module Name"
            value={isediting}
            onChange={onChange}
            error={validationErrors["name"]}
          />
        );
      },
    },
    {
      accessorKey: "isActive",
      Cell: ({ row }) => row.original?.modulelinks?.length || 0,
      Edit: () => null,
    },
    {
      accessorKey: "position",
      Edit: ({ row, column, table }) => {
        const iscreating = table.getState().creatingRow;
        const isediting = table.getState().editingRow?.original.position;
        const onChange = (value: number | string) => {
          row._valuesCache[column.id] = value;
        };
        if (iscreating) {
          return null;
        }
        return (
          <NumberInput
            label="Position"
            value={isediting}
            onChange={onChange}
            error={validationErrors["position"]}
          />
        );
      },
    },
  ];
};

export const ModuleMenuItems = (
  dispatch: React.Dispatch<AppReducerActions>
): RowMenuItems<ModuleType>[] => {
  const navigate = useNavigate();
  return [
    {
      label: "Manage",
      onClick: (row) => {
        const url = `/dashboard/core/system/modulelinks/${helpers.encryptUrl(
          String(row.original.id)
        )}`;
        dispatch({ type: AppActions.PAGE_STATE, payload: row.original });
        navigate(url);
      },
      icon: <IconExchange />,
    },
  ];
};
