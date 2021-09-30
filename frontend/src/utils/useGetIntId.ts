import { useRouter } from "next/dist/client/router";
import { usePostQuery } from "../generated/graphql";

export const useGetIntId = () => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  return intId;
};
