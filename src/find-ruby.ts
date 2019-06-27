import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as os from 'os';
import * as path from 'path';

export enum Platform {
  Windows,
  MacOS,
  Linux
}

export function getPlatform(): Platform {
  switch (os.platform()) {
    case 'win32':
      return Platform.Windows;
    case 'darwin':
      return Platform.MacOS;
    case 'linux':
      return Platform.Linux;
    default:
      throw Error('Platform not recognized');
  }
}

interface ActionInputs {
  version: string;
  addToPath: string;
}

export default async function(inputs: ActionInputs, platform: Platform) {
  const installDir: string | null = tc.find('Ruby', inputs.version);

  if (!installDir) {
    throw new Error(`Version ${inputs.version} not found`);
  }

  const toolPath: string = path.join(installDir, 'bin');

  if (platform !== Platform.Windows) {
    // Ruby / Gem heavily use the '#!/usr/bin/ruby' to find ruby, so this task needs to
    // replace that version of ruby so all the correct version of ruby gets selected
    // replace the default
    const dest: string = '/usr/bin/ruby';
    exec.exec('sudo ln', ['-sf', path.join(toolPath, 'ruby'), dest]); // replace any existing
  }

  if (inputs.addToPath === 'true') {
    core.addPath(toolPath);
  }
}
