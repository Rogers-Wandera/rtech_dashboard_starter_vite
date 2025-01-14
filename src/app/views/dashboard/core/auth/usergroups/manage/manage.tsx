import { ErrorPage } from "@/components/pages/error/errorPage";
import RouteRoles from "@/hocs/verifyroles";
import { useAppDispatch } from "@/hooks/store.hooks";
import {
  setLoading,
  setShowSubHeader,
} from "@/lib/store/services/defaults/defaults";
import { helpers } from "@/lib/utils/helpers/helper";
import { Box, Button, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import { Card, Col, Nav, Row, Tab } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import GroupInfo from "./groupinfo";
import { UserGroup } from "@/types/app/core/user.type";
import { useFetch } from "@/hooks/usefetch.hook";
import { IconArrowBack } from "@tabler/icons-react";
import GroupUsers from "./users";

const ManageUserGroups = () => {
  const params = useParams<{ groupId: string }>();
  const dispatch = useAppDispatch();
  const groupId = helpers.decryptUrl(String(params.groupId));
  const [manual, setManual] = useState(true);
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useFetch<UserGroup>({
    endPoint: "core/auth/usergroups/" + groupId,
    queryKey: "single-group",
    manual: manual,
    afterFetch: () => {
      setManual(false);
    },
    withAuth: true,
  });

  useEffect(() => {
    dispatch(setShowSubHeader(false));
  }, []);

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
    }
  }, [isLoading]);

  if (isError) {
    return <ErrorPage type="400" message={error?.message} />;
  }

  if (!groupId) {
    return <ErrorPage type="400" />;
  }
  return (
    <Box>
      {data && (
        <Tab.Container defaultActiveKey="group-management">
          <Row>
            <Col lg="12">
              <Card>
                <Card.Body>
                  <Nav
                    as="ul"
                    className="nav-pills mb-0 text-center profile-tab"
                    data-toggle="slider-tab"
                    id="profile-pills-tab"
                    role="tablist"
                  >
                    <Flex justify="space-between" w="100%">
                      <Flex gap={10}>
                        <Button
                          variant="transparent"
                          leftSection={<IconArrowBack />}
                          onClick={() => navigate(-1)}
                        >
                          Back
                        </Button>
                        <Nav.Item as="li">
                          <Nav.Link eventKey="group-users">Users</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                          <Nav.Link eventKey="group-roles">Roles</Nav.Link>
                        </Nav.Item>
                      </Flex>

                      <Nav.Item as="li">
                        <Nav.Link eventKey="group-management">
                          Management
                        </Nav.Link>
                      </Nav.Item>
                    </Flex>
                  </Nav>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Tab.Content>
                <Tab.Pane eventKey="group-management">
                  <GroupInfo group={data} refetch={refetch} />
                </Tab.Pane>
                <Tab.Pane eventKey="group-users">
                  <GroupUsers group={data} />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      )}
    </Box>
  );
};

export default RouteRoles(ManageUserGroups);
