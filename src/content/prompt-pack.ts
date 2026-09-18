/**
 * The prompt pack's install details, in one place.
 *
 * Three pages each carried their own copy of this block, and they drifted:
 * two advertised v1.1.0 while the agents standard page still handed out
 * v1.0.0, download link, pin path and invoke line included. The version is
 * the only thing that changes between releases, so it is the only thing
 * written down; superseded packs stay downloadable for anyone who pinned
 * one, but nothing advertises them.
 */
const PROMPT_PACK_VERSION = "v1.1.0";

export const promptPackInstall = {
  title: "Ethotechnics agent prompt pack",
  version: PROMPT_PACK_VERSION,
  downloadUrl: `/agent-toolkit/ethotechnics-agent-prompt-pack-${PROMPT_PACK_VERSION}.md`,
  pathSnippet: `prompts/ethotechnics/ethotechnics-agent-prompt-pack-${PROMPT_PACK_VERSION}.md`,
  invokeExample: `use: ethotechnics-agent-prompt-pack-${PROMPT_PACK_VERSION}`,
};
