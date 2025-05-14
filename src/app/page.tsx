import { lazy, Suspense } from "react";

import { ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Loading } from "@/components/view/loading";
import { Footer } from "@/components/view/footer";

const Layout = lazy(() => import("@/components/view/contentLayout"));

export default function Home() {
  return (
    <div className="w-[300px] h-[500px] font-[family-name:var(--font-geist-sans)] bg-zinc-950 text-white rounded-lg border border-zinc-700 overflow-hidden">
      <main>
        <ResizablePanelGroup
          direction="vertical"
          className="relative min-h-[443px] max-w-full "
        >
          <Suspense fallback={<Loading />}>
            <Layout />
          </Suspense>
        </ResizablePanelGroup>
        <Separator />
        <Footer />
      </main>
    </div>
  );
}
