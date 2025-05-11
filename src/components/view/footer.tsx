"use server";
import { lazy } from "react";
import { CloudDownload } from "lucide-react";

const FooterContent = lazy(() => import("./footerContent.tsx"));

export async function Footer() {
  return (
    <footer className="flex flex-row items-center gap-1 justify-start p-2">
      <div className="flex flex-row items-center justify-start w-full text-sm select-none">
        <CloudDownload className="mr-2 size-5" />
        CloudDown
      </div>

      <FooterContent />
    </footer>
  );
}
