import { SpinnerSvg } from "@/components/svgs/spinner";

export function Loading() {
  return (
    <div className="w-screen h-screen">
      <SpinnerSvg />
    </div>
  );
}
