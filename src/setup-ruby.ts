import * as core from '@actions/core';
import * as exec from '@actions/exec';
import {ExecOptions} from '@actions/exec/lib/interfaces';
import {findRubyVersion} from './installer';

async function run() {
  try {
    let version = core.getInput('version');

    if (!version) {
      version = core.getInput('ruby-version');
    }

    if (!version) {
      const options: ExecOptions = {};

      // Ignore stderr because there is a fallback
      // option to "ruby_version" parameter.
      options.listeners = {
        stdout: (data: Buffer) => {
          version += data.toString();
        }
      };

      await exec.exec('cat', ['.ruby-version'], options);
    }

    await findRubyVersion(version);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
