"use client";

import {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useState,
} from "react";

import { DownloadStatus } from "./downloadStatus";
import { Progress } from "../../ui/progress";
import { RefreshBtn } from "./refreshBtn";

import type { TDownloadStatus } from "./type";
import { CircleCheck, LoaderCircle } from "lucide-react";

interface DownloadItemProps extends ComponentPropsWithoutRef<"div"> {
  item: string;
}
export function DownloadItem({ item }: DownloadItemProps) {
  const [status, setStatus] = useState<TDownloadStatus>("downloading");
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState(5);

  const downloadItem = useCallback(async () => {
    const downloadPathResponse =
      await window?.electronAPI?.getDefaultDownloadPath?.();
    if (!downloadPathResponse) return;

    setStatus("downloading");

    fetch("/api/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        link: item,
        downloadPath: downloadPathResponse.defaultDownloadPath,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);

        if (data.error) {
          setError(data.error);
          setProgress(0);
          return;
        }

        setProgress(100);
      })
      .catch((err) => console.error(err));
  }, [item]);

  useEffect(() => {
    if (item) downloadItem();
  }, [downloadItem, item]);

  return (
    <div className="flex flex-row gap-1 items-center bg-muted/10 hover:bg-muted/20 w-full rounded-md ">
      <div className="flex flex-col gap-1 w-full p-2">
        <DownloadStatus status={status} error={error} />
        <span className="text-sm">Nome do item</span>
        <Progress value={progress} />
      </div>
      <div className="w-auto p-2 mr-3">
        {status === "error" && (
          <RefreshBtn className="text-red-500" downloadItem={downloadItem} />
        )}
        {status === "downloaded" && <CircleCheck />}
        {status === "downloading" && <LoaderCircle className="animate-spin" />}
      </div>
    </div>
  );
}
