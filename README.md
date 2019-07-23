# setup-ruby

This action sets up a ruby environment for use in actions by:

- optionally installing a version of ruby and adding to PATH. Note that this action only uses versions of Ruby already installed in the cache. The action will fail if no matching versions are found.
- registering problem matchers for error output

# Usage

See [action.yml](action.yml)

Basic:
```yaml
actions:
- uses: actions/checkout@master
- uses: actions/setup-ruby@master
  with:
    version: 2.x // Version range or exact version of a Ruby version to use, using semvers version range syntax.
- run: ruby hello.rb
```

Matrix Testing:
```yaml
jobs:
  build:
    strategy:
      matrix:
        ruby: [ 2.x, 3.x ]
    name: Ruby ${{ matrix.ruby }} sample
    actions:
      - uses: actions/checkout@master
      - name: Setup ruby
        uses: actions/setup-ruby@master
        with:
          version: ${{ matrix.ruby }}
          architecture: x64
      - run: ruby hello.rb
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributions

Contributions are welcome!  See [Contributor's Guide](docs/contributors.md)
