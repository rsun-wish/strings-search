import requests
import wget
import tarfile
import polib
import os
import json
import shutil
from multiprocessing import Pool, Manager
import zipfile
import polib
from datetime import datetime

packages = [{'url': 'https://pypi.infra.wish.com/api/package/wishstrings/', 'folder_name': 'wishstrings', 'is_python': True},
                      {'url': 'https://pypi.infra.wish.com/api/package/merchantstrings/', 'folder_name': 'merchantstrings', 'is_python': True}]
                    #   {'url': 'https://npm.infra.wish.com/-/verdaccio/sidebar/@ContextLogic/mmstrings', 'folder_name': 'mmstrings', 'is_javascript': True}]
work_dir = '/Users/renchen/Work/playground/allstrings'
artifacts_dir = os.path.join(work_dir, 'artifacts')
output_dir = os.path.join(work_dir, 'output')

headers = {
    'Authorization': os.environ.get('XTM_TOKEN')
}

xtm_uri = "https://wish.xtm-intl.com/project-manager-api-rest"
projects_uri = '/projects'
project_uri = '/projects/{0}'
download_source_uri = '/projects/{0}/files/sources/download'

locales_json_dir = os.path.join(output_dir, 'locales.json')
projects_json_dir = os.path.join(output_dir, 'projects.json')
all_projects_sources_dir = os.path.join(work_dir, 'all_projects')
sources_json_dir = os.path.join(output_dir, 'sources.json')
translations_output_dir = os.path.join(output_dir, 'translations')
build_json_dir = os.path.join(output_dir, 'build.json')

versions = {}

def artifacts_helper(pkg_url_obj):
    resp = requests.get(pkg_url_obj['url'])
    resp_json = json.loads(resp.content.decode())
    if 'is_python' in pkg_url_obj:
        url = resp_json['packages'][0]['url']
        dest_dir = os.path.join(artifacts_dir, pkg_url_obj['folder_name'] + '/')
        if not os.path.exists(dest_dir):
            os.makedirs(dest_dir)
        print(f'Downloading {url} to {dest_dir}')
        filepath = wget.download(url, out=dest_dir)
        print('Download successful')
        tar = tarfile.open(filepath)
        untar_dir = os.path.join(dest_dir, 'untar')
        if not os.path.exists(untar_dir):
            os.makedirs(untar_dir)
        tar.extractall(untar_dir)
        parse_content(os.path.basename(filepath).split('.tar.gz')[0], pkg_url_obj['folder_name'], untar_dir)
    if 'is_javascript' in pkg_url_obj:
        pass

def merge(strings, content):
    for key, value in content.items():
        strings[key] = value

def artifacts():
    if os.path.exists(artifacts_dir):
        shutil.rmtree(artifacts_dir)
    p = Pool(8)
    p.map(artifacts_helper, packages)
    strings = {}
    for pkg in packages:
        translations_dir = os.path.join(artifacts_dir, pkg['folder_name'], 'translations')
        locales = os.listdir(translations_dir)
        for locale in locales:
            strings_dir = os.path.join(translations_dir, locale, 'strings.json')
            with open(strings_dir, 'r') as f:
                data = json.load(f)
                if locale in strings:
                    merge(strings[locale], data)
                else:
                    strings[locale] = data

    for locale, value in strings.items():
        strings_dir = os.path.join(translations_output_dir, locale)
        if not os.path.exists(strings_dir):
            os.makedirs(strings_dir)
        with open(os.path.join(strings_dir, 'strings.json'), 'w', encoding='utf8') as f:
            json.dump(value, f, ensure_ascii=False)

    with open(locales_json_dir, 'w') as f:
        l = ['en-US'] + list(strings.keys())
        l.sort()
        json.dump(l, f)

def parse_content(foldername, pkg_folder_name, untar_dir):
    locales_folder = os.path.join(untar_dir, foldername, pkg_folder_name, 'locale')
    locales = os.listdir(locales_folder)
    for locale in locales:
        strings = {}
        if locale.startswith('.'):
            continue
        wish_mo_file_path = os.path.join(locales_folder, locale, 'LC_MESSAGES', 'wish.mo')
        mo = polib.mofile(wish_mo_file_path)
        for entry in mo:
            if entry.msgstr:
                strings[entry.msgstr] = { 'is_translated': True, 'source_string': entry.msgid, 'locale': locale, 'context': entry.msgctxt }
            elif entry.msgstr_plural:
                for plural in entry.msgstr_plural:
                    strings[plural] = { 'is_translated': True, 'source_string': entry.msgid, 'locale': locale, 'context': entry.msgctxt }
            else:
                print('ERROR!!')
                print(entry)
                return
        strings_dir = os.path.join(artifacts_dir, pkg_folder_name, 'translations', locale)
        if not os.path.exists(strings_dir):
            os.makedirs(strings_dir)
        with open(os.path.join(strings_dir, 'strings.json'), 'w', encoding='utf8') as f:
            json.dump(strings, f, ensure_ascii=False)

def get_projects():
    resp = requests.get(xtm_uri + projects_uri, headers=headers)
    total_count = int(resp.headers['xtm-total-items-count'])
    projects = json.loads(resp.content.decode())
    page = 2
    while len(projects) < total_count:
        resp = requests.get(xtm_uri + projects_uri, headers=headers, params={'page': page})
        projects = projects + json.loads(resp.content.decode())
        page = page + 1
    print('succesfully fetched {0} projects'.format(len(projects)))
    return projects

def description_json(description):
    try:
        return json.loads(description)
    except:
        return {}

def projects_json_job(project, projects_json):
    resp = requests.get(xtm_uri + project_uri.format(project['id']), headers=headers)
    project = json.loads(resp.content.decode())
    print(project['name'])
    projects_json[project['name']] = {
        'name': project['name'],
        'id': project['id'],
        'source_locale': project['sourceLanguage'],
        'target_locales': project['targetLanguages']
    }
    if 'description' in project:
        projects_json[project['name']] = {**projects_json[project['name']], **description_json(project['description'])}

def projects_json(projects):
    manager = Manager()
    projects_json = manager.dict()
    p = Pool(8)
    args = []
    for project in projects:
        args.append((project, projects_json))
    p.starmap(projects_json_job, args)
    with open(projects_json_dir, 'w', encoding='utf8') as f:
        json.dump(projects_json.copy(), f, ensure_ascii=False)
    return projects_json

def source_files_job(project):
    data = requests.get(xtm_uri + download_source_uri.format(project['id']), headers=headers).content
    download_dest_path = os.path.join(all_projects_sources_dir, project['name'])
    print('Saving ' + project['name'] + ' to dir: ' + download_dest_path)
    if not os.path.exists(download_dest_path):
        os.makedirs(download_dest_path)
    with open(os.path.join(download_dest_path, 'source.zip'), 'wb') as f:
        f.write(data)

def source_files(projects):
    p = Pool(8)
    p.map(source_files_job, projects)

def sources_json(projects):
    source_files(projects)
    strings = {}
    dirs = os.listdir(all_projects_sources_dir)
    for dir in dirs:
        source_path = os.path.join(all_projects_sources_dir, dir, 'source.zip')
        try:
            if not zipfile.is_zipfile(source_path):
                continue
            zf = zipfile.ZipFile(source_path)
            files = zf.namelist()
            for file in files:
                if file.endswith('.po'):
                    print(file)
                    data = zf.read(file)
                    po = polib.pofile(data.decode())
                    for entry in po:
                        if entry.msgid not in strings:
                            strings[entry.msgid] = [{
                                'project': dir,
                                'context': entry.msgctxt,
                                'plurals': entry.msgid_plural
                            }]
                        else:
                            strings[entry.msgid].append({
                                'project': dir,
                                'context': entry.msgctxt,
                                'plurals': entry.msgid_plural
                            })
                        if entry.msgid_plural:
                            if entry.msgid_plural not in strings:
                                strings[entry.msgid_plural] = [{
                                    'project': dir,
                                    'context': entry.msgctxt
                                }]
                            else:
                                strings[entry.msgid_plural].append({
                                    'project': dir,
                                    'context': entry.msgctxt
                                })
        except Exception as e:
            print(e)
            print(source_path)
    with open(sources_json_dir, 'w', encoding='utf8') as f:
        json.dump(strings, f, ensure_ascii=False)

def copy():
    shutil.copy(projects_json_dir, '../src/data/')
    shutil.copy(sources_json_dir, '../src/data/')
    shutil.copy(locales_json_dir, '../src/data/')
    shutil.copy(build_json_dir, '../src/data/')
    shutil.rmtree('../public/translations')
    shutil.copytree(translations_output_dir, '../public/translations')

def build_stats():
    obj = {
        'last_build_time': datetime.now().isoformat(),
        'versions': {}
    }
    for pkg in packages:
        resp = requests.get(pkg['url'])
        resp_json = json.loads(resp.content.decode())
        if 'is_python' in pkg:
            obj['versions'][resp_json['packages'][0]['name']] = resp_json['packages'][0]['version']
    with open(build_json_dir, 'w') as f:
        json.dump(obj, f)

def main():
    if not os.path.exists(artifacts_dir):
        os.makedirs(artifacts_dir)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    projects = get_projects()
    projects_json(projects)
    sources_json(projects)
    build_stats()
    artifacts()
    copy()

main()