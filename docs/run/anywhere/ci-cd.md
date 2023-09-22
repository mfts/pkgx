# `pkgx` & CI/CD

## GitHub Actions

### `run`

```sh
- uses: teaxyz/setup@v1
- run: pkgx go@1.20 build
```

`go build` will execute using go version ^1.20.


### `use`

```sh
- uses: teaxyz/setup@v1
  with:
    use: node@16
- run: node --version
```

`node` v16 will be available in your job.


### `activate`

```sh
- uses: actions/checkout@v3
- uses: teaxyz/setup@v1
```

The developer environment for your project will be available during the job.

## Other CI/CD Providers

```sh
eval "$(curl https://pkgx.xyz)"
```

`pkgx` will be installed and integrated. Use as per general terminal
guidelines, eg:

```sh
pkgx +node@16
```

{% hint style="info" %}
`pkgx` can make it easy to use the GNU or BSD versions of core utilities
across platforms.

```sh
pkgx +gnu.org/coreutils ls
```

{% endhint %}
