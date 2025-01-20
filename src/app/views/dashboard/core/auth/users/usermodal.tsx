import ServerCombo from "@/components/shared/serversidecombo/servercombo";
import {
  Button,
  Card,
  Grid,
  Group,
  PasswordInput,
  Select,
  TextInput,
  Title,
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
import { IconThumbDown, IconThumbUp } from "@tabler/icons-react";

type props = {
  close: () => void;
  form: UseFormReturnType<userformtype, (values: userformtype) => userformtype>;
  refetch: () => void;
};

const UserModal = ({ close, form, refetch }: props) => {
  const [Register] = useRegisterMutation({});
  const [countryCode, setCountryCode] = useState("+256");

  const positionIdChangeHandler = useCallback(
    (value: string | null) => {
      form.getInputProps("positionId").onChange(value);
      console.log(form.getInputProps("positionId").value);
    },
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
    <Card withBorder shadow="sm" radius="md">
      <form
        onSubmit={form.onSubmit(async (values) => {
          await HandleSubmit(values);
        })}
      >
        <Card.Section withBorder inheritPadding py="xs">
          <Group justify="space-between">
            <Title order={1} fw={900}>
              User
            </Title>
            <Button
              leftSection={<IconThumbDown />}
              type="button"
              color="cyan"
              onClick={close}
            >
              Cancel
            </Button>
            <Button leftSection={<IconThumbUp />} type="submit">
              Save
            </Button>
          </Group>
        </Card.Section>
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
              label="Position"
              key={form.key("positionId")}
              zIndex={1000}
              otherOptions={{
                value: form.getInputProps("positionId").value,
                onChange: positionIdChangeHandler,
                error: form.getInputProps("positionId").error,
              }}
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
      </form>
    </Card>
  );
};

export default UserModal;
