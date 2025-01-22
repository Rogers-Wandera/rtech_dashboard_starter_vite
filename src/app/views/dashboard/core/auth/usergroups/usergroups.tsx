import RouteRoles from "@/hocs/verifyroles";
import UserGroupHeader from "./header/header";
import UserGroupsPage from "./groups/groups";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import Meta from "@/components/shared/meta";

const UserGroups = () => {
  const [search, setSearch] = useState("");
  const [opened, { close, open }] = useDisclosure(false);

  const HandleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearch(e.target.value);
  };
  return (
    <div>
      <Meta title="User Groups" header="Manage User Groups" />
      <UserGroupHeader
        search={search}
        open={open}
        HandleSearchChange={HandleSearchChange}
      />
      <UserGroupsPage
        search={search}
        opened={opened}
        close={close}
        open={open}
      />
    </div>
  );
};

export default RouteRoles(UserGroups);
