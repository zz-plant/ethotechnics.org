import { PAGEFIND_PATH, type PagefindModule } from "./types";

export type PagefindAdapter = {
  init: () => Promise<PagefindModule | null>;
};

export const createPagefindAdapter = (): PagefindAdapter => {
  let pagefindPromise: Promise<PagefindModule | null> | null = null;
  let pagefindConfigured = false;

  const loadPagefind = async () => {
    if (pagefindPromise) return pagefindPromise;

    pagefindPromise = import(
      /* @vite-ignore */
      PAGEFIND_PATH
    )
      .then((module) => module as PagefindModule)
      .catch((error) => {
        console.warn(
          "Pagefind not found. Search may not work in dev mode.",
          error,
        );
        pagefindPromise = null;
        return null;
      });

    return pagefindPromise;
  };

  return {
    init: async () => {
      const pagefind = await loadPagefind();
      if (!pagefind) {
        return null;
      }

      if (!pagefindConfigured) {
        await pagefind.options({ excerptLength: 20 });
        pagefindConfigured = true;
      }

      return pagefind;
    },
  };
};
