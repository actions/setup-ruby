import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

export async function find(version: string): Promise<string> {
  const installDir: string | null = tc.find('Ruby', version);

  let toolPath: string = installDir ? path.join(installDir, 'bin') : '';

  return toolPath;
}
