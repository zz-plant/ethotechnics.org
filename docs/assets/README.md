# Brand kit

Images for listings, profiles, and posts that link to ethotechnics.org. Nothing on the site reads
them. `README.md` at the repository root shows `ethotechnics.org-casebook.png`.

## Generated

`bun run assets:generate` (`scripts/generate-scenes.ts`) draws every file in this table and
`source.svg`. Do not edit them by hand.

| File suffix               | Size                         | What it draws                                 |
| ------------------------- | ---------------------------- | --------------------------------------------- |
| `og`, `unfurl`, `github`  | 1200×675, 1200×628, 1280×640 | The card on paper                             |
| `mastodon`                | 1200×600                     | The card on sapphire                          |
| `dark-og`                 | 960×540                      | The card on the dark theme's ground           |
| `header`                  | 1920×400                     | The lockup, a rule, the question, the kicker  |
| `square`, `dark`          | 1080×1080, 960×540           | The stacked lockup over the kicker            |
| `card`, `touch`, `circle` | 400×300, 360×360, 540×540    | The stacked lockup                            |
| `email`, `badge`          | 600×200, 240×96              | The tile beside the wordmark                  |
| `favicon`, `touch-icon`   | 64×64, 360×360               | The mark on its tile                          |
| `blur`                    | 50×28                        | A placeholder: the ground, the rule, the tile |

The parts are the site's own:

- The mark is the section sign `scripts/generate-icons.ts` draws for the favicon.
- The wordmark is the header's: ETHOTECHNICS over INSTITUTE, in the serif.
- The card is the share cards' layout and palette (`src/utils/seo/og-cards.ts`).
- The faces are the three in `src/assets/fonts/`, the ones the share cards render with.
- The question is the home page's `h1`. The line under it is the home share card's kicker. The
  script reads both from the source when it runs, and stops if it cannot find one.

Run the command again after the home page's `h1`, the home share card's kicker, the mark, or the
palette changes. `bun run assets:check` checks each file's dimensions and that it is not truncated.
It does not check drift, so a stale kit passes.

## Made by hand

The script does not draw these two. Retake them when what they show changes.

- `ethotechnics.org-casebook.png`: a screenshot of the Robodebt entry on `/casebook`.
- `ethotechnics.org-github-preview.png`: a 1280×640 card with the home page's question.
