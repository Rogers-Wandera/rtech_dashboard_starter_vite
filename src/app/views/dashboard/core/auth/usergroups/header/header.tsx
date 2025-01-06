import Card from "@/components/shared/Card";
import { SearchInput } from "@/components/shared/inputs/search";
import { Button, Flex, Group, Text, Title } from "@mantine/core";
import { IconClipboardPlus } from "@tabler/icons-react";
import { Col } from "react-bootstrap";

type props = {
  search: string;
  open: () => void;
  HandleSearchChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};
const UserGroupHeader = ({ search, HandleSearchChange, open }: props) => {
  return (
    <Col lg="12">
      <Card>
        <Card.Body>
          <Flex
            direction={{ base: "row", sm: "row" }}
            gap={{ base: "sm", sm: "lg" }}
            justify={{ sm: "center", md: "space-between" }}
          >
            <Group>
              <Title className="me-2" order={2}>
                User Groups
              </Title>

              <SearchInput
                value={search}
                onChange={HandleSearchChange}
                placeholder="Search Group..."
              />
            </Group>
            <Text>
              <Button onClick={open} leftSection={<IconClipboardPlus />}>
                Add Group
              </Button>
            </Text>
          </Flex>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default UserGroupHeader;
