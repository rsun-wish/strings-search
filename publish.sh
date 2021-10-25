set -e
git pull --rebase origin master
yarn build
git checkout -b tmp
cp -fr build/* .
git add -A
git commit -m "sync build"
git push origin tmp:gh-pages -f
git checkout master
git branch -D tmp
echo "Successfully synced web assets"