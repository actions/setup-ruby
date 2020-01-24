# ADR-0049 Prebuilt Rubies at Runtime

***Status***: proposed

## Context
Currently, only a few versions of Ruby are available at runtime prebuilt by the [virtual-environment images](https://github.com/actions/virtual-environments) as part of the hosted build VM tools cache.  The setup-ruby action only supports using what's in the cache and does not support acquiring other versions at runtime. 

This introduces two problems:

  1.  New version latency: When new versions are released, they are not available for use until a new image is released.
  2.  Versions can be removed.  The current image policy is latest of each minor version.  Even if that is increased to n - 1, [builds that were working can break](https://github.com/actions/virtual-environments/issues/281).  And since images roll through scale units with the readme only being updated once it's everywhere, it's hard to plan for the change and react.

This is in contrast to other setup actions like setup-node where the cache is an optimization but supports pulling any version by a specified semver at runtime.

Ruby officially only supports source code distribution.  There are no "official" pre built distributions since there are system and environmental dependencies.

## Goals

- Offer as many versions as possible by platforms
- Offer popular Ruby variants like JRuby
- Consistent with other setup-xxx actions patterns and Actions workflows.
- Ideally works across all supported scenarios including self-hosted runners.
- Ideally works on all the supported runner platforms (windows, mac-os, all linux variants)
- Ideally works with actions container scenarios

## Options

### Download Prebuilt Rubies on Misses

Other tools like offer a [distribution](https://nodejs.org/dist/) which offers a [queryable endpoint](https://nodejs.org/dist/index.json) which allows the desired version [by a version spec which is semver](https://github.com/actions/setup-node#setup-node).

Other CI services like Travis support pulling a wide variety of [ruby versions offered here](http://rubies.travis-ci.org/).

NOTE: The prebuilt rubies offered will only be supported for use by GitHub Actions.

The scripts and tooling to build the Rubies will be at `actions/build-ruby` and it will be consumed by the existing action `actions/setup-ruby`.  Since the capabilities are additive, there's no need to create a `v2`.  There is no compat break.

A specific version of a Ruby will be offered as an individual build-ruby repo release similar to how the [actions runner exposes versions](https://github.com/actions/runner/releases/tag/v2.164.0) where each version offers n platforms.  This is also similar to [Travis individual versions](http://rubies.travis-ci.org/ubuntu/18.04/s390x/ruby-2.6.5).

**Pros**

On a toolkit cache miss, the first build is slower but not that slow since it's pre-built.

**Cons**

Will not work with self-hosted scenarios
Will not work across all platforms the runner supports
Will not work across various container scenarios
Only supported on hosted VMs 

### Build and Cache Misses at Runtime

[rbenv/ruby-build](https://github.com/rbenv/ruby-build) offers a convenient way to build at runtime.

Build on cache miss of an exact version.  Offer an option to cache using the upcoming [toolkit cache lib](https://github.com/actions/toolkit).  There are plans to factor out the caching logic in the [actions/cache](https://github.com/actions/cache) so other actions can take advantage of caching services.

**Pros**

Aligns well with the only supported Ruby distribution ... source code.
Works on self-hosted, 

**Cons**

The first build on a miss will be slower but will not fail.
Ingress / Egress costs for storage

## Prebuilt Implementation Details 

Option 1: Download Virtual Environment Prebuilt Rubies

The virtual-environments team is working on opening the tool cache prebuilt versions for download.  This is the best download option since it would be the exact same binaries on a cache miss after a version is removed from the images.

Option 2: GitHub GPR Universal Package

The `actions/build-ruby` repo offers packages for [example](https://github.com/actions/setup-ruby/packages). 

Option 3: GitHub Release

The `actions/build-ruby` repo offers releases for [example](https://github.com/actions/runner/releases/tag/v2.164.0)

NOTE: release assets are backed by a CDN

Offering each version as an individual package / release offers queryable APIs and the ability to convey whether pre-release or not by version using the packaging and release features.

This is fairly straight forward to come up with a scheme to complete automate with a workflow.

### Setup action

Repo releases are also queryable via an [http api](https://developer.github.com/v3/repos/releases/).  This allows the `actions/setup-ruby` action to query the versions. match the semver version spec against the list and resolve the latest matching the spec.

The existing action offers a `ruby-version` input which accepts a [semver pattern](https://github.com/actions/setup-ruby/blob/master/action.yml#L7) via the `toolcache.find` api.  The contract will remain the same so there's no breaking compat and need to version to `V2`.

The existing capability will be extended to be consistent with the setup-node action:

1. Attempt to resolve the semver pattern against the tool-cache
2. If no match is found from tool-cache, query the releases api for the `build-ruby` repo.

Setup-node queries the cache first to add reliability in the event of distruptions, self-hosted runners and eventual GHES air gap scenarios.  Testing against n versions is still a scenario for self hosted and on-premises.  Of course, air gapped installations would own populating the cache by versions they want to test against.  The tool cache is simply an envvar pointing to a directory with tools by name, version, arch folders.

The action will enforce the supported list of platforms (ubuntu18, osx 10.15, windows 2019) regardless of hosted or self-hosted.

## More

Not done.  Just starting.  Add consequences, alternatives, etc.






