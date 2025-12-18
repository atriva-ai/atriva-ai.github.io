# Utility Scripts

These scripts are used for importing and normalizing documentation from external sources.

## Scripts

### `docs-to-normalize.sh`
Normalizes imported documentation files (frontmatter, formatting, etc.)

### `convert-html-to-yaml.sh`
Converts HTML content to YAML frontmatter format.

### `add-yaml-formatter.sh`
Adds YAML frontmatter to markdown files that are missing it.

## Usage

Run scripts from the project root:

```bash
./scripts/docs-to-normalize.sh
```

These scripts do not affect the web build—Astro ignores the `scripts/` folder.

