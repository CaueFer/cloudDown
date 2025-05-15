import { TDownloadStatus } from "./type";

interface DownloadStatusProps {
  status: TDownloadStatus;
  error: string;
}
export function DownloadStatus({ status, error }: DownloadStatusProps) {
  return (
    <>
      {/* {status === "downloading" && (
        <span className="text-xs text-white w-full">Downloading...</span>
      )} */}
      <span className="text-xs text-red-500 w-full truncate">
        {status === "error" && `Error: ${error}`}
      </span>
      {/* {status === "downloaded" && (
        <span className="text-xs text-green-500 w-full">Success</span>
      )} */}
    </>
  );
}
