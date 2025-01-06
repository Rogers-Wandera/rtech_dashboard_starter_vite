import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import { ServerErrorResponse } from "@/types/server/server.main.types";
import { Button, Modal } from "@mantine/core";
import { DateTimePicker, DateValue } from "@mantine/dates";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { ServerLinkRole } from "@/types/app/core/system.types";

type props = {
  opened: boolean;
  close: () => void;
  link: ServerLinkRole;
  isEditing: null | boolean;
  HandleAssignRole: (
    date: string | null,
    type?: "assign" | "remove"
  ) => Promise<void>;
};
const RoleModal = ({
  opened,
  close,
  HandleAssignRole,
  link,
  isEditing,
}: props) => {
  const [date, setDate] = useState<DateValue>(new Date());

  const HandleRole = async () => {
    try {
      const now = dayjs(date);
      const format = now.isValid() ? now.format("YYYY-MM-DD HH:mm:ss") : null;
      await HandleAssignRole(format);
      setDate(new Date());
    } catch (error) {
      HandleError(error as ServerErrorResponse);
    }
  };
  const HandleDate = (dateval: DateValue) => {
    setDate(dateval);
  };

  useEffect(() => {
    if (isEditing) {
      if (link.expireDate) {
        setDate(new Date(link.expireDate));
      }
    }
  }, [isEditing]);
  return (
    <Modal opened={opened} onClose={close} title="Assign Link Role">
      <DateTimePicker
        clearable
        value={date}
        onChange={HandleDate}
        valueFormat="YYYY-MM-DD HH:mm:ss"
        label="Expiry Date (optional)"
      />
      <Button onClick={HandleRole} type="button" mt={10}>
        Save
      </Button>
    </Modal>
  );
};

export default RoleModal;
