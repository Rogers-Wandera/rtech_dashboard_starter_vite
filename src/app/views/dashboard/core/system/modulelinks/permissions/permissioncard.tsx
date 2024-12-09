import { Permission } from "@/types/app/auth/auth.types";
import { Alert, Container, Flex, ScrollArea, Tooltip } from "@mantine/core";
import { IconButton, List, styled } from "@mui/material";
import LinkPermission from "./permission";
import {
  IconEyeOff,
  IconClipboardPlus,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import LinkPermissionModal from "./permissionsmodal";
import { TanStackRefetchType } from "@/types/app/app.types";
import { PaginateResponse } from "@/types/server/server.main.types";
import { ModuleLinkType } from "@/types/app/core/system.types";
import { useState } from "react";

type props = {
  permissions: Permission[];
  linkId: number;
  close: () => void;
  refetch: TanStackRefetchType<PaginateResponse<ModuleLinkType>>;
};
const Wrapper = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const LinkPermissionCard = ({ permissions, close, linkId, refetch }: props) => {
  const [opened, { close: closemodal, open }] = useDisclosure(false);
  const [linkData, setLinkData] = useState<Permission | null>(null);
  return (
    <ScrollArea h={205}>
      <LinkPermissionModal
        refetch={refetch}
        linkId={linkId}
        opened={opened}
        setEditData={setLinkData}
        editData={linkData}
        close={closemodal}
      />
      <Wrapper>
        <Flex justify="flex-end" mx={20}>
          <Tooltip label="Hide Permissions" onClick={close}>
            <IconButton color="secondary">
              <IconEyeOff />
            </IconButton>
          </Tooltip>
          <Tooltip
            label="Add Permission"
            onClick={() => {
              open();
              setLinkData(null);
            }}
          >
            <IconButton color="primary">
              <IconClipboardPlus />
            </IconButton>
          </Tooltip>
        </Flex>
        <List dense>
          {permissions.length > 0 &&
            permissions.map((permission) => (
              <LinkPermission
                setEditData={setLinkData}
                open={open}
                permission={permission}
                key={permission.id}
                refetch={refetch}
              />
            ))}
        </List>
        {permissions.length <= 0 && (
          <Container mb={10}>
            <Alert
              variant="light"
              color="blue"
              title="Oops!!"
              icon={<IconInfoCircle />}
            >
              No permissions for this link found
            </Alert>
          </Container>
        )}
      </Wrapper>
    </ScrollArea>
  );
};

export default LinkPermissionCard;
