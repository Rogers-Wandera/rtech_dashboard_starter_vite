import Card from "@/components/shared/Card";
import { Box } from "@mantine/core";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import gent from "@/assets/images/avatars/01.png";
import lady from "@/assets/images/avatars/lady.png";
import ProfileLeft from "./pages/profileleft";
import ProfileRight from "./pages/profileright";
import ProfileTab from "./pages/profiletab";
import { FunctionComponent, useEffect, useState } from "react";
import { IconArrowLeft, IconUpload } from "@tabler/icons-react";
import { Avatar, Badge, styled } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { helpers } from "@/lib/utils/helpers/helper";
import { useFetch } from "@/hooks/usefetch.hook";
import { useAuth } from "@/hooks/auth.hooks";
import { useAppDispatch } from "@/hooks/store.hooks";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import { UserSingleView } from "@/types/app/core/user.type";
import { notifier } from "@/lib/utils/notify/notification";
import { ROLES } from "@/types/enums/enum.types";
import { useDisclosure } from "@mantine/hooks";
import ProfileUpload from "./pages/profileimageupload";
import ManageRoles from "../rolemanagement/roles";

const SmallAvatar = styled(IconUpload)(({ theme }) => ({
  width: 25,
  height: 25,
  cursor: "pointer",
  color: theme.palette.mode === "dark" ? "grey" : "blue",
}));

const UserProfilePage: FunctionComponent = () => {
  const [newsHide, setNewsHide] = useState(false);
  const params = useParams<{ id: string }>();
  const userId = helpers.decryptUrl(String(params.id));
  const [manual, setManual] = useState(true);
  const { token, user: AuthUser } = useAuth();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);

  const dispatch = useAppDispatch();
  const { data, isLoading, isFetching, refetch, isError, error } =
    useFetch<UserSingleView>({
      queryKey: "user_data-" + userId,
      endPoint: "core/auth/users/view/" + userId,
      manual,
      configs: { headers: { Authorization: `Bearer ${token}` } },
    });

  useEffect(() => {
    if (!isLoading && !isFetching) {
      setManual(false);
      dispatch(setLoading(false));
    }
    if (isLoading || isFetching) {
      dispatch(setLoading(true));
    }
  }, [isLoading, isFetching]);

  useEffect(() => {
    if (isError) {
      dispatch(setLoading(false));
      notifier.error({ message: String(error?.message) });
    }
  }, [isError]);

  return (
    <Box>
      {data && (
        <Tab.Container defaultActiveKey="first">
          <ProfileUpload
            refetch={refetch}
            user={data}
            opened={opened}
            close={close}
          />
          <Row>
            <Col lg="12">
              <Card>
                <Card.Body>
                  <div className="d-flex flex-wrap align-items-center justify-content-between">
                    <div className="d-flex flex-wrap align-items-center">
                      <IconArrowLeft
                        color="blue"
                        size={30}
                        onClick={() => navigate(-1)}
                        style={{ cursor: "pointer" }}
                      />
                      <div className="profile-img position-relative me-3 mb-3 mb-lg-0 profile-logo profile-logo1">
                        <Badge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          badgeContent={
                            AuthUser?.id === data.id && (
                              <SmallAvatar
                                onClick={open}
                                className="upload-button"
                                size={30}
                              />
                            )
                          }
                        >
                          <Avatar
                            sx={{ width: 100, height: 100 }}
                            alt={data.userName}
                            src={
                              data.image
                                ? data.image
                                : data.gender.toLowerCase() === "female"
                                ? lady
                                : gent
                            }
                          />
                        </Badge>
                      </div>
                      <div className="d-flex flex-wrap align-items-center mb-3 mb-sm-0">
                        <h4 className="me-2 h4">{data.userName}</h4>
                        <span> - {data.position}</span>
                      </div>
                    </div>
                    <Nav
                      as="ul"
                      className="d-flex nav-pills mb-0 text-center profile-tab"
                      data-toggle="slider-tab"
                      id="profile-pills-tab"
                      role="tablist"
                    >
                      <Nav.Item as="li">
                        <Nav.Link
                          eventKey="first"
                          onClick={() => {
                            setNewsHide(false);
                          }}
                        >
                          Profile
                        </Nav.Link>
                      </Nav.Item>
                      {AuthUser?.roles.includes(ROLES.ADMIN) && (
                        <Nav.Item as="li">
                          <Nav.Link
                            eventKey="second"
                            onClick={() => {
                              setNewsHide(true);
                            }}
                          >
                            Roles
                          </Nav.Link>
                        </Nav.Item>
                      )}
                    </Nav>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            {!newsHide && <ProfileLeft user={data} refetch={refetch} />}
            <Col lg={newsHide ? "9" : "6"}>
              <Tab.Content>
                <ProfileTab open={open} user={data} />
                {AuthUser?.roles.includes(ROLES.ADMIN) && (
                  <Tab.Pane eventKey="second" id="Roles-Management">
                    <ManageRoles type="user" data={data} />
                  </Tab.Pane>
                )}
              </Tab.Content>
            </Col>
            <ProfileRight user={data} />
          </Row>
        </Tab.Container>
      )}
    </Box>
  );
};

export default UserProfilePage;
