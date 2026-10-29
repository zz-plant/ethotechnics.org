# auth.md

How an automated system gets access to ethotechnics.org: it already has it. Nothing on this site requires registration, an API key, or a token.

## Read

No credentials are needed for anything this site publishes.

- Pages: https://ethotechnics.org/sitemap.xml lists every route.
- Read-only JSON endpoints: https://ethotechnics.org/api catalogs them; https://ethotechnics.org/api/agent-index.json is the agent-facing index.
- Retrieval corpus: https://ethotechnics.org/api/rag-corpus.jsonl
- Use terms: robots.txt declares `Content-Signal: search=yes, ai-input=yes, ai-train=yes`. Content is licensed CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/).

## Write

Three endpoints accept anonymous POSTs. The first two require the request's `Origin` header to name this site and an `application/json` Content-Type.

- `POST /api/subscribe` — forwards an email address to the newsletter provider. Rate limited to 5 requests per minute per IP.
- `POST /api/readouts` — stores a diagnostic's inputs and returns the permalink. The readout is unlisted and noindexed; anyone with the link can view it. Rate limited to 10 requests per minute per IP.
- `POST /api/evals/batch` — runs a named evaluation suite against the submitted scenario and returns the scorecard. Nothing is stored.

## What does not exist

No accounts, no OAuth server, no Protected Resource Metadata, no agent registration. This site issues no credentials.

Anything that needs a person: hello@ethotechnics.org.
