#!/usr/bin/env bash
set -e

BASE_DIR="src/content/docs"

function title_from_filename() {
  local name="$1"
  name="${name%.md}"
  name="${name//-/ }"
  echo "$(tr '[:lower:]' '[:upper:]' <<< ${name:0:1})${name:1}"
}

find "$BASE_DIR" -name "*.md" | while read -r file; do
  # Skip files that already have YAML
  if head -n 1 "$file" | grep -q "^---"; then
    continue
  fi

  dir=$(dirname "$file")
  filename=$(basename "$file")
  title=$(title_from_filename "$filename")

  # Calculate order per folder
  count=$(ls "$dir"/*.md | wc -l)
  order=$((count * 10))

  echo "Adding header to: $file"

  tmp=$(mktemp)

  {
    echo "---"
    echo "title: $title"
    echo "order: $order"
    echo "---"
    echo
    cat "$file"
  } > "$tmp"

  mv "$tmp" "$file"
done

echo "✅ YAML frontmatter added."
