"use client";

import {
  ComponentPropsWithoutRef,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CircleCheck, LoaderCircle } from "lucide-react";

import { ContextMenuWrapper } from "@/components/ui/context-menu-wrapper";
import { Progress } from "../../ui/progress";
import { RefreshBtn } from "./refreshBtn";

import { cn } from "@/lib/utils";
import { pasteItem } from "@/lib/types.global";
import type { TDownloadStatus } from "./type";

interface DownloadItemProps extends ComponentPropsWithoutRef<"div"> {
  item: pasteItem;
  setPasteItems: Dispatch<SetStateAction<pasteItem[]>>;
}
export function DownloadItem({ item, setPasteItems }: DownloadItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState<string>("");
  const [status, setStatus] = useState<TDownloadStatus>("downloading");
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState(5);

  const downloadItem = useCallback(async () => {
    const downloadPath = await window?.electronAPI?.getDefaultDownloadPath?.();
    if (!downloadPath || !item) return;

    setStatus("downloading");

    const eventStream = new EventSource(
      `/api/download?link=${item.url}&dPath=${downloadPath.defaultDownloadPath}`
    );

    eventStream.addEventListener("status", (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.title.trim() !== "") setTitle(data.title);

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
      eventStream.close();
    };
  }, [item]);

  useEffect(() => {
    if (item && !item.id.startsWith("del")) downloadItem();
  }, [downloadItem, item]);

  return (
    <ContextMenuWrapper
      setPasteItems={setPasteItems}
      id={item.id}
      itemRef={itemRef}
    >
      <div
        ref={itemRef}
        className="flex flex-col gap-1 items-center bg-muted/10 hover:bg-muted/20 w-full rounded-md p-2 mb-4 transition-all duration-300"
      >
        <div className="flex flex-row justify-between w-full py-2">
          <span
            className={cn("text-sm", {
              "text-red-500": error,
            })}
          >
            {!error ? title : error}
          </span>

          <div className="w-auto mr-3">
            {status === "error" && (
              <RefreshBtn
                className="text-red-500"
                downloadItem={downloadItem}
              />
            )}
            {status === "downloaded" && <CircleCheck />}
            {status === "downloading" && (
              <LoaderCircle className="animate-spin" />
            )}
          </div>
        </div>

        {status === "downloading" && <Progress value={progress} />}
      </div>
    </ContextMenuWrapper>
  );
}
