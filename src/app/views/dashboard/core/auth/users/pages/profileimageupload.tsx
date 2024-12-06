import { UserSingleView } from "@/types/app/core/user.type";
import { useState } from "react";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import { Button, Image, Modal, SimpleGrid, Text } from "@mantine/core";
import { IconFileUpload } from "@tabler/icons-react";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import {
  ServerErrorResponse,
  ServerResponse,
} from "@/types/server/server.main.types";
import { useAppDispatch } from "@/hooks/store.hooks";
import { usePostData } from "@/hooks/usepost.hook";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import { notifier } from "@/lib/utils/notify/notification";

type props = {
  opened: boolean;
  close: () => void;
  user: UserSingleView;
  refetch: () => void;
};

const ProfileUpload = ({ opened, close, user, refetch }: props) => {
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const dispatch = useAppDispatch();
  const { postAsync } = usePostData<ServerResponse>({
    queryKey: "upload-image" + user.id,
  });

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
      />
    );
  });

  const HandleUploadImage = async () => {
    try {
      dispatch(setLoading(true));
      const formdata = new FormData();
      formdata.append("image", files[0]);
      const response = await postAsync({
        endPoint: "core/auth/users/profile",
        payload: formdata,
      });
      close();
      setFiles([]);
      notifier.success({ message: response?.msg as string });
      refetch();
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      HandleError(error as ServerErrorResponse);
    }
  };
  return (
    <Modal
      centered
      opened={opened}
      onClose={() => {
        close();
        setFiles([]);
      }}
      title="Upload profile picture"
    >
      {files.length > 0 && (
        <Button onClick={HandleUploadImage} leftSection={<IconFileUpload />}>
          Upload
        </Button>
      )}
      <Dropzone mt={20} mb={10} accept={IMAGE_MIME_TYPE} onDrop={setFiles}>
        <Text ta="center">Drop images here</Text>
      </Dropzone>

      <SimpleGrid cols={{ base: 1, sm: 4 }} mt={previews.length > 0 ? "xl" : 0}>
        {previews}
      </SimpleGrid>
    </Modal>
  );
};

export default ProfileUpload;
