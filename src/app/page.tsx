import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Footer } from "@/components/view/footer";
import { TopLogo } from "@/components/view/topLogo";
import { Separator } from "@/components/ui/separator";
import { CommandShortcut } from "@/components/ui/command";
import { ContentArea } from "@/components/view/contentArea";

export default function Home() {
  return (
    <div className="w-[300px] h-[500px] font-[family-name:var(--font-geist-sans)] bg-zinc-950 text-white border border-zinc-900 rouded-md overflow-hidden">
      <main>
        <ResizablePanelGroup
          direction="vertical"
          className="min-h-[500px] max-w-full rounded-lg border border-muted"
        >
          <ResizablePanel defaultSize={25} minSize={25}>
            <TopLogo />
            <div className="flex h-full items-center justify-center p-6">
              <span
                data-state="closed"
                className="flex w-full h-[100] items-center justify-center rounded-md border border-dashed text-sm"
              >
                Colar aqui
              </span>
              <CommandShortcut>Ctrl+C</CommandShortcut>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            defaultSize={75}
            minSize={25}
            className="flex flex-col justify-between"
          >
            <ContentArea />

            <Separator className="my-4" />

            <Footer />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
