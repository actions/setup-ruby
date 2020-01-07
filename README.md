# setup-ruby

<p align="left">
  <a href="https://github.com/actions/setup-ruby"><img alt="GitHub Actions status" src="https://github.com/actions/setup-ruby/workflows/Main%20workflow/badge.svg"></a>
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
- uses: actions/setup-ruby@v1
  with:
    ruby-version: '2.x' # Version range or exact version of a Ruby version to use, using semvers version range syntax.
- run: ruby hello.rb
```

Matrix Testing:
```yaml
jobs:
  build:
    runs-on: ubuntu-16.04
    strategy:
      matrix:
        ruby: [ '2.x', '3.x' ]
    name: Ruby ${{ matrix.ruby }} sample
    steps:
      - uses: actions/checkout@master
      - name: Setup ruby
        uses: actions/setup-ruby@v1
        with:
          ruby-version: ${{ matrix.ruby }}
          architecture: 'x64'
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
    - uses: actions/checkout@v1
    - name: Set up Ruby 2.6
      uses: actions/setup-ruby@v1
      with:
        ruby-version: 2.6.x
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
