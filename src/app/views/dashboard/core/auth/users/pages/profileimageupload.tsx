import { UserSingleView } from "@/types/app/core/user.type";
import { useEffect, useState } from "react";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import { Box, Button, Divider, Flex, Group, Text } from "@mantine/core";
import {
  IconCancel,
  IconFileUpload,
  IconPhoto,
  IconRefresh,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import {
  ServerErrorResponse,
  ServerResponse,
} from "@/types/server/server.main.types";
import { useAppDispatch } from "@/hooks/store.hooks";
import { useMutateData } from "@/hooks/data/usemutatehook";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import { notifier } from "@/lib/utils/notify/notification";
import Cropper, { Area } from "react-easy-crop";
import { useMediaQuery } from "@mantine/hooks";
import { getCroppedImg } from "@/lib/utils/helpers/image";

type props = {
  opened: boolean;
  close: () => void;
  user: UserSingleView;
  refetch: () => void;
};

const ProfileUpload = ({ close, user, refetch }: props) => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const matches = useMediaQuery("(max-width:768px)");
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const dispatch = useAppDispatch();
  const { postAsync } = useMutateData<ServerResponse>({
    queryKey: "upload-image" + user.id,
  });

  const HandleUploadImage = async () => {
    try {
      if (!image || !croppedAreaPixels) {
        return;
      }
      dispatch(setLoading(true));
      const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);
      if (!croppedImageBlob)
        throw new Error("Failed to process cropped image.");
      const formdata = new FormData();
      const file = new File([croppedImageBlob], "cropped-image.jpg", {
        type: "image/jpeg",
      });
      formdata.append("image", file);
      const response = await postAsync({
        endPoint: "core/auth/users/profile",
        payload: formdata,
      });
      close();
      setFiles([]);
      setImage(null);
      setCroppedAreaPixels(null);
      notifier.success({ message: response?.msg as string });
      refetch();
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      HandleError(error as ServerErrorResponse);
    }
  };

  useEffect(() => {
    if (files.length > 0) {
      const file = files[0];
      if (file && file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);

        // Revoke URL when component unmounts or when image changes
        return () => URL.revokeObjectURL(imageUrl);
      }
    }
  }, [files]);

  const HandleClose = () => {
    close();
    setFiles([]); 
    setImage(null);
  };

  const HandleSelectNew = () => {
    setFiles([]);
    setImage(null);
    setCroppedAreaPixels(null);
  };
  return (
    <Box mt={40}>
      {!image && (
        <Box>
          <Button
            color="red"
            leftSection={<IconCancel />}
            onClick={HandleClose}
          >
            Cancel
          </Button>
          <Dropzone
            maxFiles={1}
            mt={20}
            mb={10}
            accept={IMAGE_MIME_TYPE}
            onDrop={setFiles}
          >
            <Group
              justify="center"
              gap="xl"
              mih={220}
              style={{ pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <IconUpload
                  size={52}
                  color="var(--mantine-color-blue-6)"
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  size={52}
                  color="var(--mantine-color-red-6)"
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto
                  size={52}
                  color="var(--mantine-color-dimmed)"
                  stroke={1.5}
                />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  Drag image here or click to select file
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Attach a file which does not exceed 5mb
                </Text>
              </div>
            </Group>
          </Dropzone>
        </Box>
      )}

      {image && (
        <Box pos="relative" w={matches ? "100%" : 500} mr="auto" ml="auto">
          <Box
            pos="relative"
            w={matches ? 260 : 500}
            h={380}
            mx="auto"
            style={{ overflow: "hidden", borderRadius: "8px" }}
          >
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={2 / 1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) =>
                setCroppedAreaPixels(croppedAreaPixels)
              }
            />
          </Box>
          <Divider size="md" mt={10} mb={10} />
          <Flex
            justify="space-between"
            direction={matches ? "column" : "row"}
            gap={10}
          >
            <Button
              variant="gradient"
              onClick={HandleUploadImage}
              leftSection={<IconFileUpload />}
            >
              Save
            </Button>
            <Button
              onClick={HandleSelectNew}
              leftSection={<IconRefresh />}
              variant="filled"
              color="teal"
            >
              Select New
            </Button>
            <Button
              color="red"
              leftSection={<IconCancel />}
              onClick={HandleClose}
            >
              Cancel
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default ProfileUpload;
