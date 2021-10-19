import { useEffect, useState } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const { data, loading } = useMeQuery();
  useEffect(() => {
    !loading && data?.me ? setIsAuth(true) : setIsAuth(false);
  }, [data, loading]);

  return { isAuth };
};
