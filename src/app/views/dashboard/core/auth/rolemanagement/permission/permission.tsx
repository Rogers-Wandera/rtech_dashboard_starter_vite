import { ServerLinkRole } from "@/types/app/core/system.types";
import { Alert, ScrollArea } from "@mantine/core";
import { List, ListSubheader } from "@mui/material";
import { IconInfoCircle } from "@tabler/icons-react";
import RolePermissionPage from "./permissionpage";
import { TanStackRefetchType } from "@/types/app/app.types";
import { PaginateResponse } from "@/types/server/server.main.types";
import { ServerRoles } from "@/types/app/auth/auth.types";

type props = {
  link: ServerLinkRole;
  refetch: TanStackRefetchType<PaginateResponse<ServerRoles>>;
};

const LinkRolePermission = ({ link, refetch }: props) => {
  return (
    <ScrollArea h={165}>
      {link.permissions.length > 0 && (
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          subheader={<ListSubheader>{link.linkname} Permissions</ListSubheader>}
        >
          {link.permissions.map((permission) => (
            <RolePermissionPage
              key={permission.id}
              permission={permission}
              linkRoleId={Number(link.linkRoleId)}
              refetch={refetch}
            />
          ))}
        </List>
      )}
      {link.permissions.length <= 0 && (
        <Alert
          variant="light"
          color="blue"
          title="Oops!"
          icon={<IconInfoCircle />}
        >
          No permissions for this role found
        </Alert>
      )}
    </ScrollArea>
  );
};

export default LinkRolePermission;
