import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignPreview from "./DesignPreview";

type SearchProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};
const Page = async ({ searchParams }: SearchProps) => {
  const { id } = searchParams;
  if (!id || typeof id !== "string") {
    return notFound();
  }
  const configuration = await db.configuration.findUnique({
    where: { id },
  });
  if (!configuration) notFound();

  return <DesignPreview configuration={configuration}></DesignPreview>;
};
export default Page;
