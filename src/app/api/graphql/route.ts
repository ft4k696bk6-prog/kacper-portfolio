import { createYoga } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "@/lib/graphql/schema";
import { resolvers } from "@/lib/graphql/resolvers";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sagan.dev",
  "http://localhost:3000",
  "http://localhost:3001",
];

const schema = makeExecutableSchema({ typeDefs, resolvers });

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  context: (req: { request: NextRequest }) => {
    const forwarded = req.request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : undefined;
    return { ip };
  },
  fetchAPI: { Response },
});

function isAllowedRequest(request: NextRequest): boolean {
  // Require custom header to block direct API calls
  const requestedBy = request.headers.get("x-requested-by");
  if (requestedBy !== "sagan.dev") return false;

  // Allow only our own origin (or no Origin for same-origin SSR requests)
  const origin = request.headers.get("origin");
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return false;

  return true;
}

async function handleRequest(request: NextRequest) {
  if (!isAllowedRequest(request)) {
    return new Response(JSON.stringify({ errors: [{ message: "Forbidden" }] }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return yoga.fetch(request);
}

export { handleRequest as GET, handleRequest as POST };
