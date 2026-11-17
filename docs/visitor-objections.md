# Visitor objections

Page copy answers an objection only when a visitor has raised it. Copy that answers a doubt nobody
voiced puts the doubt in the reader's head: "you might be wondering", "don't worry", "this isn't a
sales pitch", a list of what a tool is not. When a visitor has raised an objection, record it here
with where and when it was heard, and answer it where it was asked: an FAQ, or beside the control it
concerns, never in a page intro or description. A required disclosure, such as "This is not legal
advice", stays, stated once and plainly after the answer.

The objections process for the site's standards is separate: it runs through GitHub issues labelled
`objection` (see [`presence-automation.md`](presence-automation.md)).

`scripts/lib/presupposing-copy.ts` holds the patterns, and `scripts/lib/presupposing-copy.test.ts`
runs them over the copy under `src/` in `bun run test:unit`. A matching sentence fails unless it
carries a marker naming an id below: `{/* objection: VO-001 */}` in MDX,
`<!-- objection: VO-001 -->` in Astro, `// objection: VO-001` in TypeScript.

Add an objection only with its evidence.

| id  | Objection as a visitor put it | Evidence (where and when it was heard) | Where the copy answers it |
| --- | ----------------------------- | -------------------------------------- | ------------------------- |
