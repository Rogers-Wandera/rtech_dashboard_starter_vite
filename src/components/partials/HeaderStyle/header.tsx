import { useEffect, Fragment, memo, useState } from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import CustomToggle from "../../shared/dropdowns";

//img
import flag1 from "@/assets/images/Flag/flag-01.png";
import avatars1 from "@/assets/images/avatars/01.png";
// logo
import Logo from "../../shared/logo";

// Redux Selector / Action
import { useSelector } from "react-redux";

// Import selectors & action from setting store
import * as SettingSelector from "@/lib/store/settings/dasboardsettings/selectors";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Combobox, Image, Switch, useCombobox } from "@mantine/core";
import { Link, useNavigate } from "react-router";
import { useAppDispatch } from "@/hooks/store.hooks";
import { logOut } from "@/lib/store/services/auth/auth.slice";
import { notifier } from "@/lib/utils/notify/notification";
import { useAuth } from "@/hooks/auth/auth.hooks";
import { helpers } from "@/lib/utils/helpers/helper";
import NotificationsPage from "@/app/views/notifications/notifications";
import { useSocketEmit } from "@/hooks/services/socket.hooks";
import { USER_EVENTS } from "@/types/enums/event.enums";
import { IconBellFilled, IconMessageFilled } from "@tabler/icons-react";
import RingingBellWithBadge from "@/components/shared/ringingbell";
import { useNotification } from "@/lib/context/notifications/notification";
import { ServerModuleRes } from "@/types/server/server.main.types";
import { stopTimer } from "@/lib/store/services/auth/session.slice";
import { setSession } from "@/lib/store/services/defaults/defaults";
import NotificationDropdown from "@/app/views/notifications_new/notifcations";

const Header = memo(() => {
  const combobox = useCombobox();
  const { counts } = useNotification();
  const { user, modules, sessionId } = useAuth();
  const emit = useSocketEmit(USER_EVENTS.LOGOUT, { namespace: "user" });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [links, setLinks] = useState<ServerModuleRes[]>([]);
  const modulelinks = Object.values(modules)?.flat() || [];
  const navbarHide = useSelector(SettingSelector.navbar_show); // array
  const headerNavbar = useSelector(SettingSelector.header_navbar);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const minisidebar = () => {
    document.getElementsByTagName("ASIDE")[0].classList.toggle("sidebar-mini");
  };

  const shouldFilterOptions = links.every(
    (item) => item.linkname !== searchTerm
  );
  const filteredOptions = shouldFilterOptions
    ? links.filter((item) =>
        item.linkname.toLowerCase().includes(searchTerm.toLowerCase().trim())
      )
    : links;

  const options = filteredOptions.map((item, i) => (
    <Combobox.Option
      onClick={() => navigate(item.route)}
      value={item.linkname + i}
      key={item.linkname + i}
    >
      {item.linkname}
    </Combobox.Option>
  ));

  const HandleLogOut = async () => {
    await emit({ userId: user?.id, sessionId });
    dispatch(logOut());
    dispatch(stopTimer());
    dispatch(setSession(false));
    notifier.success({ message: "Logout Successful" });
  };
  const image = (user?.image && helpers.decrypt(user.image)) || avatars1;
  useEffect(() => {
    // navbarstylemode
    if (headerNavbar === "navs-sticky" || headerNavbar === "nav-glass") {
      window.onscroll = () => {
        if (document.documentElement.scrollTop > 50) {
          document.getElementsByTagName("nav")[0].classList.add("menu-sticky");
        } else {
          document
            .getElementsByTagName("nav")[0]
            .classList.remove("menu-sticky");
        }
      };
    }
  });

  useEffect(() => {
    const filteredlinks = modulelinks.filter(
      (link) => link.default != 1 && link.render === 1 && link.expired != 1
    );
    setLinks(filteredlinks);
  }, [modules]);
  return (
    <Fragment>
      <Navbar
        expand="lg"
        variant="light"
        className={`nav iq-navbar ${headerNavbar} ${navbarHide.join(" ")}`}
      >
        <Container fluid className="navbar-inner">
          <Link to="/dashboard" className="navbar-brand">
            <Logo color={true} />
            <h4 className="logo-title">MBRS</h4>
          </Link>
          <div
            className="sidebar-toggle"
            data-toggle="sidebar"
            data-active="true"
            onClick={minisidebar}
          >
            <i className="icon">
              <svg width="20px" height="20px" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"
                />
              </svg>
            </i>
          </div>
          <div className="input-group search-input">
            <span className="input-group-text" id="search-input">
              <svg
                width="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="11.7669"
                  cy="11.7666"
                  r="8.98856"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></circle>
                <path
                  d="M18.0186 18.4851L21.5426 22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
            <Combobox store={combobox}>
              <Combobox.Target>
                <input
                  type="search"
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.currentTarget.value);
                    combobox.openDropdown();
                    combobox.updateSelectedOptionIndex();
                  }}
                  onClick={() => combobox.openDropdown()}
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  placeholder="Search..."
                />
              </Combobox.Target>

              <Combobox.Dropdown>
                <Combobox.Options mah={100} style={{ overflowY: "auto" }}>
                  {options.length > 0 ? (
                    options
                  ) : (
                    <Combobox.Empty>Nothing found</Combobox.Empty>
                  )}
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
          </div>
          <Navbar.Toggle aria-controls="navbarSupportedContent">
            <span className="navbar-toggler-icon">
              <span className="mt-2 navbar-toggler-bar bar1"></span>
              <span className="navbar-toggler-bar bar2"></span>
              <span className="navbar-toggler-bar bar3"></span>
            </span>
          </Navbar.Toggle>
          <Navbar.Collapse id="navbarSupportedContent">
            <Nav
              as="ul"
              className="mb-2 ms-auto navbar-list mb-lg-0 align-items-center"
            >
              <Nav.Link
                className="btn btn-primary btn-sm d-flex gap-2 align-items-center me-2"
                href="/dashboard"
                // target="_blank"
              >
                <svg
                  className="icon-22 me-2"
                  width="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.4274 2.5783C20.9274 2.0673 20.1874 1.8783 19.4974 2.0783L3.40742 6.7273C2.67942 6.9293 2.16342 7.5063 2.02442 8.2383C1.88242 8.9843 2.37842 9.9323 3.02642 10.3283L8.05742 13.4003C8.57342 13.7163 9.23942 13.6373 9.66642 13.2093L15.4274 7.4483C15.7174 7.1473 16.1974 7.1473 16.4874 7.4483C16.7774 7.7373 16.7774 8.2083 16.4874 8.5083L10.7164 14.2693C10.2884 14.6973 10.2084 15.3613 10.5234 15.8783L13.5974 20.9283C13.9574 21.5273 14.5774 21.8683 15.2574 21.8683C15.3374 21.8683 15.4274 21.8683 15.5074 21.8573C16.2874 21.7583 16.9074 21.2273 17.1374 20.4773L21.9074 4.5083C22.1174 3.8283 21.9274 3.0883 21.4274 2.5783Z"
                    fill="currentColor"
                  ></path>
                  <path
                    opacity="0.4"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.01049 16.8079C2.81849 16.8079 2.62649 16.7349 2.48049 16.5879C2.18749 16.2949 2.18749 15.8209 2.48049 15.5279L3.84549 14.1619C4.13849 13.8699 4.61349 13.8699 4.90649 14.1619C5.19849 14.4549 5.19849 14.9299 4.90649 15.2229L3.54049 16.5879C3.39449 16.7349 3.20249 16.8079 3.01049 16.8079ZM6.77169 18.0003C6.57969 18.0003 6.38769 17.9273 6.24169 17.7803C5.94869 17.4873 5.94869 17.0133 6.24169 16.7203L7.60669 15.3543C7.89969 15.0623 8.37469 15.0623 8.66769 15.3543C8.95969 15.6473 8.95969 16.1223 8.66769 16.4153L7.30169 17.7803C7.15569 17.9273 6.96369 18.0003 6.77169 18.0003ZM7.02539 21.5683C7.17139 21.7153 7.36339 21.7883 7.55539 21.7883C7.74739 21.7883 7.93939 21.7153 8.08539 21.5683L9.45139 20.2033C9.74339 19.9103 9.74339 19.4353 9.45139 19.1423C9.15839 18.8503 8.68339 18.8503 8.39039 19.1423L7.02539 20.5083C6.73239 20.8013 6.73239 21.2753 7.02539 21.5683Z"
                    fill="currentColor"
                  ></path>
                </svg>
                Feedback
              </Nav.Link>
              <Dropdown as="li" className="nav-item">
                <Dropdown.Toggle
                  as={CustomToggle}
                  variant="search-toggle nav-link"
                >
                  <Image
                    src={flag1}
                    className="img-fluid rounded-circle"
                    alt="user"
                    style={{ height: "30px", minWidth: "30px", width: "30px" }}
                  />
                  <span className="bg-primary"></span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="p-0 sub-drop dropdown-menu-end">
                  <div className="m-0 border-0 shadow-none card">
                    <div className="p-0 ">
                      <ul className="list-group list-group-flush">
                        <li className="iq-sub-card list-group-item">
                          <Link className="p-0" to="#">
                            <Image
                              src={flag1}
                              alt="img-flaf"
                              className="img-fluid me-2"
                              style={{
                                width: "15px",
                                height: "15px",
                                minWidth: "15px",
                              }}
                            />
                            Italian
                          </Link>
                        </li>
                        <li className="iq-sub-card list-group-item">
                          <Link className="p-0" to="#">
                            <Image
                              src={flag1}
                              alt="img-flaf"
                              className="img-fluid me-2"
                              style={{
                                width: "15px",
                                height: "15px",
                                minWidth: "15px",
                              }}
                            />
                            French
                          </Link>
                        </li>
                        <li className="iq-sub-card list-group-item">
                          <Link className="p-0" to="#">
                            <Image
                              src={flag1}
                              alt="img-flaf"
                              className="img-fluid me-2"
                              style={{
                                width: "15px",
                                height: "15px",
                                minWidth: "15px",
                              }}
                            />
                            German
                          </Link>
                        </li>
                        <li className="iq-sub-card list-group-item">
                          <Link className="p-0" to="#">
                            <Image
                              src={flag1}
                              alt="img-flaf"
                              className="img-fluid me-2"
                              style={{
                                width: "15px",
                                height: "15px",
                                minWidth: "15px",
                              }}
                            />
                            Spanish
                          </Link>
                        </li>
                        <li className="iq-sub-card list-group-item">
                          <Link className="p-0" to="#">
                            <Image
                              src={flag1}
                              alt="img-flaf"
                              className="img-fluid me-2"
                              style={{
                                width: "15px",
                                height: "15px",
                                minWidth: "15px",
                              }}
                            />
                            Japanese
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown as="li" className="nav-item">
                {/* <Dropdown.Toggle
                  as={CustomToggle}
                  href="#"
                  variant=" nav-link"
                  id="notification-drop"
                  data-bs-toggle="dropdown"
                >
                  {counts.unread > 0 ? (
                    <RingingBellWithBadge count={counts.unread} />
                  ) : (
                    <IconBellFilled />
                  )}

                  <span className="bg-danger dots"></span>
                </Dropdown.Toggle> */}
                <NotificationDropdown />
                <Dropdown.Menu
                  className="p-0 sub-drop dropdown-menu-end"
                  aria-labelledby="notification-drop"
                >
                  <div className="m-0 shadow-none card">
                    {/* <NotificationsPage /> */}
                  </div>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown as="li" className="nav-item">
                <Dropdown.Toggle
                  as={CustomToggle}
                  href="#"
                  variant="nav-link"
                  id="mail-drop"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <IconMessageFilled />
                  <span className="bg-primary count-mail"></span>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="p-0 sub-drop dropdown-menu-end"
                  aria-labelledby="mail-drop"
                >
                  <div className="m-0 shadow-none card">
                    <div className="py-3 card-header d-flex justify-content-between bg-primary">
                      <div className="header-title">
                        <h5 className="mb-0 text-white">All Message</h5>
                      </div>
                    </div>
                    <div className="p-0 card-body ">
                      {/* <Link to="#" className="iq-sub-card">
                        <div className="d-flex align-items-center">
                          <div>
                            <img
                              className="p-1 avatar-40 rounded-pill bg-soft-primary"
                              src={shapes1}
                              alt=""
                            />
                          </div>
                          <div className=" w-100 ms-3">
                            <h6 className="mb-0 ">Bni Emma Watson</h6>
                            <small className="float-left font-size-12">
                              13 Jun
                            </small>
                          </div>
                        </div>
                      </Link> */}
                      <Alert severity="info">
                        <AlertTitle>Info</AlertTitle>
                        No messages at the moment.
                      </Alert>
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown as="li" className="nav-item">
                <Dropdown.Toggle
                  as={CustomToggle}
                  variant=" nav-link py-0 d-flex align-items-center"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <Image
                    src={image}
                    alt="user"
                    className="theme-color-default-img img-fluid avatar avatar-50 avatar-rounded"
                  />
                  <div className="caption ms-3 d-none d-md-block ">
                    <h6 className="mb-0 caption-title">{user?.displayName}</h6>
                    <p className="mb-0 caption-sub-title">{user?.position}</p>
                    <Switch
                      size="lg"
                      color="green"
                      checked={true}
                      onLabel="Online"
                      offLabel="Offline"
                    />
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="dropdown-menu-end"
                  aria-labelledby="navbarDropdown"
                >
                  <Dropdown.Item
                    onClick={() => {
                      navigate(
                        `/dashboard/core/auth/user/${helpers.encryptUrl(
                          String(user?.id)
                        )}`
                      );
                    }}
                  >
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item href="">Privacy Setting</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={HandleLogOut}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Fragment>
  );
});

Header.displayName = "Header";
export default Header;
