"use client";

import { lazy, useState } from "react";
import { Folder, Settings } from "lucide-react";

import { Button } from "../ui/button";

const FilePathModal = lazy(() => import("./filepathModal.tsx"));

export default function FooterContent() {
  const [folderPath, setFolderPath] = useState("");

  const openFolderInExplorer = () => {
    if (
      !window?.electronAPI?.openFolder ||
      !folderPath ||
      typeof folderPath !== "string"
    )
      return;
    window.electronAPI.openFolder(folderPath);
  };

  return (
    <>
      {/* OPEN FOLDER */}
      <Button
        variant="ghost"
        size="lg"
        className="hover:bg-zinc-900/70 hover:text-white transition-all duration-200"
        onClick={() => openFolderInExplorer()}
      >
        <Folder />
      </Button>

      {/* CONFIGS */}
      <FilePathModal folderPath={folderPath} setFolderPath={setFolderPath}>
        <Button
          variant="ghost"
          size="lg"
          className="hover:bg-zinc-900/70 hover:text-white transition-all duration-200"
        >
          <Settings />
        </Button>
      </FilePathModal>
    </>
  );
}
