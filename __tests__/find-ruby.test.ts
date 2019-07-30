import * as io from '@actions/io';
import fs = require('fs');
import os = require('os');
import path = require('path');

const toolDir = path.join(__dirname, 'runner', 'tools');
const tempDir = path.join(__dirname, 'runner', 'temp');

process.env['AGENT_TOOLSDIRECTORY'] = toolDir;
process.env['RUNNER_TOOL_CACHE'] = toolDir;
process.env['RUNNER_TEMP'] = tempDir;

import {findRubyVersion} from '../src/installer';

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

  it('Uses version of ruby installed in cache', async () => {
    const rubyDir: string = path.join(toolDir, 'Ruby', '17.0.0', os.arch());
    await io.mkdirP(rubyDir);
    fs.writeFileSync(`${rubyDir}.complete`, 'hello');
    // This will throw if it doesn't find it in the cache (because no such version exists)
    await findRubyVersion('17.0.0');
  });

  it('findRubyVersion throws if cannot find any version of ruby', async () => {
    let thrown = false;
    try {
      await findRubyVersion('9.9.9');
    } catch {
      thrown = true;
    }
    expect(thrown).toBe(true);
  });

  it('findRubyVersion adds ruby bin to PATH', async () => {
    const rubyDir: string = path.join(toolDir, 'Ruby', '2.4.6', os.arch());
    await io.mkdirP(rubyDir);
    fs.writeFileSync(`${rubyDir}.complete`, 'hello');
    await findRubyVersion('2.4.6');
    const binDir = path.join(rubyDir, 'bin');
    console.log(`binDir: ${binDir}`);
    console.log(`PATH: ${process.env['PATH']}`);
    expect(process.env['PATH']!.startsWith(`${binDir}`)).toBe(true);
  });
});
