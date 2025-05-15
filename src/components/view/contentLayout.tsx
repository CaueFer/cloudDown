"use client";

import { useState } from "react";

import { ResizableHandle, ResizablePanel } from "../ui/resizable";
import { ContentArea } from "./contentArea";
import { Dropzone } from "../ui/dropzone";

export default function ContentLayout() {
  const [pasteItems, setPasteItems] = useState<string[]>([]);

  const handlePasteItem = (item: string) => {
    if (item) setPasteItems((prev) => [...prev, item]);
  };

  return (
    <>
      <ResizablePanel defaultSize={25} minSize={25} maxSize={40}>
        <div className="flex w-full h-full items-center justify-center p-4">
          <Dropzone handlePasteItem={handlePasteItem} />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        defaultSize={75}
        maxSize={75}
        minSize={25}
        className="flex flex-col justify-between"
      >
        <ContentArea pasteItems={pasteItems} />
      </ResizablePanel>
    </>
  );
}
