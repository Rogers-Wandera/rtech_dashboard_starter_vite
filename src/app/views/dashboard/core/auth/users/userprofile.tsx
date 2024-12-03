import { InputWithButton } from "@/components/shared/inputwithbutton";
import {
  Container,
  Table,
  Checkbox,
  ActionIcon,
  Card,
  Flex,
  Title,
  ScrollArea,
} from "@mantine/core";
import { IconEye, IconUserSquareRounded } from "@tabler/icons-react";

const UserProfile = () => {
  return (
    <Container pt={60}>
      <ScrollArea h={400}>
        <Card>
          <InputWithButton placeholder="Search Module" />
          <Table.ScrollContainer minWidth={300}>
            <Table verticalSpacing="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>
                    <Title order={3}>Modules</Title>
                  </Table.Th>
                  <Table.Th>
                    <Title order={3}>Assign Roles</Title>
                  </Table.Th>
                  <Table.Th>
                    <Title order={3}>View</Title>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {/* Parent Module */}
                <Table.Tr>
                  <Table.Td colSpan={3} bg="#F6F6F6">
                    <Flex gap={10}>
                      <IconUserSquareRounded />
                      <strong>User Management</strong>
                    </Flex>
                  </Table.Td>
                </Table.Tr>

                {/* Links under User Management */}
                <Table.Tr style={{ borderBottom: "none", borderTop: "none" }}>
                  <Table.Td style={{ paddingLeft: "20px", border: "none" }}>
                    Manage Users
                  </Table.Td>
                  <Table.Td style={{ border: "none" }}>
                    <Checkbox color="violet" size="md" />
                  </Table.Td>
                  <Table.Td style={{ border: "none" }}>
                    <ActionIcon>
                      <IconEye size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr style={{ borderBottom: "none", borderTop: "none" }}>
                  <Table.Td style={{ paddingLeft: "20px", border: "none" }}>
                    Assign Roles
                  </Table.Td>
                  <Table.Td style={{ border: "none" }}>
                    <Checkbox color="violet" size="md" />
                  </Table.Td>
                  <Table.Td style={{ border: "none" }}>
                    <ActionIcon>
                      <IconEye size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr style={{ borderBottom: "none", borderTop: "none" }}>
                  <Table.Td style={{ paddingLeft: "20px", border: "none" }}>
                    View Permissions
                  </Table.Td>
                  <Table.Td style={{ border: "none" }}>
                    <Checkbox color="violet" size="md" />
                  </Table.Td>
                  <Table.Td style={{ border: "none" }}>
                    <ActionIcon>
                      <IconEye size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>
      </ScrollArea>
    </Container>
  );
};

export default UserProfile;
