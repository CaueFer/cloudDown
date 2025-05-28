import { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import { Trash } from "lucide-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./context-menu";
import { pasteItem } from "@/lib/types.global";

interface ContextMenuWrapper {
  children: ReactNode;
  setPasteItems: Dispatch<SetStateAction<pasteItem[]>>;
  id: string;
  itemRef: RefObject<HTMLDivElement | null>;
}
export function ContextMenuWrapper({
  children,
  setPasteItems,
  id,
  itemRef,
}: ContextMenuWrapper) {
  const handleDeleteItem = () => {
    if (itemRef.current) {
      itemRef.current.classList.add("-translate-x-[100%]");
    }

    setTimeout(() => {
      setPasteItems((prev) => [...prev.filter((item) => item.id !== id)]);
    }, 300);
  };
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="bg-zinc-950 border border-zinc-700 text-white shadow mr-1">
        <ContextMenuItem
          className="bg-zinc-950 dark"
          variant="destructive"
          onClick={() => handleDeleteItem()}
        >
          <Trash /> Deletar
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
