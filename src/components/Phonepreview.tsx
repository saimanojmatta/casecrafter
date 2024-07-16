"use client";
import { CaseColor } from "@prisma/client";
import { AspectRatio } from "./ui/aspect-ratio";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {};
const Phonepreview = ({
  croppedImageUrl,
  color,
}: {
  croppedImageUrl: string;
  color: CaseColor;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [renderDimensions, setRenderDimensions] = useState({
    height: 0,
    width: 0,
  });
  const handelResize = () => {
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    setRenderDimensions({ width, height });
  };
  useEffect(() => {
    handelResize();
    window.addEventListener("resize", handelResize);
    return () => window.removeEventListener("resize", handelResize);
  }, [ref.current]);

  let caseBackgroundColor = "bg-zinc-950";
  if (color === "blue") caseBackgroundColor = "bg-blue-950";
  if (color === "rose") caseBackgroundColor = "bg-rose-950";

  return (
    <AspectRatio ref={ref} ratio={3000 / 2001} className="relative">
      <div
        className="absolute z-20 scale-[1.0352]"
        style={{
          left:
            renderDimensions.width / 2 - renderDimensions.width / (1216 / 121),
          top: renderDimensions.height / 6.22,
        }}
      >
        <img
          width={renderDimensions.width / (3000 / 637)}
          src={croppedImageUrl}
          alt="ThankyouImage"
          className={cn(
            "phone-skew relative z-20 rounded-b-[10px] rounded-t-[15px] md:rounded-b-[20px] md:rounded-t-[30px]",
            caseBackgroundColor,
          )}
        />
      </div>

      <div className="relative z-40 h-full w-full">
        <img
          src="/clearPhone.png"
          alt="clearphone"
          className="pointer-events-none h-full w-full rounded-md antialiased"
        />
      </div>
    </AspectRatio>
  );
};
export default Phonepreview;
