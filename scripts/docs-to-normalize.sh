#!/usr/bin/env bash
set -e

TARGET_DIR="${1:-src/pages/docs}"

if [ ! -d "$TARGET_DIR" ]; then
  echo "❌ Directory not found: $TARGET_DIR"
  exit 1
fi

echo "🔍 Normalizing docs in: $TARGET_DIR"

find "$TARGET_DIR" -type f -name "*.md" | while read -r file; do
  dir=$(dirname "$file")
  base=$(basename "$file")

  # 1️⃣ Rename README.md → index.md
  if [ "$base" = "README.md" ]; then
    new="$dir/index.md"
    if [ ! -f "$new" ]; then
      echo "📄 Rename README.md → index.md: $file"
      mv "$file" "$new"
      file="$new"
    else
      file="$new"
    fi
  fi

  content="$(cat "$file")"

  # 2️⃣ Convert HTML comment header → YAML (if exists and YAML missing)
  if echo "$content" | head -n 1 | grep -q "<!--"; then
    if ! echo "$content" | head -n 1 | grep -q "^---"; then
      echo "🔁 HTML → YAML: $file"

      meta=$(sed -n '/<!--/,/-->/p' "$file" | sed '1d;$d')
      body=$(sed '/<!--/,/-->/d' "$file")

      {
        echo "---"
        echo "$meta"
        echo "---"
        echo
        echo "$body"
      } > "$file.tmp"

      mv "$file.tmp" "$file"
    fi
  fi

  # 3️⃣ Remove first H1 if YAML exists (duplicate title)
  if head -n 1 "$file" | grep -q "^---"; then
    awk '
      BEGIN { h1_removed=0 }
      /^# / && h1_removed==0 { h1_removed=1; next }
      { print }
    ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
  fi

done

echo "✅ Docs normalization complete."
