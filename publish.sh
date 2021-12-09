PATH=/home/rsun/ContextLogic/clroot/ci/bin:/home/rsun/.toolbox/bin:/home/rsun/.pyenv/shims:/home/rsun/.pyenv/bin:/home/rsun/.pyenv/shims:/home/rsun/.pyenv/bin:/home/rsun/.pyenv/shims:/home/rsun/.pyenv/bin:/home/rsun/.pyenv/shims:/home/rsun/.pyenv/bin:/home/rsun/.pyenv/shims:/home/rsun/.pyenv/bin:/home/rsun/.pyenv/shims:/home/rsun/.pyenv/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/home/rsun/.nvm/versions/node/v15.3.0/bin:/Users/renchen/go/bin/:/home/rsun/.pyenv/bin:/home/rsun/.npm-global/lib/node_modules/yarn/bin
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
yarn build
git checkout -b tmp
cp -fr build/* .
git add -A
git commit -m "sync build"
git push origin tmp:gh-pages -f
git checkout master
git branch -D tmp
echo "Successfully synced web assets"
