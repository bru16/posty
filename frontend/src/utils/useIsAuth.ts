import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const { loading, data } = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !data?.me) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [loading, data, router]);
  return { loading };
};
