# Local icons

`astro-icon` loads this directory as its `local:` collection. The site draws
its icons from the `lucide` iconify collection, so there is nothing here — but
the directory has to exist. When it is missing, the integration throws ENOENT
inside the same `try` that generates icon type definitions, so every build
logged a warning and silently skipped type generation for every collection.

Drop a `.svg` file here to use it as `<Icon name="local:file-name" />`.
