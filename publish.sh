set -e
cd ${REPO_DIR}
docker build . -t strings_sync 
docker run -v ${WORK_DIR}:/allstrings -v ${REPO_DIR}:/repo strings_sync -w /allstrings -r /repo -t "${XTM_TOKEN}"
set +e
git add src/data
git add public/translations
git commit -m "sync translations"
git pull --rebase origin master
set -e
npm install
yarn build
git checkout -b tmp
cp -fr build/* .
git add -A
git commit -m "sync build"
git push origin tmp:gh-pages -f
git checkout master
git branch -D tmp
echo "Successfully synced web assets"
