#!/usr/bin/env bash
cd "$(dirname "$0")" || exit 1

git checkout -b gh-pages
pnpm run build
mv dist docs
git add -f docs
git commit -m "Generate pages: $(date '+%Y-%m-%dT%H:%M:%S%z')"
git push -fu origin gh-pages
git checkout main
git branch -D gh-pages
