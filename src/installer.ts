import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as os from 'os';
import * as path from 'path';

const IS_WINDOWS = process.platform === 'win32';

export async function findRubyVersion(engineAndVersion: string) {
  if (!engineAndVersion.includes('-')) {
    engineAndVersion = 'Ruby-' + engineAndVersion;
  }

  const [engine, version] = engineAndVersion.split('-', 2);

  let installDir: string | null = tc.find(engine, version);

  if (!installDir && engine == 'truffleruby') {
    installDir = await downloadTruffleRuby(version);
  }

  if (!installDir) {
    throw new Error(`Ruby version ${engine}-${version} not found`);
  }

  const toolPath: string = path.join(installDir, 'bin');

  if (!IS_WINDOWS) {
    // Ruby / Gem heavily use the '#!/usr/bin/ruby' to find ruby, so this task needs to
    // replace that version of ruby so all the correct version of ruby gets selected
    // replace the default
    const dest: string = '/usr/bin/ruby';
    exec.exec('sudo ln', ['-sf', path.join(toolPath, 'ruby'), dest]); // replace any existing
  }

  core.addPath(toolPath);
}

async function downloadTruffleRuby(version: string): Promise<string> {
  const arch = os.arch();
  const platform = os.platform();
  const convertedArch = arch == 'x64' ? 'amd64' : arch;
  const convertedPlatform = platform == 'darwin' ? 'macos' : platform;

  const fileName = `truffleruby-${version}-${convertedPlatform}-${convertedArch}`;
  const baseUrl = 'https://github.com/oracle/truffleruby/releases/download';
  const downloadUrl = `${baseUrl}/vm-${version}/${fileName}.tar.gz`;

  let downloadPath = await tc.downloadTool(downloadUrl);
  let extractedPath = await tc.extractTar(downloadPath);
  // truffleruby extracts with a root folder that matches the fileName downloaded
  let toolRoot = path.join(extractedPath, fileName);

  // Run the post-install hook
  await exec.exec(path.join(toolRoot, 'lib/truffle/post_install_hook.sh'));

  // Install into the local tool cache
  return await tc.cacheDir(toolRoot, 'truffleruby', version);
}
