import { useEffect, useState } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const [isAuth, setIsAuth] = useState<Boolean>(false);
  const { loading, data } = useMeQuery();

  useEffect(() => {
    !loading && data?.me ? setIsAuth(true) : setIsAuth(false);
  }, [data]);

  return { isAuth };
};
