import { createConfiguredApiRoute } from "./route-wrapper";

export const GET = createConfiguredApiRoute(
  "diagnostic-results",
  "unversioned",
);
