# Agent metadata and API

Guidance for machine-readable metadata, JSON-LD coverage, and the public JSON endpoints.

## JSON-LD strategy

- Use `CollectionPage` for index pages and `CreativeWork`/`Report` for individual entries.
- Favor `identifier`, `version`, and canonical `url` fields for stable agent references.
- Keep summaries short and align them with page copy so agents can reuse the same language.

### Sample payloads

**Standards index (collection)**

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Standards — Ethotechnics Institute",
  "hasPart": [
    {
      "@type": "CreativeWork",
      "name": "STD-01 — The Temporal Bill of Rights",
      "identifier": "STD-01",
      "version": "1.0",
      "url": "https://ethotechnics.org/standards/std-01-temporal-rights"
    }
  ]
}
```

**Research artifacts (collection)**

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Research — Ethotechnics",
  "hasPart": [
    {
      "@type": "Report",
      "name": "Consent integrity instrument pack",
      "url": "https://ethotechnics.org/research/bridge-artifacts#consent-instrument"
    }
  ]
}
```

**Glossary entry (defined term)**

```json
{
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  "name": "Consent journey",
  "url": "https://ethotechnics.org/glossary/consent-journey",
  "inDefinedTermSet": "https://ethotechnics.org/glossary"
}
```

## JSON API endpoints

The public API endpoints provide lightweight JSON for agents and tooling:

- `/api/agent-index.json` — quick-start discovery index with core endpoints and docs links.
- `/api/standards.json` — standard metadata and permalinks.
- `/api/mechanisms.json` — mechanism patterns, filters, and glossary references.
- `/api/glossary.json` — flattened glossary entries with category labels.
- `/api/research.json` — orientation cards, agenda items, focus areas, publications, and timeline
  data.

Each response includes a `meta` block with `generatedAt` and a `permalink` reference.

## Agent discovery

- `/sitemap.xml` lists public pages for agent crawling.
- `/robots.txt` documents the crawl policy and sitemap location.
