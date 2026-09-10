# OG card fonts

`/api/og.png` is rendered by resvg compiled to WebAssembly. That build has no
access to system fonts, so any text in the card is dropped unless a font buffer
is handed to it explicitly — which is why the OG image used to render as a
frame with nothing in it.

These are Latin subsets of [Source Serif 4][serif] and [Source Sans 3][sans],
both under the SIL Open Font License 1.1 (see `OFL.txt`). They are fetched at
request time from the deployed static assets, the same way the resvg wasm
already is, so they add nothing to the Worker bundle.

Regenerate from the upstream variable fonts with:

```sh
python3 -m fontTools.varLib.instancer 'SourceSerif4[opsz,wght].ttf' wght=600 opsz=32 -o serif600.ttf
python3 -m fontTools.subset serif600.ttf \
  --unicodes='U+0020-007E,U+00A0-00FF,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+00A7,U+2192' \
  --layout-features='kern,liga,calt' --no-hinting --desubroutinize \
  --output-file=source-serif-4-semibold-latin.ttf
```

The name table is then rewritten so the family reads `Source Serif 4` /
`Source Sans 3` with the right weight class: `varLib.instancer` carries over the
default instance's name, which would otherwise leave both sans weights claiming
to be "Source Sans 3 ExtraLight".

[serif]: https://github.com/google/fonts/tree/main/ofl/sourceserif4
[sans]: https://github.com/google/fonts/tree/main/ofl/sourcesans3
