import { DownloadItem } from "./download/downloadItem";

interface ContentAreaProps {
  pasteItems: string[];
}
export function ContentArea({ pasteItems }: ContentAreaProps) {
  return (
    <div className="flex flex-col gap-2 flex-1 items-start justify-start overflow-hidden p-4">
      <span className="font-semibold text-sm">My Downloads</span>

      <div className="flex flex-col gap-2 w-full h-full mt-3 overflow-y-scroll hideScrollBar">
        {pasteItems.map((item, i) => (
          <DownloadItem key={i} item={item} />
        ))}
      </div>
    </div>
  );
}
