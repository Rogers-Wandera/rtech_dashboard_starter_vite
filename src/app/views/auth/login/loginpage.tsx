import { UseFormReturnType } from "@mantine/form";
import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Image, Row } from "react-bootstrap";
import {
  getStrength,
  PasswordRequirement,
  withoutuppercase,
} from "../requirements";
import { PasswordInput, Popover, Progress, TextInput } from "@mantine/core";
import auth1 from "@/assets/images/auth/01.png";
import { ILoginValues } from "@/types/app/auth/auth.types";
import { Link } from "react-router-dom";

type props = {
  app_name: string | null | undefined;
  form: UseFormReturnType<ILoginValues, (values: ILoginValues) => ILoginValues>;
  handleSubmit: (values: ILoginValues) => void;
  rememberMe: boolean;
  setRememberMe: React.Dispatch<React.SetStateAction<boolean>>;
};
const LoginPage = ({
  app_name,
  form,
  handleSubmit,
  rememberMe,
  setRememberMe,
}: props) => {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const checks = withoutuppercase.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(form.getValues().password)}
    />
  ));

  const strength = getStrength(form.getValues().password, 8, withoutuppercase);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";

  useEffect(() => {
    if (strength === 100) {
      setPopoverOpened(false);
    }
  }, [strength]);
  return (
    <section className="login-content">
      <Row className="m-0 align-items-center bg-white vh-100">
        <Col md="6">
          <Row className="justify-content-center">
            <Col md="10">
              <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                <Card.Body>
                  <Link
                    to="/"
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
                  <h2 className="mb-2 text-center">Sign In</h2>
                  <p className="text-center">Login to stay connected.</p>
                  <Form onSubmit={form.onSubmit(handleSubmit)}>
                    <Row>
                      <Col lg="12">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="email" className="">
                            Email
                          </Form.Label>
                          <TextInput
                            withAsterisk
                            type="email"
                            className=""
                            id="email"
                            key={form.key("email")}
                            {...form.getInputProps("email")}
                            aria-describedby="email"
                            placeholder=""
                          />
                        </Form.Group>
                      </Col>
                      <Col lg="12" className="">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="password" className="">
                            Password
                          </Form.Label>
                          <Popover
                            opened={popoverOpened}
                            position="bottom"
                            width="target"
                            transitionProps={{ transition: "pop" }}
                          >
                            <Popover.Target>
                              <div
                                onFocusCapture={() => setPopoverOpened(true)}
                                onBlurCapture={() => setPopoverOpened(false)}
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
                                color={color}
                                value={strength}
                                size={5}
                                mb="xs"
                              />
                              <PasswordRequirement
                                label="Includes at least 8 characters"
                                meets={form.getValues().password.length > 7}
                              />
                              {checks}
                            </Popover.Dropdown>
                          </Popover>
                        </Form.Group>
                      </Col>
                      <Col lg="12" className="d-flex justify-content-between">
                        <Form.Check className="form-check mb-3">
                          <Form.Check.Input
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            type="checkbox"
                            id="customCheck1"
                          />
                          <Form.Check.Label htmlFor="customCheck1">
                            Remember Me
                          </Form.Check.Label>
                        </Form.Check>
                        <Link to="/pwreset">Forgot Password?</Link>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-center">
                      <Button type="submit" variant="btn btn-primary">
                        Sign In
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="sign-bg">
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
        <Col
          md="6"
          className="d-md-block d-none bg-primary p-0 mt-n1 vh-100 overflow-hidden"
        >
          <Image
            src={auth1}
            className="Image-fluid gradient-main animated-scaleX"
            alt="images"
          />
        </Col>
      </Row>
    </section>
  );
};

export default LoginPage;