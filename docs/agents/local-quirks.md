# Local quirks

Failures that look like a regression from your change and are not. Check here before debugging.

## Dependencies and Bun

- A new worktree or a branch switch can leave `node_modules` behind `bun.lock`. Run
  `bun install --frozen-lockfile` first. `bun run agent:doctor` reports the mismatch; until it is
  fixed, `conformance:action:check` says the bundle is out of date when it is not. Do not
  regenerate the bundle to make that message go away.
- `package.json` pins Bun. An older Bun fails the frozen install and leaves `node_modules` stale.
  `mise.toml` carries the same pin; without mise, check `bun --version` against `packageManager`.
- `bunfig.toml` sets `frozenLockfile = true`, so `bun add` and `bun remove` print a note and
  change nothing, and `--no-frozen-lockfile` does not help. To change a dependency: set it to
  `false`, run the command, restore it, then confirm with `bun install --frozen-lockfile`.
- `bun add` for a package already resolved transitively updates `package.json` and can leave
  the root `dependencies` block of `bun.lock` untouched. Add the line by hand and confirm with
  the frozen install.

## Dev server

- `bun run dev` can exit with code 1 on its first start after dependencies re-optimize
  (`The file does not exist at node_modules/.vite/deps_ssr/...`). Start it again.
- After `bun run build` or `bun run check`, a running dev server answers 500 with the same
  error. Stop it and start it again. Verify in the browser before running `check`.
- A dev server can keep serving a component's old scoped `<style>` after an edit. Restart it
  before judging a layout.
- Two dev servers in one checkout share `node_modules/.vite` and crash each other. Give the
  second its own `vite.cacheDir` through an override config, or use a separate worktree.
- The dev server does not enforce the Content-Security-Policy; production does. An inline
  `<style>` inside an `<svg>` renders in dev and is dropped in production. To check CSP, run
  `bun run build`, then `bun run preview:cf`, and read the browser console.
- To run a worktree's dev server from another directory: `bun run --cwd=<worktree> dev`. The
  flag order matters; `bun --cwd <worktree> run dev` prints usage.
- In an `.astro` file, punctuation on its own line after an `{expression}` renders with a space
  before it. Put the punctuation inside the expression.

## Ports

- The dev server, Playwright, `check:reachability`, and `check:sitemap` all default to port 4321.
  If another project holds that port, they test that project without complaint. Check with
  `lsof -nP -iTCP:4321 -sTCP:LISTEN`, or run `bun run preview:cf` and pass its address:
  `bun run check:reachability http://127.0.0.1:8787`.
- Playwright reuses a running server and builds only when `dist/server/entry.mjs` is missing, so
  a stale `dist/` is tested as it stands. Run `bun run build` first.

## End-to-end tests

- `bunx playwright test` runs Chromium, Firefox, and WebKit. If a browser build is not
  installed, every test for it fails at launch. Pass `--project=chromium`, or install with
  `bunx playwright install`.
- Run e2e against the build, not the dev server. Against dev, the "exactly one h1" checks fail
  because locators reach into the Astro dev toolbar.
- The console and web-vitals tests in `quality.e2e.ts` can fail under three-browser parallel
  load and pass when rerun alone.

## Browser automation

- In a hidden or background browser tab, `requestAnimationFrame` is throttled, smooth scrolling
  stalls, and hovering does not trigger `:hover`. Wait about 600 ms before reading UI that
  updates in a frame callback, scroll with `behavior: "instant"`, and open hover cards with
  `.focus()`.
- Tabs can be shared between agents. Open your own tab and address it by id.

## Formatting

- In MDX prose, a wrapped line that starts with inline HTML (`<a>`, `<strong>`) gets a blank line
  from Prettier, and MDX splits the sentence into two paragraphs. Use markdown syntax.
- `prettier-plugin-astro` 1.x puts a space before punctuation that follows a closing tag on
  rendered pages. The version is held back; verify any formatter upgrade by reading rendered
  text, not the diff.
