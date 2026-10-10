import { describe, expect, it } from "bun:test";

import { toSeoRobotsProps } from "./robots";

describe("toSeoRobotsProps", () => {
  it("keeps the default directives, with the snippet limits as extras", () => {
    expect(
      toSeoRobotsProps(
        "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      ),
    ).toEqual({
      noindex: false,
      nofollow: false,
      robotsExtras:
        "max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    });
  });

  it("lets a page stay out of the index while its links are followed", () => {
    expect(toSeoRobotsProps("noindex, follow")).toEqual({
      noindex: true,
      nofollow: false,
    });
  });

  it("reads noindex and nofollow in any case and order", () => {
    expect(toSeoRobotsProps(" NoFollow ,noindex")).toEqual({
      noindex: true,
      nofollow: true,
    });
  });
});
