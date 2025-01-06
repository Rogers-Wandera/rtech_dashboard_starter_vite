export function WithMetadata(metadata: Record<string, any>) {
  return function (Component: React.ComponentType) {
    Component.defaultProps = metadata;
    return Component;
  };
}
