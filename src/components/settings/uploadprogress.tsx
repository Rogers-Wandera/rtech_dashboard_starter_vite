import { useAppDispatch } from "@/hooks/store.hooks";
import { setUpload } from "@/lib/store/services/auth/auth.slice";
import { RootState } from "@/lib/store/store";
import { Box, Progress, Text, Button } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { Fragment, memo } from "react";
import { useSelector } from "react-redux";

const UploadProgressShow = memo(() => {
  const upload = useSelector(
    (state: RootState) => state.appState.authuser.upload
  );

  const dispatch = useAppDispatch();

  const handleRemoveProgress = (filename: string) => {
    if (upload?.progress && upload?.progress?.length > 0) {
      let data = [...upload.progress];
      data = data.filter((item) => item.filename != filename);
      dispatch(setUpload({ ...upload, progress: data }));
    }
  };

  return (
    <Fragment>
      {upload?.progress && (
        <Box p={10}>
          {upload.progress?.length > 0 &&
            upload?.progress?.map((progress) => (
              <Box
                bg="white"
                p={10}
                mb={10}
                key={progress?.filename}
                style={{ position: "relative", borderRadius: "5px" }}
              >
                <Text c="black" mt={10}>
                  {progress?.filename || "File"}{" "}
                  {progress?.completed ? "upload complete" : "uploading"}
                </Text>
                <Progress.Root mb={10} mt={10} size="xl">
                  <Progress.Section value={progress.progress}>
                    <Progress.Label>{progress.progress} %</Progress.Label>
                  </Progress.Section>
                </Progress.Root>
                <Button
                  variant="subtle"
                  color="red"
                  size="xs"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    padding: 0,
                    minWidth: "auto",
                    height: "auto",
                  }}
                  onClick={() => handleRemoveProgress(progress?.filename)}
                >
                  <IconX />
                </Button>
              </Box>
            ))}
        </Box>
      )}
    </Fragment>
  );
});

UploadProgressShow.displayName = "UploadProgressShow";
export default UploadProgressShow;
