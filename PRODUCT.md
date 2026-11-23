# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

One reader in three situations: a person an automated system decided about, someone who operates or
builds such a system, and someone who audits, regulates, or studies it. The home page makes the
mechanism legible and routes each situation to the instrument that fits it.

The primary-reader choice was delegated by the owner ("decide what makes sense") on 2026-11-22. This
record takes the three-situation reader because the existing six reader doors already encode it and
the site's material serves all three.

## Product Purpose

Ethotechnics is an open working project on one question: when an automated decision system is wrong,
does evidence of the harm reach someone who has to change it? It publishes draft standards, record
formats, scored public failures, and test instruments. Success is a reader recognizing their own
system in the six safeguards and taking one concrete next step.

## Positioning

Most AI governance asks whether the model is capable, aligned, or safe. This project asks who has
standing and the means to compel correction when the delegation is wrong. The unit is the
consequential decision and the delegation that produced it, not the model.

## Operating Context

Readers arrive from search, referrals, or a failure already in progress. The site is read in a
browser, often on a phone. The home page is the front door to `/casebook`, `/standards`,
`/diagnostics`, `/evals`, `/mechanisms`, and `/research`. One author writes the framework with AI
coding agents. There is no council, reviewer panel, or staff, and no standards body has adopted the
drafts.

## Capabilities and Constraints

- Astro site on Cloudflare Workers, built with Bun and Node 22.
- Existing routes, content, schemas, and copy claims must keep working.
- The home page currently carries: the hero question, the Robodebt evidence, the record spine, the
  exception-learning mechanism, the casebook scorecard, the self-test, six reader doors, the
  published map, and the colophon.
- Claims must stay inside the evidence. No invented adoption, customers, benchmarks, or response
  times.
- The repository is in maintenance mode; this redesign is an explicit owner override.

## Brand Commitments

Name: Ethotechnics. The logo glyph (the two-stem section mark) stays. The visual world is open to
replacement. Product truth, copy claims, and content are not.

## Evidence on Hand

- Robodebt: about 470,000 debts raised unlawfully, dozens of tribunal losses, the rule unchanged for
  three years and four months.
- Five scored public failures in `src/data/casebook.json`.
- Draft standards STD-01, STD-02, STD-06, STD-07, STD-08, STD-09; JSON Schemas; a conformance
  checker; a twelve-check eval harness.
- The framework's own failure archive at `/governance`.
- Real copy, links, and data in `src/content` and `src/pages`.

## Product Principles

1. Prove, don't claim: show the mechanism with a real case before offering a tool.
2. The reader's system is the subject: turn the question back to them.
3. Correction is the product: every claim names who has to act.
4. No institutional costume: one author, drafts, no adoption.
5. Keep the route to help short.

## Accessibility & Inclusion

WCAG AA, keyboard navigation, reduced-motion support, semantic headings, and the existing skip link.
The person a system decided about may be in distress, so the page keeps plain language and a visible
route to help.
