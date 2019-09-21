import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

export async function findRubyVersion(version: string) {
  const installDir: string | null = tc.find('Ruby', version);

  if (!installDir) {
    throw new Error(`Version ${version} not found`);
  }

  const toolPath: string = path.join(installDir, 'bin');

  core.addPath(toolPath);
}
