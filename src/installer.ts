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

  if ((await exec.exec(`xcversion select ${version}`)) != 0) {
    if (!appleID) {
      throw new Error(`apple-id is required to download Xcode.`);
    }

    if (!appleIDPassword) {
      throw new Error(`apple-id-password is required to download Xcode.`);
    }

    let output = '';
    let resultCode = 0;

    resultCode = await exec.exec(`xcversion install ${version}`, undefined, {
      env: {
        XCODE_INSTALL_USER: appleID,
        XCODE_INSTALL_PASSWORD: appleIDPassword
      },
      listeners: {
        stdout: (data: Buffer) => {
          output += data.toString();
        }
      }
    });
    if (resultCode != 0) {
      throw `Failed to detect os with result code ${resultCode}. Output: ${output}`;
    }

    resultCode = await exec.exec(`xcversion select ${version}`, undefined, {
      listeners: {
        stdout: (data: Buffer) => {
          output += data.toString();
        }
      }
    });
    if (resultCode != 0) {
      throw `Failed to detect os with result code ${resultCode}. Output: ${output}`;
    }

    resultCode = await exec.exec(`sudo xcodebuild -license accept`, undefined, {
      listeners: {
        stdout: (data: Buffer) => {
          output += data.toString();
        }
      }
    });
    if (resultCode != 0) {
      throw `Failed to detect os with result code ${resultCode}. Output: ${output}`;
    }
  }
}
