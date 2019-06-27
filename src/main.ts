import * as core from '@actions/core';
import findRubyVersion, {getPlatform} from './find-ruby';

async function run() {
  try {
    const version = core.getInput('version');
    const addToPath = core.getInput('add-to-path');
    await findRubyVersion({version, addToPath}, getPlatform());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
