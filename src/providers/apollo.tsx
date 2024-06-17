'use client'


import { ApolloProvider } from "@apollo/client";
import client from "@libs/graphQl/apolloClient";
import React from "react";

export default function ApolloCustomProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}
