"use client";

import { HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { ContactFormProvider } from "@/contexts/ContactFormContext";

function makeClient() {
  const httpLink = new HttpLink({
    uri: "/api/graphql",
    headers: {
      "x-requested-by": "sagan.dev",
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      <ContactFormProvider>
        {children}
      </ContactFormProvider>
    </ApolloNextAppProvider>
  );
}
