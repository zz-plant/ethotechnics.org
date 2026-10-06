/**
 * The sources of the one change feed: every place the site records a dated
 * change. Merged and rendered by src/utils/changes-feed.ts.
 */
import type { ChangeSources } from "../utils/changes-feed";
import { cases } from "./casebook";
import { glossaryContent } from "./glossary";
import { libraryContent } from "./library";
import { standardsContent } from "./standards";

export const changeSources: ChangeSources = {
  standards: standardsContent.standards,
  glossary: glossaryContent,
  library: libraryContent,
  cases,
};
