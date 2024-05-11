import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status == "unauthenticated" && ["/debate"].includes(pathname)) {
      router.push("/");
    }
  }, [status]);
  return <>{children}</>;
};

export default Container;
