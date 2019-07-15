import * as io from '@actions/io';
import fs = require('fs');
import os = require('os');
import path = require('path');

const toolDir = path.join(__dirname, 'runner', 'tools');
const tempDir = path.join(__dirname, 'runner', 'temp');

process.env['RUNNER_TOOLSDIRECTORY'] = toolDir;
process.env['RUNNER_TEMPDIRECTORY'] = tempDir;

import findRubyVersion from '../src/installer';

describe('find-ruby', () => {
  beforeAll(async () => {
    await io.rmRF(toolDir);
    await io.rmRF(tempDir);
  });

  afterAll(async () => {
    try {
      await io.rmRF(toolDir);
      await io.rmRF(tempDir);
    } catch {
      console.log('Failed to remove test directories');
    }
  }, 100000);

  it('findRubyVersion throws if cannot find any version of ruby', async () => {
    let thrown = false;
    try {
      await findRubyVersion('>= 2.4');
    } catch {
      thrown = true;
    }
    expect(thrown).toBe(true);
  });

  it('findRubyVersion throws version of ruby is not complete', async () => {
    let thrown = false;
    const rubyDir: string = path.join(toolDir, 'Ruby', '2.4.6', os.arch());
    await io.mkdirP(rubyDir);
    try {
      await findRubyVersion('>= 2.4');
    } catch {
      thrown = true;
    }
    expect(thrown).toBe(true);
  });

  it('findRubyVersion adds ruby bin to PATH', async () => {
    const rubyDir: string = path.join(toolDir, 'Ruby', '2.4.6', os.arch());
    await io.mkdirP(rubyDir);
    fs.writeFileSync(`${rubyDir}.complete`, 'hello');
    await findRubyVersion('>= 2.4');
    const binDir = path.join(rubyDir, 'bin');
    expect(process.env['PATH']!.startsWith(`${binDir};`)).toBe(true);
  });
});
