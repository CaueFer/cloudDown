"use client";
import { useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { CommandShortcut } from "./command";

interface DropzoneProps {
  handlePasteItem: (item: string) => void;
}

export function Dropzone({ handlePasteItem }: DropzoneProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const onDrop = useCallback((acceptedFiles: unknown) => {
    console.log(acceptedFiles);

    // handlePasteItem(acceptedFiles[0] || "");
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    autoFocus: true,
  });

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const clipboardText = event.clipboardData?.getData("text");
      handlePasteItem(clipboardText || "");
    };

    window.addEventListener("paste", handlePaste);

    divRef.current?.focus();
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [handlePasteItem]);

  return (
    <div
      ref={divRef}
      tabIndex={0}
      {...getRootProps()}
      className="flex flex-row w-full h-full items-center justify-center rounded-md border border-dashed text-sm select-none"
    >
      <input {...getInputProps()} />

      <span>Drag&apos;n drop or Paste</span>
      <CommandShortcut className="ml-2">Ctrl+V</CommandShortcut>
    </div>
  );
}
