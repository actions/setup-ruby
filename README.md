# setup-ruby

<p align="left">
  <a href="https://github.com/actions/setup-ruby/actions"><img alt="test status" src="https://github.com/actions/setup-ruby/workflows/build-test/badge.svg"></a>

  <a href="https://github.com/actions/setup-ruby/actions"><img alt="versions status" src="https://github.com/actions/setup-ruby/workflows/ruby-versions/badge.svg"></a>  
</p>

**Please note: This action is deprecated and should no longer be used. The team at GitHub has ceased making and accepting code contributions or maintaining issues tracker. Please, migrate your workflows to the [ruby/setup-ruby](https://github.com/ruby/setup-ruby), which is being actively maintained by the official Ruby organization.**


This action sets up a ruby environment for versions which are installed on the [Actions Virtual Environments](https://github.com/actions/virtual-environments).

Virtual environments contain only one Ruby version within a 'major.minor' release, and are updated with new releases.  Hence, a workflow should only be bound to minor versions.

Note that a `ruby-version:` of `2.6` or `2.6.x` are equivalent.

> Supports `2.4`, `2.5`, `2.6`, and `2.7`.

# Usage

See [action.yml](action.yml)

Basic:
```yaml
steps:
- uses: actions/checkout@v2
- uses: actions/setup-ruby@v1
  with:
    ruby-version: '2.6' # Version range or exact version of a Ruby version to use, using semvers version range syntax.
- run: ruby hello.rb
```

Matrix Testing:
```yaml
jobs:
  build:
    runs-on: ubuntu-16.04
    strategy:
      matrix:
        ruby: [ '2.5', '2.6' ]
    name: Ruby ${{ matrix.ruby }} sample
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-ruby@v1
        with:
          ruby-version: ${{ matrix.ruby }}
      - run: ruby hello.rb
```

Ruby on Rails Testing:
```yaml
name: Rails Unit Tests

on: [push, pull_request]

jobs:
  build:

    runs-on: ubuntu-latest

    services:
      db:
        image: postgres:11
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v2
    - name: Set up Ruby 2.6
      uses: actions/setup-ruby@v1
      with:
        ruby-version: 2.6
    - name: Build and test with Rake
      env:
        PGHOST: 127.0.0.1
        PGUSER: postgres
        RAILS_ENV: test
      run: |
        sudo apt-get -yqq install libpq-dev
        gem install bundler
        bundle install --jobs 4 --retry 3
        bundle exec rails db:create
        bundle exec rails db:migrate
        bundle exec rails test
```

# Caching Dependencies

See [actions/cache](https://github.com/actions/cache) and the [Ruby Gem cache example](https://github.com/actions/cache/blob/master/examples.md#ruby---gem).

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributions

Contributions are welcome!  See [Contributor's Guide](docs/contributors.md)

## Code of Conduct

:wave: Be nice.  See [our code of conduct](CONDUCT)
