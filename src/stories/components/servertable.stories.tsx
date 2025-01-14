import type { StoryObj, Meta } from "@storybook/react";
import { MRT_ServerTable } from "../../components/tables/mrttables/server/mrtserverside";
import { Provider } from "react-redux";
import { store } from "@/lib/store/store";
import { fn } from "@storybook/test";

const ServerTableMeta: Meta<typeof MRT_ServerTable> = {
  component: MRT_ServerTable,
  tags: ["autodocs"],
  title: "Developer/Server side Table",
  parameters: {
    docs: {
      description: {
        component:
          "Component to display server side table data with pagination and other functionalities embeded into it. it uses React Material table under the hood, see https://www.material-react-table.com/ \n It uses the useMRTPaginateTable hook to fetch and set data in the MRTTableContext data which is picked up by the component",
      },
    },
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

export default ServerTableMeta;

type Story = StoryObj<typeof MRT_ServerTable>;

export const Basic_Table: Story = {
  args: {
    tablecolumns: [
      { accessorKey: "name", type: "text", header: "Name" },
      { accessorKey: "age", type: "text", header: "Age" },
      { accessorKey: "password", type: "text", header: "Password" },
    ],
  },
  render: (args) => <MRT_ServerTable {...args} />,
};

export const Custom_Table: Story = {
  args: {
    tablecolumns: [
      { accessorKey: "name", type: "text", header: "Name" },
      { accessorKey: "age", type: "text", header: "Age" },
      {
        accessorKey: "password",
        type: "text",
        header: "Password",
        Edit: () => null,
      },
    ],
    columnConfigs: [
      { accessorKey: "name", muiEditTextFieldProps: { disabled: true } },
    ],
    refetch: fn,
    enableEditing: true,
    enableRowActions: true,
    enableRowSelection: true,
    idField: "text",
    showback: true,
    showCreateBtn: false,
    title: "Table Title e.g (People)",
    otherTableOptions: { enableRowDragging: true },
  },
  render: (args) => <MRT_ServerTable {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Customisable table component, Check the Custom Table tab for options usage",
      },
    },
  },
};
