/**
 * The React twin of components/ActionIcon.astro, for islands that cannot
 * render astro-icon. The bodies are lucide's copy, download, and
 * arrow-up-right icons, copied from @iconify-json/lucide so an island does
 * not bundle the whole collection.
 */
const bodies = {
  copy: (
    <>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </>
  ),
  download: (
    <>
      <path d="M12 15V3m9 12v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10l5 5l5-5" />
    </>
  ),
  external: <path d="M7 7h10v10M7 17L17 7" />,
};

type Props = { action: keyof typeof bodies };

export function ActionIcon({ action }: Props) {
  return (
    <svg
      className={
        action === "external"
          ? "action-icon action-icon--trailing"
          : "action-icon"
      }
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {bodies[action]}
    </svg>
  );
}
