import { Button, Col, Form, Image, Row } from "react-bootstrap";
import Card from "@/components/shared/Card";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { PasswordInput, Popover, Progress } from "@mantine/core";
import auth2 from "@/assets/images/auth/02.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  getStrength,
  PasswordRequirement,
  withoutuppercase,
} from "../requirements";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { UseFormReturnType } from "@mantine/form";
import { ResetPasswordValues } from "@/types/app/auth/auth.types";
import { useAppDispatch } from "@/hooks/store.hooks";
import { logOut } from "@/lib/store/services/auth/auth.slice";

type props = {
  form: UseFormReturnType<
    ResetPasswordValues,
    (values: ResetPasswordValues) => ResetPasswordValues
  >;
  HandleSubmit: (values: ResetPasswordValues) => void;
};
const ChangePasswordPage = ({ form, HandleSubmit }: props) => {
  const app_name = useSelector(
    (state: RootState) => state.setting.setting.app_name.value
  );
  const dispatch = useAppDispatch();
  const [popoverOpened, setPopoverOpened] = useState({
    password: false,
    confirmpassword: false,
  });
  const checks = (value: string, confirmcheck: boolean = false) => {
    const req = withoutuppercase.map((requirement, index) => (
      <PasswordRequirement
        key={index}
        label={requirement.label}
        meets={requirement.re.test(value)}
      />
    ));
    if (confirmcheck) {
      req.push(
        <PasswordRequirement
          key="confirmpassword"
          label="Matches password"
          meets={form.getValues().password === form.getValues().confirmpassword}
        />
      );
    }
    return req;
  };

  const strength = (value: string) => {
    return getStrength(value, 8, withoutuppercase);
  };
  const color = (value: string) => {
    return strength(value) === 100
      ? "teal"
      : strength(value) > 50
      ? "yellow"
      : "red";
  };
  return (
    <section className="login-content">
      <Row className="m-0 align-items-center bg-white vh-100">
        <Col
          md="6"
          className="d-md-block d-none bg-primary p-0 mt-n1 vh-100 overflow-hidden"
        >
          <Image
            src={auth2}
            className="img-fluid gradient-main animated-scaleX"
            alt="images"
          />
        </Col>
        <Col md="6" className="p-0">
          <button
            className="btn btn-primary mx-4"
            onClick={() => dispatch(logOut())}
          >
            <ArrowBackIcon />
          </button>
          <Card className="card-transparent auth-card shadow-none d-flex justify-content-center mb-0">
            <Card.Body>
              <Link
                to="/dashboard"
                className="navbar-brand d-flex align-items-center mb-3"
              >
                <svg
                  width="30"
                  className="text-primary"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="-0.757324"
                    y="19.2427"
                    width="28"
                    height="4"
                    rx="2"
                    transform="rotate(-45 -0.757324 19.2427)"
                    fill="currentColor"
                  />
                  <rect
                    x="7.72803"
                    y="27.728"
                    width="28"
                    height="4"
                    rx="2"
                    transform="rotate(-45 7.72803 27.728)"
                    fill="currentColor"
                  />
                  <rect
                    x="10.5366"
                    y="16.3945"
                    width="16"
                    height="4"
                    rx="2"
                    transform="rotate(45 10.5366 16.3945)"
                    fill="currentColor"
                  />
                  <rect
                    x="10.5562"
                    y="-0.556152"
                    width="28"
                    height="4"
                    rx="2"
                    transform="rotate(45 10.5562 -0.556152)"
                    fill="currentColor"
                  />
                </svg>
                <h4 className="logo-title ms-3">{app_name}</h4>
              </Link>
              <h2 className="mb-2">Change Password</h2>
              <p>
                Your seeing this because your account was created by an admin,
                and it requires you to change your password, Enter your new
                password to access your dashboard.
              </p>
              <Form onSubmit={form.onSubmit(HandleSubmit)}>
                <Row>
                  <Col lg="12" className="col-lg-12">
                    <Form.Group className="floating-label">
                      <Form.Label htmlFor="email" className="form-label">
                        Password
                      </Form.Label>
                      <Popover
                        opened={popoverOpened.password}
                        position="bottom"
                        width="target"
                        transitionProps={{ transition: "pop" }}
                      >
                        <Popover.Target>
                          <div
                            onFocusCapture={() =>
                              setPopoverOpened({
                                confirmpassword: false,
                                password: true,
                              })
                            }
                            onBlurCapture={() =>
                              setPopoverOpened({
                                ...popoverOpened,
                                password: false,
                              })
                            }
                          >
                            <PasswordInput
                              withAsterisk
                              placeholder="Your password"
                              key={form.key("password")}
                              {...form.getInputProps("password")}
                            />
                          </div>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <Progress
                            color={color(form.getValues().password)}
                            value={strength(form.getValues().password)}
                            size={5}
                            mb="xs"
                          />
                          <PasswordRequirement
                            label="Includes at least 8 characters"
                            meets={form.getValues().password.length > 7}
                          />
                          {checks(form.getValues().password)}
                        </Popover.Dropdown>
                      </Popover>

                      {/*  */}
                      <Form.Label htmlFor="email" className="form-label">
                        Confirm Password
                      </Form.Label>
                      <Popover
                        opened={popoverOpened.confirmpassword}
                        position="bottom"
                        width="target"
                        transitionProps={{ transition: "pop" }}
                      >
                        <Popover.Target>
                          <div
                            onFocusCapture={() =>
                              setPopoverOpened({
                                password: false,
                                confirmpassword: true,
                              })
                            }
                            onBlurCapture={() =>
                              setPopoverOpened({
                                ...popoverOpened,
                                confirmpassword: false,
                              })
                            }
                          >
                            <PasswordInput
                              withAsterisk
                              placeholder="Your password"
                              key={form.key("password")}
                              {...form.getInputProps("confirmpassword")}
                            />
                          </div>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <Progress
                            color={color(form.getValues().confirmpassword)}
                            value={strength(form.getValues().confirmpassword)}
                            size={5}
                            mb="xs"
                          />
                          <PasswordRequirement
                            label="Includes at least 8 characters"
                            meets={form.getValues().confirmpassword.length > 7}
                          />
                          {checks(form.getValues().confirmpassword, true)}
                        </Popover.Dropdown>
                      </Popover>
                    </Form.Group>
                  </Col>
                </Row>
                <Button className="mt-3" type="submit" variant="primary">
                  Reset
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="sign-bg sign-bg-right">
            <svg
              width="280"
              height="230"
              viewBox="0 0 431 398"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.05">
                <rect
                  x="-157.085"
                  y="193.773"
                  width="543"
                  height="77.5714"
                  rx="38.7857"
                  transform="rotate(-45 -157.085 193.773)"
                  fill="#3B8AFF"
                />
                <rect
                  x="7.46875"
                  y="358.327"
                  width="543"
                  height="77.5714"
                  rx="38.7857"
                  transform="rotate(-45 7.46875 358.327)"
                  fill="#3B8AFF"
                />
                <rect
                  x="61.9355"
                  y="138.545"
                  width="310.286"
                  height="77.5714"
                  rx="38.7857"
                  transform="rotate(45 61.9355 138.545)"
                  fill="#3B8AFF"
                />
                <rect
                  x="62.3154"
                  y="-190.173"
                  width="543"
                  height="77.5714"
                  rx="38.7857"
                  transform="rotate(45 62.3154 -190.173)"
                  fill="#3B8AFF"
                />
              </g>
            </svg>
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default ChangePasswordPage;
