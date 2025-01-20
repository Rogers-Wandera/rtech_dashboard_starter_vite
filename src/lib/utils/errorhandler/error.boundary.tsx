import { Component, ErrorInfo, ReactNode } from "react";
import { helpers } from "../helpers/helper";
import { ErrorPage } from "@/components/pages/error/errorPage";
import { Box, Code, Flex } from "@mantine/core";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackUI?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  isDev: boolean;
  isMobile: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isDev: helpers.checkEnviroment().isDevelopment,
      isMobile: window.innerWidth < 768,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  updateIsMobile = () => {
    this.setState({ isMobile: window.innerWidth < 768 });
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateIsMobile);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateIsMobile);
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (this.state.isDev) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  render() {
    const { hasError, error } = this.state;
    const { fallbackUI, children } = this.props;
    if (hasError) {
      return (
        fallbackUI || (
          <Flex justify="center" align="center" h="100%" w="100%" wrap="wrap">
            <Box
              style={{
                width: this.state.isDev
                  ? this.state.isMobile
                    ? "100%"
                    : "50%"
                  : "100%",
              }}
            >
              <ErrorPage
                type="400"
                message={error?.message}
                ctx={{ title: "Reload", link: () => window.location.reload() }}
              />
            </Box>
            {this.state.isDev && error?.stack && (
              <Code block ta="center" w={this.state.isMobile ? "100%" : "50%"}>
                {error.stack}
              </Code>
            )}
          </Flex>
        )
      );
    }
    return children;
  }
}

export default ErrorBoundary;
