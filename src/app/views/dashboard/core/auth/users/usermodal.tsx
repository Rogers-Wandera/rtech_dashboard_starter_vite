import ServerCombo from "@/components/shared/serversidecombo/servercombo";
import {
  Button,
  Grid,
  Group,
  Modal,
  PasswordInput,
  Select,
  TextInput,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import InputIcon from "@mui/icons-material/Input";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import LockIcon from "@mui/icons-material/Lock";
import { useCallback, useState } from "react";
import { userformtype } from "./userconfig";
import { countryCodes } from "@/assets/app/appdefaults";
import { useRegisterMutation } from "@/lib/store/services/auth/auth.api";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import { ServerErrorResponse } from "@/types/server/server.main.types";
import { notifier } from "@/lib/utils/notify/notification";

type props = {
  opened: boolean;
  close: () => void;
  form: UseFormReturnType<userformtype, (values: userformtype) => userformtype>;
  refetch: () => void;
};

const UserModal = ({ opened, close, form, refetch }: props) => {
  const [Register] = useRegisterMutation({});
  const [countryCode, setCountryCode] = useState("+256");

  const positionIdChangeHandler = useCallback(
    (value: string | null) => form.getInputProps("positionId").onChange(value),
    [form]
  );

  const HandleSubmit = async (values: userformtype) => {
    try {
      const response = await Register({
        ...values,
        adminCreated: 1,
        tel: `${countryCode}${values.tel}`,
      });
      if ("error" in response) {
        throw response.error;
      }
      form.reset();
      close();
      refetch();
      notifier.success({ message: response.data.msg as string, timer: 6000 });
    } catch (error) {
      HandleError(error as ServerErrorResponse);
    }
  };
  return (
    <>
      <Modal
        zIndex={999}
        opened={opened}
        onClose={() => {
          close();
          form.reset();
        }}
        title="Users"
        centered
        size="lg"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <form
          onSubmit={form.onSubmit(async (values) => {
            await HandleSubmit(values);
          })}
        >
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                withAsterisk={true}
                label="First Name"
                leftSection={<InputIcon />}
                {...form.getInputProps("firstname")}
                key={form.key("firstname")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                withAsterisk={true}
                label="Last Name"
                leftSection={<KeyboardIcon />}
                {...form.getInputProps("lastname")}
                key={form.key("lastname")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                withAsterisk={true}
                label="Email"
                leftSection={<InputIcon />}
                {...form.getInputProps("email")}
                key={form.key("email")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <PasswordInput
                withAsterisk={true}
                label="Password"
                leftSection={<LockIcon />}
                key={form.key("password")}
                {...form.getInputProps("password")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <PasswordInput
                withAsterisk={true}
                label="Confirm Password"
                {...form.getInputProps("confirmpassword")}
                leftSection={<LockIcon />}
                key={form.key("confirmpassword")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <ServerCombo
                endPoint="core/system/positions"
                textKey="position"
                valueKey="id"
                value={form.getInputProps("positionId").value}
                onChange={positionIdChangeHandler}
                label="Position"
                error={form.getInputProps("positionId").error}
                key={form.key("positionId")}
                zIndex={1000}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Select
                withAsterisk={true}
                label="Choose Gender"
                searchable
                comboboxProps={{ zIndex: 1000 }}
                data={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                ]}
                {...form.getInputProps("gender")}
                leftSection={<InputIcon />}
                clearable
                key={form.key("gender")}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <label>Phone number</label>
              <Grid>
                <Grid.Col span={{ base: 4, md: 4, lg: 4 }}>
                  {/* Country Code Selector */}
                  <Select
                    data={countryCodes}
                    value={countryCode}
                    placeholder="Select"
                    onChange={(value) => setCountryCode(value as string)}
                    maxDropdownHeight={200}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 8, md: 8, lg: 8 }}>
                  <TextInput
                    {...form.getInputProps("tel")}
                    key={form.key("tel")}
                    placeholder="e.g 78......"
                  />
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>
          <Group justify="flex-end" mt="md">
            <Button type="submit">Save</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default UserModal;
