"use client";

import {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useState,
} from "react";

import { Progress } from "../../ui/progress";
import { RefreshBtn } from "./refreshBtn";

import type { TDownloadStatus } from "./type";
import { CircleCheck, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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

    eventStream.addEventListener("status", (event) => {
      try {
        const data = JSON.parse(event.data);

        setStatus(data.status);

        if (data.status === "error") {
          setError(data.error);

          eventStream.close();
        }

        if (data.status === "downloading") {
          setProgress(Number(data.progress));
        } else setProgress(100);
      } catch (err) {
        console.error("Erro ao processar mensagem SSE:", err);
      }
    });

    eventStream.onerror = () => {
      setError("Erro Desconhecido.");
      eventStream.close();
    };
  }, [item]);

  useEffect(() => {
    if (item) downloadItem();
  }, [downloadItem, item]);

  return (
    <div className="flex flex-col gap-1 items-center bg-muted/10 hover:bg-muted/20 w-full rounded-md p-2">
      <div className="flex flex-row justify-between w-full py-2">
        <span
          className={cn("text-sm", {
            "text-red-500": error,
          })}
        >
          {!error ? "Nome do item" : error}
        </span>

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
