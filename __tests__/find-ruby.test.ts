import * as tc from '@actions/tool-cache';
import * as core from '@actions/core';
import fs = require('fs');
import os = require('os');
import path = require('path');
import cache = require('../src/cache');
import setup = require('../src/setup-ruby');

describe('find-ruby', () => {
  let inSpy: jest.SpyInstance;
  let tcSpy: jest.SpyInstance;
  let cnSpy: jest.SpyInstance;
  let output: string = '';

  beforeAll(async () => {

  });

  beforeEach(() => {
    tcSpy = jest.spyOn(tc, 'find');
    inSpy = jest.spyOn(core, 'getInput');
    cnSpy = jest.spyOn(process.stdout, 'write');
    cnSpy.mockImplementation(() => {
      // uncomment to debug
      // process.stderr.write('write:' + line + '\n');
    })
  });

  afterEach(() => {
    tcSpy.mockClear();
    cnSpy.mockClear();
    jest.clearAllMocks();
    console.error("==== output ====");
    console.error(output);
  });

  afterAll(async () => {

  }, 100000);

  it('finds a version of ruby already in the cache', async () => {
    tcSpy.mockImplementation(() => '/cache/ruby/2.7.0');

    let cacheDir: string = await cache.find('2.7.0');
    expect(cacheDir).toBe('/cache/ruby/2.7.0/bin');
    expect(cnSpy).toHaveBeenCalledWith('::add-path::/cache/ruby/2.7.0/bin\n');
  });

  it('does not find a version of ruby not in the cache', async () => {
    tcSpy.mockImplementation(() => '');

    let cacheDir: string = await cache.find('2.9.9');
    expect(cacheDir).toBeFalsy();
  });  

  it('finds a version in the cache and adds it to the path', async () => {
    inSpy.mockImplementation(() => '2.7.0');
    tcSpy.mockImplementation(() => '/cache/ruby/2.7.0');
    setup.run();
    expect(cnSpy).toHaveBeenCalledWith('::add-path::/cache/ruby/2.7.0/bin\n');
  });
});
