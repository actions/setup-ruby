import * as core from '@actions/core';
import {findRubyVersion} from './installer';

async function run() {
  try {
    let version = core.getInput('version');
    if (!version) {
      version = core.getInput('ruby-version');
    }
    await findRubyVersion(version);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
