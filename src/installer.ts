import * as core from '@actions/core';
import * as exec from '@actions/exec';

const IS_MACOS = process.platform === 'darwin';

export async function installXcode(
  version: string,
  appleID: string | null,
  appleIDPassword: string | null
) {
  if (!IS_MACOS) {
    throw new Error(`${process.platform} is not supported!`);
  }

  if (
    (await exec.exec('xcversion', ['select', version], {
      ignoreReturnCode: true
    })) != 0
  ) {
    core.warning(`Xcode ${version} not avilable in local.`);

    if (!appleID) {
      throw new Error(`apple-id is required to download Xcode.`);
    }

    if (!appleIDPassword) {
      throw new Error(`apple-id-password is required to download Xcode.`);
    }

    await exec.exec('xcversion', ['install', version], {
      env: {
        ...process.env,
        XCODE_INSTALL_USER: appleID,
        XCODE_INSTALL_PASSWORD: appleIDPassword
      }
    });

    await exec.exec('xcversion', ['select', version]);
  }

  await exec.exec(`sudo xcodebuild -license accept`);
}
