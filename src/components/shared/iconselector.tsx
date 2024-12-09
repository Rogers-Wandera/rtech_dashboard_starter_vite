import { Group, Select, SelectProps } from "@mantine/core";
import * as Icons from "@tabler/icons-react";
import TablerIconLoader from "./iconloader";

const TablerIconSelector = ({ ...props }: SelectProps) => {
  const iconOptions = Object.keys(Icons).map((icon) => ({
    value: icon,
    label: icon,
  }));

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    return (
      <Group flex="1" gap="xs">
        <TablerIconLoader iconName={option.value} />
        {option.label}
        {checked && <Icons.IconCheck style={{ marginInlineStart: "auto" }} />}
      </Group>
    );
  };

  return (
    <Select
      label="Choose an Icon"
      searchable
      clearable
      limit={10}
      data={iconOptions}
      renderOption={renderSelectOption}
      nothingFoundMessage="No icon found"
      {...props}
    />
  );
};

export default TablerIconSelector;
