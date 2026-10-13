import { describe, expect, it } from "bun:test";

import { libraryContent } from "./library";
import { methodContent } from "./method";

const stageIds = new Set(methodContent.chain.map((stage) => stage.id));
const patterns = libraryContent.patterns.entries;

describe("where each mechanism acts on the chain", () => {
  it("names one or two stages for every mechanism, each a stage of the chain", () => {
    for (const pattern of patterns) {
      expect(pattern.chainStages.length, pattern.slug).toBeGreaterThanOrEqual(
        1,
      );
      expect(pattern.chainStages.length, pattern.slug).toBeLessThanOrEqual(2);
      expect(new Set(pattern.chainStages).size, pattern.slug).toBe(
        pattern.chainStages.length,
      );
      for (const stage of pattern.chainStages) {
        expect(stageIds.has(stage), `${pattern.slug}: ${stage}`).toBe(true);
      }
    }
  });

  it("says why, in one sentence", () => {
    for (const pattern of patterns) {
      const note = pattern.chainNote.trim();
      expect(note.length, pattern.slug).toBeGreaterThan(0);
      expect(note.endsWith("."), pattern.slug).toBe(true);
      expect(note.match(/\.(\s|$)/g)?.length, pattern.slug).toBe(1);
    }
  });

  it("agrees with the mechanisms the method page lists under each stage", () => {
    for (const stage of methodContent.chain) {
      for (const link of stage.links) {
        const slug = /^\/mechanisms\/patterns\/([^/#]+)$/.exec(link.href)?.[1];
        if (!slug) continue;
        const pattern = patterns.find((entry) => entry.slug === slug);
        expect(pattern?.chainStages, `${slug} under ${stage.id}`).toContain(
          stage.id as never,
        );
      }
    }
  });
});
