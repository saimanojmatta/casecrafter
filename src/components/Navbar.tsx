import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
type Props = {};
const Navbar = async (props: Props) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;
  return (
    <div className="sticky inset-x-0 top-0 z-[100] h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href={"/"} className="z-40 flex font-semibold">
            Case<span className="text-green-600">Crafter</span>
          </Link>
          <div className="flex h-full items-center space-x-4">
            {user ? (
              <>
                <Link
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                  href="/api/auth/logout"
                >
                  Sign out
                </Link>
                {isAdmin ? (
                  <Link
                    className={buttonVariants({ size: "sm", variant: "ghost" })}
                    href={"/dashboard"}
                  >
                    Dashboard✨
                  </Link>
                ) : null}
                <Link
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden items-center gap-1 sm:flex",
                  })}
                  href={"/configure/upload"}
                >
                  Create case
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                  href={"/api/auth/register"}
                >
                  Sign up
                </Link>
                <Link
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                  href={"/api/auth/login"}
                >
                  Login
                </Link>
                <div className="hidden h-8 w-px bg-zinc-200 sm:block" />
                <Link
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden items-center gap-1 sm:flex",
                  })}
                  href={"/configure/upload"}
                >
                  Create case
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};
export default Navbar;
