import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as path from 'path';
import * as cache from './cache';

export async function run() {
  try {
    let versionSpec = core.getInput('ruby-version');
    if (!versionSpec) {
      // deprecated
      versionSpec = core.getInput('version', {required: true});
    }

    // check in the VMs cache first
    let toolPath: string = await cache.find(versionSpec);

    // TODO: download JIT and/or ruby-build

    if (!toolPath) {
      core.setFailed(`Version ${versionSpec} not found`);
      return;
    }

    core.addPath(toolPath);
  } catch (error) {
    // unhandled
    core.setFailed(error.message);
  }
}
