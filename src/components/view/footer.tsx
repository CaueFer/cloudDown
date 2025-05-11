import { CloudDownload, Folder, Settings } from "lucide-react";

import { Button } from "../ui/button";

export function Footer() {
  return (
    <footer className="flex flex-row items-center gap-1 justify-start p-2">
      <div className="flex flex-row items-center justify-start w-full text-sm">
        <CloudDownload className="mr-2 size-5" />
        CloudDown
      </div>

      <Button
        variant="ghost"
        size="lg"
        className="hover:bg-zinc-900/70 hover:text-white transition-all duration-200"
      >
        <Folder />
      </Button>

      <Button
        variant="ghost"
        size="lg"
        className="hover:bg-zinc-900/70 hover:text-white transition-all duration-200"
      >
        <Settings />
      </Button>
    </footer>
  );
}
