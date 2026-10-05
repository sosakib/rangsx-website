#!/usr/bin/env bash
# Publish the site to GitHub Pages: https://sosakib.github.io/rangsx-website/
# Builds dist/ under /rangsx-website/ and force-pushes it to the gh-pages branch (Pages serves that branch).
# Run from Git Bash: ./deploy-pages.sh
set -e
cd "$(dirname "$0")"
MSYS_NO_PATHCONV=1 BASE=/rangsx-website node site/build.mjs
touch dist/.nojekyll
cd dist
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy $(git -C .. rev-parse --short HEAD)"
git push -f -q "$(git -C .. remote get-url origin)" gh-pages
rm -rf .git
echo "Deployed. Live in a minute or two at https://sosakib.github.io/rangsx-website/"
