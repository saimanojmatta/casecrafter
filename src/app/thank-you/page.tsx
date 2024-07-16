import { Suspense } from "react";
import Thankyou from "./Thankyou";

type Props = {};
const Page = (props: Props) => {
  return (
    <Suspense>
      <Thankyou />
    </Suspense>
  );
};
export default Page;
