import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

export async function find(version: string): Promise<string> {
  console.log(version);
  const installDir: string | null = tc.find('Ruby', version);
  console.log(installDir);

  let toolPath: string = installDir ? path.join(installDir, 'bin'): '';

  core.addPath(toolPath);
  return toolPath;
}
