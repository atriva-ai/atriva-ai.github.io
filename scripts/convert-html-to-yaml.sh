#!/usr/bin/env bash

set -e

DOCS_DIR="src/content/docs"

find "$DOCS_DIR" -name "*.md" | while read -r file; do
  # Check if file starts with <!--
  if head -n 1 "$file" | grep -q "<!--"; then
    echo "Converting: $file"

    # Extract metadata between <!-- and -->
    metadata=$(sed -n '/<!--/,/-->/p' "$file" \
      | sed '1d;$d')

    # Remove HTML comment block
    content=$(sed '/<!--/,/-->/d' "$file")

    # Write back with YAML frontmatter
    {
      echo "---"
      echo "$metadata"
      echo "---"
      echo
      echo "$content"
    } > "$file"
  fi
done

echo "✅ Conversion complete."
