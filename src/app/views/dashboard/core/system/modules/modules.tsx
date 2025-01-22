import { MRT_ServerTable } from "@/components/tables/mrttables/server/mrtserverside";
import RouteRoles from "@/hocs/verifyroles";
import { useMRTPaginateTable } from "@/hooks/data/usefetch.hook";
import { ModuleType } from "@/types/app/core/system.types";
import {
  ModuleColumns,
  ModuleMenuItems,
  ModulesColumnConfigs,
} from "./configs";
import { validateRequired } from "@/lib/utils/helpers/utilfuncs";
import { useMRTTableContext } from "@/lib/context/table/mrttable.context";
import _ from "lodash";
import { useAppContext } from "@/lib/context/app/app.context";
import Meta from "@/components/shared/meta";

function validateData(data: ModuleType) {
  return {
    name: !validateRequired(data.name) ? "Module name is required" : "",
  };
}

const Modules = () => {
  const { validation } = useMRTTableContext<ModuleType>();
  const { dispatch } = useAppContext();
  const columnconfigs = ModulesColumnConfigs(validation.validationErrors);
  const menuitems = ModuleMenuItems(dispatch);
  const { refetch } = useMRTPaginateTable<ModuleType>({
    endPoint: "core/system/modules",
    queryKey: "modules",
  });
  return (
    <div>
      <Meta title="Modules" header="Manage Modules" />
      <MRT_ServerTable
        title="Module"
        tablecolumns={ModuleColumns}
        refetch={refetch}
        enableEditing={true}
        enableRowActions={true}
        columnConfigs={columnconfigs}
        serveractions={{
          addEndPoint: "core/system/modules",
          editEndPoint: "core/system/modules",
          deleteEndPoint: "core/system/modules",
          addCreateCallback(values) {
            return {
              name: values.name,
            };
          },
          postFields: (values) => {
            const not_null = _.pickBy(
              values,
              (value) => value !== null && value !== undefined && value != ""
            );
            return Object.keys(not_null);
          },
        }}
        validateData={validateData}
        menuitems={menuitems}
      />
    </div>
  );
};

export default RouteRoles(Modules);
