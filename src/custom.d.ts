import "react";

declare module "react" {
  interface FunctionComponent<P = {}> {
    metadata?: Record<string, any>;
  }
}
