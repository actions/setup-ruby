import * as core from '@actions/core';
import {findRubyVersion} from './installer';

async function run() {
  try {
    const version = core.getInput('version');
    await findRubyVersion(version);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
