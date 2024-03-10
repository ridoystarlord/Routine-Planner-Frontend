import { ROUTES } from "@/Routes";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export const isAxiosError = (error: any): error is AxiosError<unknown> => {
  return axios.isAxiosError(error);
};
const DefaultQueryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err: any, query) => {
      if (isAxiosError(err)) {
        if (err?.response?.status === 401 && typeof window !== "undefined") {
          // redirect to sign in page
          // get path from window.location
          const path = window.location.pathname;
          window.location.href = `${ROUTES.LOG_IN}?redirect=${path}`;
          return;
        }
        if (err?.response?.status === 400) {
          toast.error(`${err}`, {
            id: `${err}`,
          });
          return;
        }
        if (
          err?.response?.status != null &&
          err?.response?.status >= 400 &&
          err?.response?.status < 500
        ) {
          toast.error(`${err}`, {
            id: `${err}`,
          });
        }
      }
    },
  }),
});

DefaultQueryClient.setDefaultOptions({
  queries: {
    staleTime: 0,
    notifyOnChangeProps: ["data", "error"],
  },
  mutations: {
    onError: (err, mutation) => {
      if (isAxiosError(err)) {
        if (err?.response?.status === 401 && typeof window !== "undefined") {
          // redirect to sign in page
          // get path from window.location
          const path = window.location.pathname;
          window.location.href = `${ROUTES.LOG_IN}?redirect=${path}`;
          return;
        }
        if (err?.response?.status === 400) {
          toast.error(`${err}`, {
            id: `${err}`,
          });
          return;
        }
        if (
          err?.response?.status != null &&
          err?.response?.status >= 400 &&
          err?.response?.status < 500
        ) {
          toast.error(`${err}`, {
            id: `${err}`,
          });
        }
      }
    },
  },
});

export { DefaultQueryClient };
