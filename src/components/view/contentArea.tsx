import { Progress } from "../ui/progress";

interface ContentAreaProps {
  pasteItems: string[];
}
export function ContentArea({ pasteItems }: ContentAreaProps) {
  

  return (
    <div className="flex flex-col gap-2 flex-1 items-start justify-start p-4">
      <span className="font-semibold text-sm">My Downloads</span>

      <div className="max-h-full overflow-y-auto">
        {pasteItems.map((item, i) => (
          <div
            key={i}
            className="flex flex-col gap2 bg-muted/10 hover:bg-muted/20 w-full rounded-md"
          >
            Downloading {item}
            <Progress value={10} />
          </div>
        ))}
      </div>
    </div>
  );
}
