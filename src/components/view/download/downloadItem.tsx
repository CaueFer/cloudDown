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
    const downloadPath = await window?.electronAPI?.getDefaultDownloadPath?.();
    if (!downloadPath || !item) return;

    setStatus("downloading");

    const eventStream = new EventSource(
      `/api/download?link=${item}&dPath=${downloadPath.defaultDownloadPath}`
    );

    eventStream.onmessage = (response) => {
      try {
        const responseData = JSON.parse(response.data);

        if (responseData.event === "status") {
          const data = responseData.data;

          setStatus(data.status);

          if (data.status === "downloading") {
            setProgress(Number(data.progress));
          }

          if (data.status === "downloaded") {
            setProgress(100);
          }

          if (data.status === "error") {
            setError(data.error);
          }
        }
      } catch (err) {
        console.error("Erro ao processar mensagem SSE:", err);
      }
    };
  }, [item]);

  useEffect(() => {
    if (item) downloadItem();
  }, [downloadItem, item]);

  return (
    <div className="flex flex-col gap-1 items-center bg-muted/10 hover:bg-muted/20 w-full rounded-md p-2">
      <div className="flex flex-row w-full py-2">
        <div className="flex flex-col gap-1 w-full">
          <DownloadStatus status={status} error={error} />
          <span className="text-sm">Nome do item</span>
        </div>
        <div className="w-auto mr-3">
          {status === "error" && (
            <RefreshBtn className="text-red-500" downloadItem={downloadItem} />
          )}
          {status === "downloaded" && <CircleCheck />}
          {status === "downloading" && (
            <LoaderCircle className="animate-spin" />
          )}
        </div>
      </div>

      {status !== "downloaded" && <Progress value={progress} />}
    </div>
  );
}
