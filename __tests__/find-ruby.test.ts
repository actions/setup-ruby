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

  //beforeAll(async () => {});

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

  //afterAll(async () => {}, 100000);

  it('finds a version of ruby already in the cache', async () => {
    tcSpy.mockImplementation(() => '/cache/ruby/2.7.0');

    let cacheDir: string = await cache.find('2.7.0');
    expect(cacheDir).toBe(normalize('/cache/ruby/2.7.0/bin'));
  });

  it('does not find a version of ruby not in the cache', async () => {
    tcSpy.mockImplementation(() => '');

    let cacheDir: string = await cache.find('2.9.9');
    expect(cacheDir).toBeFalsy();
  });

  it('finds a version in the cache and adds it to the path', async () => {
    inSpy.mockImplementation(() => '2.7.0');
    tcSpy.mockImplementation(() => '/cache/ruby/2.7.0');
    await run();
    expect(cnSpy).toHaveBeenCalledWith(
      normalize('::add-path::/cache/ruby/2.7.0/bin\n')
    );
  });
});

function normalize(pathToFix: string) {
  let p = pathToFix;

  if (os.platform() === 'win32') {
    p = p.replace(/\//g, '\\');
    p = p.replace(/\n/g, '\r\n');
  }

  return p;
}
