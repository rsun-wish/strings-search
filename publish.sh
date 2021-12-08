# set -e
# /usr/local/opt/python@3.7/libexec/bin/python scripts/sync.py
set +e
git add src/data
git add public/translations
git commit -m "sync translations"
git pull --rebase origin master
set -e
yarn build
git checkout -b tmp
cp -fr build/* .
git add -A
git commit -m "sync build"
git push origin tmp:gh-pages -f
git checkout master
git branch -D tmp
echo "Successfully synced web assets"