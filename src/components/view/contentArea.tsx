import { Dispatch, SetStateAction } from "react";
import { DownloadItem } from "./download/downloadItem";

import { pasteItem } from "@/lib/types.global";
interface ContentAreaProps {
  pasteItems: pasteItem[];
  setPasteItems: Dispatch<SetStateAction<pasteItem[]>>;
}
export function ContentArea({ pasteItems, setPasteItems }: ContentAreaProps) {
  return (
    <div className="flex flex-col gap-2 flex-1 items-start justify-start overflow-hidden p-4">
      <span className="font-semibold text-sm">My Downloads</span>

      <div className="flex flex-col w-full h-full mt-3 overflow-y-scroll hideScrollBar transition-all duration-400 ease-in-out">
        {pasteItems.map((item) => (
          <DownloadItem
            key={item.id}
            item={item}
            setPasteItems={setPasteItems}
          />
        ))}
      </div>
    </div>
  );
}
