import { useSocketEvent } from "@/hooks/services/socket.hooks";
import { useAppDispatch } from "@/hooks/store.hooks";
import { setUpload } from "@/lib/store/services/auth/auth.slice";
import { RootState } from "@/lib/store/store";
import { notifier } from "@/lib/utils/notify/notification";
import { UPLOAD_EVENTS } from "@/types/enums/enum.types";
import {
  UploadCompleteType,
  UploadErrorType,
  UploadProgressType,
} from "@/types/server/server.main.types";
import { createContext, ReactNode, useContext } from "react";
import { useSelector } from "react-redux";

export type UploadContextType = {
  progress?: UploadProgressType[];
  error?: UploadErrorType;
} | null;

const UploadContext = createContext<UploadContextType | null>(null);

const UploadProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const upload = useSelector(
    (state: RootState) => state.appState.authuser.upload
  );
  useSocketEvent(UPLOAD_EVENTS.UPLOAD_PROGRESS, (data: UploadProgressType) => {
    const updatedData = {
      ...data,
      completed: data?.progress === 100 ? true : undefined,
    };
    const uploadprogress = upload?.progress ? [...upload.progress] : [];
    const existingFileIndex = uploadprogress.findIndex(
      (file) => file.filename === data?.filename
    );
    if (existingFileIndex !== -1) {
      uploadprogress[existingFileIndex] = updatedData;
    } else {
      uploadprogress.push(updatedData);
    }
    dispatch(setUpload({ ...upload, progress: [...uploadprogress] }));
  });
  useSocketEvent(UPLOAD_EVENTS.UPLOAD_ERROR, (data: UploadErrorType) => {
    const exists = upload?.progress?.find(
      (file) => file.filename === data?.filename
    );
    if (exists) {
      exists["failed"] = true;
    }
    dispatch(
      setUpload({ ...upload, error: data, progress: upload?.progress || [] })
    );
  });

  useSocketEvent(UPLOAD_EVENTS.UPLOAD_SUCCESS, (data: UploadCompleteType) => {
    const alldata = [...(upload?.progress || [])];
    const filter = alldata.filter((item) => item.filename !== data.filename);
    dispatch(setUpload({ ...upload, progress: filter }));
    notifier.success({ title: "Upload complete", message: data.message });
  });
  return (
    <UploadContext.Provider value={upload}>{children}</UploadContext.Provider>
  );
};

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUpload must be used in a context of UploadProvider");
  }
  return context;
};

export default UploadProvider;
