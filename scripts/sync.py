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
import argparse
import time

packages = [
    {'url': 'https://pypi.infra.wish.com/api/package/wishstrings/',
     'folder_name': 'wishstrings', 'is_python': True},
    {'url': 'https://pypi.infra.wish.com/api/package/merchantstrings/',
     'folder_name': 'merchantstrings', 'is_python': True},
    {'url': 'https://npm.infra.wish.com/-/verdaccio/sidebar/@ContextLogic/mmstrings',
     'folder_name': 'mmstrings', 'is_javascript': True},
    {'url': 'https://npm.infra.wish.com/-/verdaccio/sidebar/@ContextLogic/bluestrings',
     'folder_name': 'bluestrings', 'is_javascript': True},
    {'url': 'https://npm.infra.wish.com/-/verdaccio/sidebar/@ContextLogic/merchantstrings',
     'folder_name': 'merchantstrings', 'is_javascript': True},
    {'url': 'https://npm.infra.wish.com/-/verdaccio/sidebar/@ContextLogic/wishlocalwebstrings',
     'folder_name': 'wishlocalwebstrings', 'is_javascript': True},
    {'url': 'https://npm.infra.wish.com/-/verdaccio/sidebar/@ContextLogic/wishwebcozystrings',
     'folder_name': 'wishwebcozystrings', 'is_javascript': True},
    {'url': 'https://npm.infra.wish.com/-/verdaccio/sidebar/@ContextLogic/wpsuistrings',
     'folder_name': 'wpsuistrings', 'is_javascript': True},
    {'url': 'https://npm.infra.wish.com/-/verdaccio/sidebar/@ContextLogic/legostrings',
     'folder_name': 'legostrings', 'is_javascript': True}]

work_dir = '/Users/renchen/Work/playground/allstrings'
xtm_token = os.environ.get('XTM_TOKEN')

headers = {
    'Authorization': xtm_token
}

xtm_uri = "https://wish.xtm-intl.com/project-manager-api-rest"
projects_uri = '/projects'
project_uri = '/projects/{0}'
download_source_uri = '/projects/{0}/files/sources/download'

artifacts_dir = os.path.join(work_dir, 'artifacts')
output_dir = os.path.join(work_dir, 'output')
locales_json_dir = os.path.join(output_dir, 'locales.json')
projects_json_dir = os.path.join(output_dir, 'projects.json')
all_projects_sources_dir = os.path.join(work_dir, 'all_projects')
sources_json_dir = os.path.join(output_dir, 'sources.json')
translations_output_dir = os.path.join(output_dir, 'translations')
build_json_dir = os.path.join(output_dir, 'build.json')
repo_dir = None

versions = {}

def setup_dir(dir):
    if not os.path.exists(dir):
        os.makedirs(dir)
    else:
        shutil.rmtree(dir)

def init():
    global artifacts_dir, output_dir, locales_json_dir, projects_json_dir, all_projects_sources_dir, sources_json_dir,\
        build_json_dir, translations_output_dir, headers
    artifacts_dir = os.path.join(work_dir, 'artifacts')
    output_dir = os.path.join(work_dir, 'output')
    locales_json_dir = os.path.join(output_dir, 'locales.json')
    projects_json_dir = os.path.join(output_dir, 'projects.json')
    all_projects_sources_dir = os.path.join(work_dir, 'all_projects')
    sources_json_dir = os.path.join(output_dir, 'sources.json')
    translations_output_dir = os.path.join(output_dir, 'translations')
    build_json_dir = os.path.join(output_dir, 'build.json')
    dirs = [artifacts_dir, output_dir, all_projects_sources_dir, translations_output_dir]
    for dir in dirs:
        if dir:
            setup_dir(dir)
    headers = {
        'Authorization': xtm_token
    }


def download(url):
    local_filename = url.split('/')[-1]
    local_file_dir = os.path.join(artifacts_dir, local_filename)
    print(f'Downloading {url} to {local_file_dir}')
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(local_file_dir, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
    return local_file_dir


def artifacts_helper(pkg_url_obj):
    resp = requests.get(pkg_url_obj['url'])
    resp_json = json.loads(resp.content.decode())
    if 'is_python' in pkg_url_obj:
        url = resp_json['packages'][0]['url']
        dest_dir = os.path.join(artifacts_dir, pkg_url_obj['folder_name'])
        if not os.path.exists(dest_dir):
            os.makedirs(dest_dir)
        filepath = download(url)
        print('Download successful')
        tar = tarfile.open(filepath)
        untar_dir = os.path.join(dest_dir, 'untar')
        if not os.path.exists(untar_dir):
            os.makedirs(untar_dir)
        tar.extractall(untar_dir)
        parse_python_artifact_content(os.path.basename(filepath).split('.tar.gz')
                                      [0], pkg_url_obj['folder_name'], untar_dir)
    if 'is_javascript' in pkg_url_obj:
        dest_dir = os.path.join(
            artifacts_dir, pkg_url_obj['folder_name'] + '/')
        if not os.path.exists(dest_dir):
            os.makedirs(dest_dir)
        url = resp_json['latest']['dist']['tarball']
        filepath = download(url)
        print('Download successful')
        tar = tarfile.open(filepath)
        untar_dir = os.path.join(dest_dir, 'untar')
        if not os.path.exists(untar_dir):
            os.makedirs(untar_dir)
        tar.extractall(untar_dir)
        parse_javacript_artifact_content(untar_dir, pkg_url_obj['folder_name'])


def merge(strings, content):
    for key, value in content.items():
        strings[key] = value

def merge_with_append(strings, content):
    for key, value in content.items():
        if key == 'Payment':
            print(value)
        if key in strings:
            strings[key] = strings[key] + value
        else:
            strings[key] = value


def artifacts():
    print('Start building strings.json for artifacts')
    p = Pool(8)
    p.map(artifacts_helper, packages)
    strings = {}
    for pkg in packages:
        translations_dir = os.path.join(
            artifacts_dir, pkg['folder_name'], 'translations')
        locales = os.listdir(translations_dir)
        for locale in locales:
            strings_dir = os.path.join(
                translations_dir, locale, 'strings.json')
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
            json.dump(value, f, ensure_ascii=False, sort_keys=True)

    with open(locales_json_dir, 'w') as f:
        l = ['en-US'] + list(strings.keys())
        l.sort()
        json.dump(l, f, sort_keys=True)
    print('Successfully built all translations strings.json')


def parse_javacript_artifact_content(untar_dir, pkg_folder_name):
    print('Parsing contents at ' + untar_dir)
    locales_folder = os.path.join(
        untar_dir, 'package')
    files = os.listdir(locales_folder)
    for file in files:
        if file.startswith('.') or file == 'package.json':
            continue
        strings = {}
        locale = file.split('.')[0]
        raw_file_path = os.path.join(locales_folder, locale + '.raw.json')
        with open(raw_file_path, 'r') as f:
            raw_file_data = json.load(f)
            for source_string, value in raw_file_data.items():
                if not source_string:
                    continue

                context = None
                if '\u0004' in source_string:
                    splitted = source_string.split('\u0004')
                    context = splitted[0]
                    source_string = splitted[1]
                normalized_locale = locale.replace('_', '-')
                if value[0]:
                    try:
                        if type(value[1]) is list:
                            for v in value[1]:
                                strings[v] = {
                                    'is_translated': True, 'source_string': source_string, 'locale': normalized_locale,
                                    'context': context, 'package': pkg_folder_name
                                }
                        else:
                            for v in value[1:]:
                                strings[v] = {
                                    'is_translated': True, 'source_string': source_string, 'locale': normalized_locale,
                                    'context': context, 'package': pkg_folder_name
                                }
                    except Exception as e:
                        print(raw_file_path)
                        print(value)
                        raise e
                else:
                    strings[value[1]] = {
                        'is_translated': True, 'source_string': source_string, 'locale': normalized_locale,
                        'context': context, 'package': pkg_folder_name
                    }
            strings_dir = os.path.join(
                artifacts_dir, pkg_folder_name, 'translations', normalized_locale)
            if not os.path.exists(strings_dir):
                os.makedirs(strings_dir)
            with open(os.path.join(strings_dir, 'strings.json'), 'w', encoding='utf8') as f:
                json.dump(strings, f, ensure_ascii=False, sort_keys=True)


def parse_python_artifact_content(foldername, pkg_folder_name, untar_dir):
    print('Parsing contents at ' + untar_dir)
    locales_folder = os.path.join(
        untar_dir, foldername, pkg_folder_name, 'locale')
    locales = os.listdir(locales_folder)
    for locale in locales:
        strings = {}
        if locale.startswith('.'):
            continue
        wish_mo_file_path = os.path.join(
            locales_folder, locale, 'LC_MESSAGES', 'wish.mo')
        mo = polib.mofile(wish_mo_file_path)
        for entry in mo:
            if entry.msgstr:
                strings[entry.msgstr] = {
                    'is_translated': True, 'source_string': entry.msgid, 'locale': locale, 'context': entry.msgctxt, 'package': pkg_folder_name}
            elif entry.msgstr_plural:
                for index in entry.msgstr_plural:
                    strings[entry.msgstr_plural[index]] = {
                        'is_translated': True, 'source_string': entry.msgid, 'locale': locale, 'context': entry.msgctxt, 'package': pkg_folder_name}
            else:
                print('ERROR!!')
                print(entry)
                return
        strings_dir = os.path.join(
            artifacts_dir, pkg_folder_name, 'translations', locale)
        if not os.path.exists(strings_dir):
            os.makedirs(strings_dir)
        with open(os.path.join(strings_dir, 'strings.json'), 'w', encoding='utf8') as f:
            json.dump(strings, f, ensure_ascii=False, sort_keys=True)


def get_projects():
    print('Getting all projects from XTM')
    resp = requests.get(xtm_uri + projects_uri, headers=headers)
    total_count = int(resp.headers['xtm-total-items-count'])
    projects = json.loads(resp.content.decode())
    page = 2
    while len(projects) < total_count:
        resp = requests.get(xtm_uri + projects_uri,
                            headers=headers, params={'page': page})
        projects = projects + json.loads(resp.content.decode())
        page = page + 1
    print('Successfully fetched {0} projects'.format(len(projects)))
    return projects


def description_json(description):
    try:
        return json.loads(description)
    except:
        return {}


def projects_json_job(project):
    projects_json = {}
    resp = requests.get(
        xtm_uri + project_uri.format(project['id']), headers=headers)
    project = json.loads(resp.content.decode())
    projects_json[project['name']] = {
        'name': project['name'],
        'id': project['id'],
        'source_locale': project['sourceLanguage'],
        'target_locales': project['targetLanguages']
    }
    if 'description' in project:
        projects_json[project['name']] = {
            **projects_json[project['name']], **description_json(project['description'])}
    return projects_json


def projects_json(projects):
    print('Start building projects.json')
    projects_json = {}
    p = Pool(8)
    results = p.map(projects_json_job, projects)
    p.close()
    p.join()
    for ret in results:
        merge(projects_json, ret)
    with open(projects_json_dir, 'w', encoding='utf8') as f:
        json.dump(projects_json.copy(), f, ensure_ascii=False, sort_keys=True)
    print('Successfully saved projects.json to ' + projects_json_dir)
    return projects_json


def source_files_job(project):
    data = requests.get(
        xtm_uri + download_source_uri.format(project['id']), headers=headers).content
    download_dest_path = os.path.join(
        all_projects_sources_dir, project['name'])
    print('Saving ' + project['name'] + ' to dir: ' + download_dest_path)
    if not os.path.exists(download_dest_path):
        os.makedirs(download_dest_path)
    with open(os.path.join(download_dest_path, 'source.zip'), 'wb') as f:
        f.write(data)


def source_files(projects):
    p = Pool(8)
    p.map(source_files_job, projects)


def sources_json_job(source_path, dir):
    try:
        strings = {}
        if not zipfile.is_zipfile(source_path):
            print(source_path + ' is not a valid zip file. Skipping...')
            return strings
        zf = zipfile.ZipFile(source_path)
        files = zf.namelist()
        for file in files:
            if file.endswith('.po'):
                data = zf.read(file)
                po = polib.pofile(data.decode())
                for entry in po:
                    if entry.msgid == 'Payment':
                        print(dir)
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
        return strings
    except Exception as e:
        print(e)
        raise e


def sources_json(projects):
    print('Start building sources.json')
    source_files(projects)
    dirs = os.listdir(all_projects_sources_dir)
    p = Pool(8)

    args = [(os.path.join(all_projects_sources_dir, dir, 'source.zip'), dir)
            for dir in dirs]
    results = p.starmap(sources_json_job, args)
    p.close()
    p.join()
    strings = {}
    for ret in results:
        merge_with_append(strings, ret)
    with open(sources_json_dir, 'w', encoding='utf8') as f:
        json.dump(strings, f, ensure_ascii=False, sort_keys=True)
    print('Successfully saved sources.json to ' + sources_json_dir)


def copy():
    data_dir = os.path.join(repo_dir, 'src/data')
    translations_dir = os.path.join(repo_dir, 'public/translations')
    shutil.copy(projects_json_dir, data_dir)
    print('Copied artifact: ' + projects_json_dir, data_dir)
    shutil.copy(sources_json_dir, data_dir)
    print('Copied artifact: ' + sources_json_dir, data_dir)
    shutil.copy(locales_json_dir, data_dir)
    print('Copied artifact: ' + locales_json_dir, data_dir)
    shutil.copy(build_json_dir, data_dir)
    print('Copied artifact: ' + build_json_dir, data_dir)
    shutil.rmtree(translations_dir)
    shutil.copytree(translations_output_dir, translations_dir)
    print('Copied artifact: ' + translations_output_dir, translations_dir)


def build_stats():
    print('Start building build.json')
    obj = {
        'last_build_time': datetime.now().isoformat(),
        'versions': {}
    }
    for pkg in packages:
        resp = requests.get(pkg['url'])
        resp_json = json.loads(resp.content.decode())
        if 'is_python' in pkg:
            obj['versions'][pkg['folder_name']
                            ] = resp_json['packages'][0]['version']
        if 'is_javascript' in pkg:
            obj['versions'][pkg['folder_name']] = resp_json['latest']['version']
    with open(build_json_dir, 'w') as f:
        json.dump(obj, f, sort_keys=True)
    print('Successfuly saved build.json' + build_json_dir)


def main():
    start = time.time()
    parser = argparse.ArgumentParser(
        description='Sync sources and translations')
    parser.add_argument('-w', '--work_dir',
                        help='Working directory', required=True)
    parser.add_argument('-r', '--repo_dir',
                        help='Repository directory', required=True)
    parser.add_argument('-t', '--token', help='XTM token', required=True)
    args = vars(parser.parse_args())
    global work_dir, xtm_token, repo_dir
    work_dir = args['work_dir']
    xtm_token = args['token']
    repo_dir = args['repo_dir']
    init()

    projects = get_projects()
    projects_json(projects)
    sources_json(projects)
    build_stats()
    artifacts()
    copy()
    print('Done')
    print('Took: ' + str(time.time() - start) + ' seconds')

main()
