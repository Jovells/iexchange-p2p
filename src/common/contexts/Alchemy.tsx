"use client";
import { config, queryClient } from "@/app/config";
import { AlchemyClientState } from "@account-kit/core";
import { AlchemyAccountProvider } from "@account-kit/react";
import { PropsWithChildren } from "react";

const AlchemyProvider = (props: PropsWithChildren<{ initialState?: AlchemyClientState }>) => {
  return (
    <AlchemyAccountProvider config={config} queryClient={queryClient} initialState={props.initialState}>
      {props.children}
    </AlchemyAccountProvider>
  );
};

export default AlchemyProvider;
