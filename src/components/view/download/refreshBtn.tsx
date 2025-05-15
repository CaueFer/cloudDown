import { ComponentPropsWithoutRef, useMemo } from "react";

import { RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RefreshBtnProps extends ComponentPropsWithoutRef<"svg"> {
  className?: string;
  downloadItem: () => Promise<void>;
}
export function RefreshBtn({ className, downloadItem }: RefreshBtnProps) {
  const id = useMemo(() => `refresh-${crypto.randomUUID()}`, []);
  return (
    <RefreshCcw
      id={id}
      className={cn(
        "cursor-pointer transition-transform duration-300 ease-in-out",
        {
          className,
        }
      )}
      onClick={() => {
        downloadItem();
        const e = document.getElementById(id);
        e?.classList.add("rotate-[280deg]");
        setTimeout(() => {
          e?.classList.remove("rotate-[280deg]");
        }, 500);
      }}
    />
  );
}
