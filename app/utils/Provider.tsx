"use client";
import { DefaultQueryClient } from "@/services/defaultQueryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

function Provider({ children }: any) {
  const [client] = useState(DefaultQueryClient);

  return (
    <>
      <QueryClientProvider client={client}>
        <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster position="bottom-right" reverseOrder={false} />
      </QueryClientProvider>
    </>
  );
}

export default Provider;
