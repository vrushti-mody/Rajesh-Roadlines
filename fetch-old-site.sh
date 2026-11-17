#!/bin/sh
# Downloads every image the old rajeshrpl.in uses (logo, hero, leadership, awards, icons,
# network graphics, fleet and team galleries) into website/_old-site/, keeping the original paths.
# Run once from the RR folder:   sh fetch-old-site.sh
cd "$(dirname "$0")" || exit 1
OUT=website/_old-site
mkdir -p "$OUT"
total=$(wc -l < old-site-assets.txt | tr -d ' ')
n=0; fail=0
while IFS= read -r p; do
  [ -z "$p" ] && continue
  n=$((n+1))
  mkdir -p "$OUT/$(dirname "$p")"
  if [ -s "$OUT/$p" ]; then continue; fi
  if curl -fsSL --retry 2 -o "$OUT/$p" "https://rajeshrpl.in/wp-content/uploads/$p"; then
    printf '\r%s/%s' "$n" "$total"
  else
    fail=$((fail+1)); echo "  failed: $p"
  fi
done < old-site-assets.txt
echo; echo "Done: $total files, $fail failed. Tell Claude when it has finished."
