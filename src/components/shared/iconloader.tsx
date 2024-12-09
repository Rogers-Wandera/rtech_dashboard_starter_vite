import React from "react";
import * as Icons from "@tabler/icons-react";

interface IconLoaderProps extends Icons.IconProps {
  iconName: string;
}

const TablerIconLoader = ({
  iconName,
  size = 22,
  ...rest
}: IconLoaderProps) => {
  const [IconComponent, setIconComponent] =
    React.useState<React.ForwardRefExoticComponent<
      Icons.IconProps & React.RefAttributes<Icons.Icon>
    > | null>(null);

  React.useEffect(() => {
    const loadIcon = async () => {
      try {
        const icon = iconName as keyof typeof Icons;
        const Icon = Icons[icon] as React.ForwardRefExoticComponent<
          Icons.IconProps & React.RefAttributes<Icons.Icon>
        >;
        setIconComponent(() => Icon);
      } catch (error) {
        setIconComponent(() => Icons.IconAppWindowFilled);
      }
    };

    if (iconName) {
      loadIcon();
    } else {
      setIconComponent(() => Icons.IconAppWindowFilled);
    }
  }, [iconName]);

  return IconComponent ? (
    <IconComponent size={size} {...rest} />
  ) : (
    <Icons.IconAppWindowFilled size={size} {...rest} />
  );
};

export default TablerIconLoader;
