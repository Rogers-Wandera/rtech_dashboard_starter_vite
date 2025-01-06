import TablerIconLoader from "@/components/shared/iconloader";
import { useMaterialTheme } from "@/lib/themes/material.theme";
import { ServerRoles } from "@/types/app/auth/auth.types";
import { UserGroup, UserSingleView } from "@/types/app/core/user.type";
import { Table, Flex, Title } from "@mantine/core";
import { Fragment } from "react/jsx-runtime";
import LinkRolePage from "./linkpage";
import { TanStackRefetchType } from "@/types/app/app.types";
import { PaginateResponse } from "@/types/server/server.main.types";

type user_roles = {
  type: "user";
  data: UserSingleView;
  role: ServerRoles;
};

type group_roles = {
  type: "group";
  data: UserGroup;
  role: ServerRoles;
};

type props = (user_roles | group_roles) & {
  refetch: TanStackRefetchType<PaginateResponse<ServerRoles>>;
};

const RolePage = ({ role, data, type, refetch }: props) => {
  const theme = useMaterialTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Fragment>
      {/* Parent Module */}
      <Table.Tr>
        <Table.Td colSpan={3} bg={!isDark ? "#F6F6F6" : ""}>
          <Flex gap={10}>
            <TablerIconLoader iconName={role.icon} />
            <Title order={4}>{role.module}</Title>
          </Flex>
        </Table.Td>
      </Table.Tr>

      {/* Links under module*/}
      {type === "user" &&
        role.links.map((link) => (
          <LinkRolePage
            refetch={refetch}
            key={link.id}
            link={link}
            data={data}
            type="user"
          />
        ))}
    </Fragment>
  );
};

export default RolePage;
