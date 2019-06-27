import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

const IS_WINDOWS = process.platform === 'win32';

export default async function(version: string) {
  const installDir: string | null = tc.find('Ruby', version);

  if (!installDir) {
    throw new Error(`Version ${version} not found`);
  }

  const toolPath: string = path.join(installDir, 'bin');

  if (!IS_WINDOWS) {
    // Ruby / Gem heavily use the '#!/usr/bin/ruby' to find ruby, so this task needs to
    // replace that version of ruby so all the correct version of ruby gets selected
    // replace the default
    const dest: string = '/usr/bin/ruby';
    exec.exec('sudo ln', ['-sf', path.join(toolPath, 'ruby'), dest]); // replace any existing
  }
}
