import { useFetchPaginate } from "@/hooks/usefetch.hook";
import { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import {
  Combobox,
  LoadingOverlay,
  TextInput,
  useCombobox,
  ScrollArea,
} from "@mantine/core";
import { usePaginateContext } from "@/lib/context/paginate/paginate.context";

type servercombotype<T extends Record<string, any>> = {
  endPoint: string;
  label: string;
  textKey: keyof T;
  valueKey: keyof T;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  configs?: AxiosRequestConfig;
  onlyAuth?: boolean;
  renderLabel?: (item: T) => string;
  placeholder?: string;
};

const ServerCombo = <T extends Record<string, any>>({
  endPoint,
  label,
  valueKey,
  textKey,
  value,
  setValue,
  onlyAuth = true,
  configs = {},
  renderLabel = undefined,
  placeholder = "Select an option",
}: servercombotype<T>) => {
  const combobox = useCombobox();
  const { setPaginate, paginate } = usePaginateContext();
  const [options, setOptions] = useState<JSX.Element[]>([]);
  const { data, isLoading, isFetching } = useFetchPaginate<T>({
    queryKey: endPoint,
    onlyAuth,
    configs,
    endPoint,
    limit: 1,
  });

  const HandleScrollTop = () => {
    if (data?.hasPrevPage) {
      setPaginate({ ...paginate, page: paginate.page - 1 });
    }
    console.log("has");
  };
  const HandleScrollBottom = () => {
    if (data?.hasNextPage) {
      setPaginate({ ...paginate, page: paginate.page + 1 });
    }
    console.log(data);
  };

  const formatData = () => {
    if (data?.docs && data?.docs.length > 0) {
      const formatted = data?.docs.map((item) => {
        return {
          value: String(item[valueKey]),
          text: item[renderLabel ? renderLabel(item) : textKey],
        };
      });
      const options = formatted.map((item, i) => (
        <Combobox.Option value={item.text} key={`${i}-${item.text}`}>
          {item.text}
        </Combobox.Option>
      ));
      setOptions(options);
    } else {
      setOptions([]);
    }
  };
  useEffect(() => {
    formatData();
  }, [data]);

  return (
    <Combobox
      onOptionSubmit={(option) => {
        setValue(option);
        combobox.closeDropdown();
      }}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            setValue(event.currentTarget.value);
            setPaginate({
              ...paginate,
              globalFilter: event.currentTarget.value,
            });
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
        />
      </Combobox.Target>
      <Combobox.Dropdown>
        {!isLoading && !isFetching ? (
          <Combobox.Options>
            {options.length === 0 ? (
              <Combobox.Empty>Nothing found</Combobox.Empty>
            ) : (
              <ScrollArea.Autosize
                type="scroll"
                mah={23}
                onBottomReached={HandleScrollBottom}
                // onTopReached={HandleScrollTop}
              >
                {options}
              </ScrollArea.Autosize>
            )}
          </Combobox.Options>
        ) : (
          <LoadingOverlay visible={isLoading} />
        )}
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default ServerCombo;
