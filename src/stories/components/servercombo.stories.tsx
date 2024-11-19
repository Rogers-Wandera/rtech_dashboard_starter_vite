import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/notifications/styles.css";

import ServerCombo from "../../components/shared/serversidecombo/servercombo";

import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "@/lib/store/store";
import { MantineProvider } from "@mantine/core";
const queryClient = new QueryClient();

const ServerComboMeta: Meta<typeof ServerCombo> = {
  component: ServerCombo,
  tags: ["autodocs"],
  title: "Developer/Serverside combobox",

  parameters: {
    docs: {
      description: {
        component:
          "Component to render server side data into a combobox, it uses mantine core under the hood. see https://mantine.dev/core/select/",
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MantineProvider>
            <Story />
          </MantineProvider>
        </Provider>
      </QueryClientProvider>
    ),
  ],
};

export default ServerComboMeta;

type Story = StoryObj<typeof ServerCombo>;

export const ServerCombobox: Story = {
  args: {
    url: "https://jsonplaceholder.typicode.com/users",
    textKey: "name",
    valueKey: "id",
    limit: 100,
    endPoint: "users",
    label: "Users",
    onChange: () => {},
    placeholder: "Select User",
    value: "",
    onlyAuth: false,
  },
  render: (args) => <ServerCombo {...args} />,
};
