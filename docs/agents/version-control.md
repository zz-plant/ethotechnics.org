# Version control

Keep the repository history clean, meaningful, and easy to navigate.

## Commit messages

- Write meaningful commit messages that describe the change, not the files touched.
- Use imperative mood: "Add validation" not "Added validation" or "Adds validation."
- Keep the first line under 72 characters; add details in the body if needed.
- Reference issue numbers when applicable: `Fix #123: resolve login redirect loop`.

## Commit message examples

```text
Add glossary validation script

Validates that all terms have definitions and categories before build.
```

```text
Fix accessibility contrast on hero section

Adjust text color to meet WCAG AA standards (4.5:1 ratio).
```

## Branch conventions

- Work on feature branches; keep `main` deployable.
- Use descriptive branch names: `feature/agent-workflows`, `fix/header-contrast`.
- Keep branches short-lived; merge or delete after completion.

## Working tree hygiene

- Run `git status` before finishing a task to confirm only intended files changed.
- Avoid committing generated files, build artifacts, or IDE-specific settings.
- Use `.gitignore` additions for new generated content patterns.
