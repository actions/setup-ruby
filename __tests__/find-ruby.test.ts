import * as tc from '@actions/tool-cache';
import * as core from '@actions/core';
import fs = require('fs');
import os = require('os');
import path = require('path');
import * as cache from '../src/cache';
import {run} from '../src/main';

describe('find-ruby', () => {
  let inSpy: jest.SpyInstance;
  let tcSpy: jest.SpyInstance;
  let cnSpy: jest.SpyInstance;

  beforeAll(async () => {
    process.env['GITHUB_PATH'] = ''; // Stub out ENV file functionality so we can verify it writes to standard out
    console.log('::stop-commands::stoptoken'); // Disable executing of runner commands when running tests in actions
  });

  beforeEach(() => {
    tcSpy = jest.spyOn(tc, 'find');
    inSpy = jest.spyOn(core, 'getInput');
    cnSpy = jest.spyOn(process.stdout, 'write');
    cnSpy.mockImplementation(line => {
      // uncomment to debug
      // process.stderr.write('write2:' + line + '\n');
    });
  });

  afterEach(() => {
    tcSpy.mockClear();
    cnSpy.mockClear();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    console.log('::stoptoken::'); // Re-enable executing of runner commands when running tests in actions
  }, 100000);

  it('finds a version of ruby already in the cache', async () => {
    let toolPath = path.normalize('/cache/ruby/2.7.0/x64');
    tcSpy.mockImplementation(() => toolPath);

    let cacheDir: string = await cache.find('2.7.0');
    let expPath = path.join(toolPath, 'bin');
    expect(cacheDir).toBe(expPath);
  });

  it('does not find a version of ruby not in the cache', async () => {
    tcSpy.mockImplementation(() => '');

    let cacheDir: string = await cache.find('2.9.9');
    expect(cacheDir).toBeFalsy();
  });

  it('finds a version in the cache and adds it to the path', async () => {
    let toolPath = path.normalize('/cache/ruby/2.7.0/x64');
    inSpy.mockImplementation(() => '2.7.0');
    tcSpy.mockImplementation(() => toolPath);
    await run();

    let expPath = path.join(toolPath, 'bin');
    expect(cnSpy).toHaveBeenCalledWith(`::add-path::${expPath}${os.EOL}`);
  });

  it('handles unhandled error and reports error', async () => {
    let errMsg = 'unhandled error message';
    inSpy.mockImplementation(() => '2.7.0');
    tcSpy.mockImplementation(() => {
      throw new Error(errMsg);
    });
    await run();
    expect(cnSpy).toHaveBeenCalledWith('::error::' + errMsg + os.EOL);
  });
});
