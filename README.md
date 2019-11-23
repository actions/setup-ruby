# actions-setup-xcode

<p align="left">
  <a href="https://github.com/sinoru/actions-setup-xcode"><img alt="GitHub Actions status" src="https://github.com/sinoru/actions-setup-xcode/workflows/Main%20workflow/badge.svg"></a>
</p>

This action sets up a ruby environment for use in actions by:

- optionally installing a version of ruby and adding to PATH. Note that this action only uses versions of Ruby already installed in the cache. The action will fail if no matching versions are found.
- registering problem matchers for error output

# Usage

See [action.yml](action.yml)

Basic:
```yaml
steps:
- uses: actions/checkout@master
- uses: sinoru/actions-setup-xcode@master
  with:
    xcode-version: '11.2.1' # Exact version of a Xcode version to use
    apple-id: 'bot@sinoru.io' # Apple ID to download from Apple Developer when Xcode not avilable in local
    apple-id-password: ${{ secrets.APPLE_ID_PASSWORD }}
- run: xcodebuild -h
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributions

Contributions are welcome!  See [Contributor's Guide](docs/contributors.md)
