import { CloudDownload, Folder } from "lucide-react";
import { Button } from "../ui/button";

export function Footer() {
  return (
    <footer className="flex flex-row items-center gap-2 justify-start">
      <Button variant="ghost">
        <CloudDownload />
      </Button>
      <Button variant="ghost">
        <Folder />
      </Button>
    </footer>
  );
}
