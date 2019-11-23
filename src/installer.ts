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
    (await exec.exec(`xcversion select ${version}`, undefined, {
      ignoreReturnCode: false,
      silent: true
    })) != 0
  ) {
    if (!appleID) {
      throw new Error(`apple-id is required to download Xcode.`);
    }

    if (!appleIDPassword) {
      throw new Error(`apple-id-password is required to download Xcode.`);
    }

    await exec.exec(`xcversion install ${version}`, undefined, {
      env: {
        XCODE_INSTALL_USER: appleID,
        XCODE_INSTALL_PASSWORD: appleIDPassword
      }
    });

    await exec.exec(`xcversion select ${version}`);
  }

  await exec.exec(`sudo xcodebuild -license accept`);
}
