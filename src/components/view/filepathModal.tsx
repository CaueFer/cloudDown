"use client";
import { Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import { FolderCog } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface FilepathModalProps {
  children: ReactNode;
  folderPath: string;
  setFolderPath: Dispatch<SetStateAction<string>>;
}
export default function FilepathModal({
  children,
  folderPath,
  setFolderPath,
}: FilepathModalProps) {
  useEffect(() => {
    const getDownloadPath = async () => {
      const defaultPathResponse =
        await window?.electronAPI?.getDefaultDownloadPath?.();
      if (defaultPathResponse) {
        setFolderPath(defaultPathResponse.defaultDownloadPath);
      }
    };

    getDownloadPath();
  }, [setFolderPath]);

  const handleChooseFolder = async () => {
    if (!window?.electronAPI) return;

    const selectedPath = await window?.electronAPI?.selectFolder();
    if (selectedPath) {
      await window?.electronAPI?.setDefaultDownloadPath?.(selectedPath);

      setFolderPath(selectedPath);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="bg-zinc-950 border border-zinc-700 text-white shadow mr-1">
        <DropdownMenuLabel className="text-xs mb-2">
          Download Path
        </DropdownMenuLabel>
        <div className="flex flex-row items-center w-full gap-1 px-2 py-1">
          <Button
            onClick={() => handleChooseFolder()}
            size="sm"
            variant="secondary"
          >
            <FolderCog />
          </Button>
          <Input value={folderPath} readOnly className="truncate text-sm" />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
