import { useFetchPaginate } from "@/hooks/data/usefetch.hook";
import { AxiosRequestConfig } from "axios";
import { useEffect, useMemo, useState } from "react";
import { Select, SelectProps } from "@mantine/core";
import { MantineSelectType } from "@/types/app/app.types";
import { debounce } from "lodash";

type servercombotype<T extends Record<string, any>> = {
  /** This is the endpoint for the registered server in the system, where to get the data from on the server */
  endPoint?: string;
  /** The label of the Combobox */
  label: string;
  /** The key in the data for the text value of the combobox */
  textKey: keyof T;
  /** The value of the combobox, comes from the data got. */
  valueKey: keyof T;
  /** The state value to pass in to the component inorder to have access to the selected value */
  onChange?: (value: string | null) => void;
  /** The value selected from the combobox */
  value?: string | null;
  /**
   * See axios request config type for more details
   * @type {AxiosRequestConfig} */
  configs?: AxiosRequestConfig;
  /** Determines if only fetch must happend when authenticated user or not */
  onlyAuth?: boolean;
  /** For manipulating the text field of the rendered option */
  renderLabel?: (item: T) => string;
  /** The placeholder to show before any option is selected */
  placeholder?: string;
  /** the number of items to return from the server endpoint */
  limit?: number;
  /** Overrides the endpoint to include, your own generated endpoint, must be a url */
  url?: string;
  error?: string;
  zIndex?: number;
  otherOptions?: SelectProps;
  formatData?: (data: MantineSelectType<T>[]) => MantineSelectType<T>[];
};

const ServerCombo = <T extends Record<string, any>>({
  label,
  valueKey,
  textKey,
  value = null,
  onChange = () => {},
  endPoint = "",
  onlyAuth = true,
  configs = {},
  renderLabel = undefined,
  placeholder = "Select an option",
  limit = 5,
  url = undefined,
  error = undefined,
  zIndex = 1,
  otherOptions = {},
  formatData = undefined,
}: servercombotype<T>) => {
  const [selects, setSelects] = useState<MantineSelectType<T>[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [notFound, setNotFound] = useState("Nothing found..");

  const { data, isLoading, isFetching, setPaginate } = useFetchPaginate<T>({
    queryKey: endPoint,
    onlyAuth,
    configs,
    endPoint,
    limit: limit,
    url,
    showError: false,
  });

  const formattedData = useMemo(() => {
    const selects =
      data?.docs?.map((item, i) => {
        const renderLabelText = renderLabel ? renderLabel(item) : undefined;
        return {
          value: String(item[valueKey]),
          label: renderLabelText
            ? renderLabelText
            : item[textKey]
            ? item[textKey]
            : `Value Wrong [${i}]`,
        };
      }) || [];
    return selects;
  }, [data, valueKey, textKey, renderLabel]);

  const HandleSearch = debounce((value: string) => {
    setPaginate((prevState) => ({ ...prevState, globalFilter: value }));
    setSearchValue(value);
  }, 30);

  useEffect(() => {
    if (formatData) {
      setSelects(formatData(formattedData));
    } else {
      setSelects(formattedData);
    }
  }, [formattedData]);

  useEffect(() => {
    if (isLoading || isFetching) {
      setNotFound("Processing....");
    } else if (!isLoading && !isFetching && selects.length === 0) {
      setNotFound("Nothing found..");
    }
  }, [isLoading, isFetching, selects]);

  return (
    <Select
      data={selects}
      allowDeselect={true}
      searchable
      searchValue={searchValue}
      onSearchChange={HandleSearch}
      clearable
      comboboxProps={{ shadow: "md", zIndex: zIndex }}
      nothingFoundMessage={notFound}
      limit={limit}
      placeholder={placeholder}
      label={label}
      onChange={onChange}
      value={value}
      error={error}
      {...otherOptions}
    />
  );
};

export default ServerCombo;
