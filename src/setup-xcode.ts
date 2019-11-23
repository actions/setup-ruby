import * as core from '@actions/core';
import {installXcode} from './installer';

async function run() {
  try {
    let xcodeVersion = core.getInput('xcode-version');
    let appleID = core.getInput('apple-id');
    let appleIDPassword = core.getInput('apple-password');

    await installXcode(xcodeVersion, appleID, appleIDPassword);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
