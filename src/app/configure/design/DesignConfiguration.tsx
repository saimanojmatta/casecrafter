"use client";
import HandleComponent from "@/components/HandleComponent";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatPrice } from "@/lib/utils";
import NextImage from "next/image";
import { Rnd } from "react-rnd";
import { RadioGroup } from "@headlessui/react";
import { useRef, useState } from "react";
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "@/validators/Option-validators";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BASE_PRICE } from "@/config/product";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { saveConfig as _saveConfig, saveConfigArgs } from "./action";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
interface DesignConfigurationProps {
  configId: string;
  imageUrl: string;
  imageDimensions: { width: number; height: number };
}
const DesignConfiguration = ({
  configId,
  imageDimensions,
  imageUrl,
}: DesignConfigurationProps) => {
  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    model: (typeof MODELS.options)[number];
    material: (typeof MATERIALS.options)[number];
    finish: (typeof FINISHES.options)[number];
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });
  const [renderDimension, setRenderDimension] = useState({
    width: imageDimensions.width / 4,
    height: imageDimensions.height / 4,
  });
  const [renderPosition, setRenderPosition] = useState({ x: 150, y: 205 });
  const phoneCaseRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  //Loading improve ui
  const [isLoading, setIsloading] = useState(false);
  const { startUpload } = useUploadThing("imageUploader");
  const { toast } = useToast();
  const router = useRouter();
  //reactquery mutation(create,update,delete) hook
  const { mutate: saveConfig } = useMutation({
    mutationKey: ["save-config"],
    mutationFn: async (arg: saveConfigArgs) => {
      //we want cropped image and update db simualtoneusly
      await Promise.all([saveConfiguration(), _saveConfig(arg)]);
    },
    onError: () => {
      toast({
        title: "something went wrong ",
        description: "There was an error on our end.Please try again",
      });
    },
    onSuccess: () => {
      router.push(`/configure/preview?id=${configId}`);
    },
  });

  const saveConfiguration = async () => {
    try {
      setIsloading(true);
      const {
        left: caseLeft,
        top: caseTop,
        width,
        height,
      } = phoneCaseRef.current!.getBoundingClientRect();
      const { left: containerLeft, top: containerTop } =
        containerRef.current!.getBoundingClientRect();
      const leftOffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;
      const actualX = renderPosition.x - leftOffset;
      const actualY = renderPosition.y - topOffset;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      const userImage = new Image();
      userImage.crossOrigin = "anonymous";
      userImage.src = imageUrl;

      await new Promise((resolve) => (userImage.onload = resolve));
      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderDimension.width,
        renderDimension.height,
      );
      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1];
      const blob = base64ToBlob(base64Data, "image/png");
      const file = new File([blob], "filename.png", { type: "image/png" });
      await startUpload([file], { configId });
    } catch (err) {
      setIsloading(false);
      toast({
        title: "Something went wrong!",
        description: "There was a problem saving your config,please try again",
        variant: "destructive",
      });
    }
  };
  function base64ToBlob(base64: string, mimeType: string) {
    const byteCharacter = atob(base64);
    const byteNumber = new Array(byteCharacter.length);
    for (let i = 0; i < byteCharacter.length; i++) {
      byteNumber[i] = byteCharacter.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumber);
    return new Blob([byteArray], { type: mimeType });
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="relative mb-20 mt-20 grid grid-cols-3 pb-20">
          <div
            ref={containerRef}
            className="relative col-span-2 flex h-[37.5rem] w-full max-w-4xl items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <div className="pointer-events-none relative aspect-[896/1831] w-60 bg-opacity-50">
              <AspectRatio
                ref={phoneCaseRef}
                ratio={896 / 1831}
                className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
              >
                <NextImage
                  src={"/phone-template.png"}
                  alt="Phone_image"
                  fill
                  className="pointer-events-none z-50 select-none"
                />
              </AspectRatio>
              <div className="absolute inset-0 bottom-px left-[3px] right-[3px] top-px z-40 rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
              <div
                className={cn(
                  "absolute inset-0 bottom-px left-[3px] right-[3px] top-px rounded-[32px]",
                  `bg-${options.color.tw}`,
                )}
              />
            </div>
            <Rnd
              default={{
                x: 150,
                y: 205,
                height: imageDimensions.height / 4,
                width: imageDimensions.width / 4,
              }}
              onResizeStop={(_, __, ref, ____, { x, y }) => {
                setRenderDimension({
                  height: parseInt(ref.style.height.slice(0, -2)),
                  width: parseInt(ref.style.width.slice(0, -2)),
                });
                setRenderPosition({ x, y });
              }}
              onDragStop={(_, data) => {
                const { x, y } = data;
                setRenderPosition({ x, y });
              }}
              lockAspectRatio
              resizeHandleComponent={{
                bottomRight: <HandleComponent />,
                bottomLeft: <HandleComponent />,
                topRight: <HandleComponent />,
                topLeft: <HandleComponent />,
              }}
              className="absolute z-20 border-[3px] border-primary"
            >
              <div className="relative h-full w-full">
                <NextImage
                  src={imageUrl}
                  alt=""
                  fill
                  className="pointer-events-none"
                />
              </div>
            </Rnd>
          </div>
          {/* Customize case configuration */}
          <div className="col-span-full flex h-[37.5rem] w-full flex-col bg-white lg:col-span-1">
            {/* contain color,model,material,finish changes */}
            <ScrollArea className="relative flex-1 overflow-auto">
              <div
                aria-hidden={"true"}
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-white"
              />
              <div className="px-8 pb-12 pt-8">
                <h2 className="text-3xl font-bold tracking-tight">
                  Customize your case
                </h2>
                <div className="my-6 h-px w-full bg-zinc-200" />
                <div className="relative mt-4 flex h-full flex-col justify-between">
                  <div className="flex flex-col gap-6">
                    {/* changing Phone color */}
                    <RadioGroup
                      value={options.color}
                      onChange={(val) => {
                        setOptions((prev) => ({
                          ...prev,
                          color: val,
                        }));
                      }}
                    >
                      <Label>Color:{options.color.label}</Label>
                      <div className="mt-3 flex items-center space-x-3">
                        {COLORS.map((color) => (
                          <RadioGroup.Option
                            key={color.label}
                            value={color}
                            className={({ active, checked }) =>
                              cn(
                                "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full border-2 border-transparent p-0.5 focus:outline-none focus:ring-0 active:outline-none active:ring-0",
                                {
                                  [`border-${color.tw}`]: active || checked,
                                },
                              )
                            }
                          >
                            <span
                              className={cn(
                                `bg-${color.tw}`,
                                "h-8 w-8 rounded-full border border-black border-opacity-10",
                              )}
                            />
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                    {/* selecting PhoneModel */}

                    <div className="relative flex w-full flex-col gap-3">
                      <Label>Model</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {options.model.label}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {MODELS.options.map((model) => (
                            <DropdownMenuItem
                              key={model.label}
                              className={cn(
                                "flex cursor-default items-center gap-1 p-1.5 text-sm hover:bg-zinc-100",
                                {
                                  "bg-zinc-100":
                                    model.label === options.model.label,
                                },
                              )}
                              onClick={() => {
                                setOptions((prev) => ({ ...prev, model }));
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  model.label === options.model.label
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {model.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {/* materiala and finishes changes */}
                    {[MATERIALS, FINISHES].map(
                      ({ name, options: selectableOptions }) => (
                        <RadioGroup
                          key={name}
                          value={options[name]}
                          onChange={(val) => {
                            setOptions((prev) => ({
                              ...prev,
                              //name:material/finish
                              [name]: val,
                            }));
                          }}
                        >
                          <Label>
                            {name.slice(0, 1).toUpperCase() + name.slice(1)}
                          </Label>
                          <div className="mt-3 space-y-4">
                            {selectableOptions.map((option) => (
                              <RadioGroup.Option
                                key={option.value}
                                value={option}
                                className={({ active, checked }) =>
                                  cn(
                                    "relative block cursor-pointer rounded-lg border-2 border-zinc-200 bg-white px-6 py-4 shadow-sm outline-none ring-0 focus:outline-none focus:ring-0 sm:flex sm:justify-between",
                                    {
                                      "border-primary": active || checked,
                                    },
                                  )
                                }
                              >
                                <span className="flex items-center">
                                  <span className="flex flex-col text-sm">
                                    <RadioGroup.Label className="font-medium text-gray-900">
                                      {option.label}
                                    </RadioGroup.Label>

                                    {option.description ? (
                                      <RadioGroup.Description
                                        as="span"
                                        className="text-gray-500"
                                      >
                                        <span className="block sm:inline">
                                          {option.description}
                                        </span>
                                      </RadioGroup.Description>
                                    ) : null}
                                  </span>
                                </span>
                                <RadioGroup.Description
                                  as="span"
                                  className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                                >
                                  <span className="font-medium text-gray-900">
                                    {formatPrice(option.price / 100)}
                                  </span>
                                </RadioGroup.Description>
                              </RadioGroup.Option>
                            ))}
                          </div>
                        </RadioGroup>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="h-16 w-full bg-white px-8">
              <div className="h-px w-full bg-zinc-200" />
              <div className="flex h-full w-full items-center justify-end">
                <div className="flex w-full items-center gap-6">
                  <p className="whitespace-nowrap font-medium">
                    {formatPrice(
                      (BASE_PRICE +
                        options.finish.price +
                        options.material.price) /
                        100,
                    )}
                  </p>
                  <Button
                    onClick={() => {
                      saveConfig({
                        configId,
                        color: options.color.value,
                        finish: options.finish.value,
                        material: options.material.value,
                        model: options.model.value,
                      });
                    }}
                    size={"sm"}
                    className="w-full"
                  >
                    Continue
                    <ArrowRight className="ml-1.5 inline h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default DesignConfiguration;
